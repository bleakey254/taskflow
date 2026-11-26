'use server';

import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import {
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  normalizeEmail,
} from '@/lib/auth';
import { consume, reset as resetRateLimit, retryMessage } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus } from '@/types/prisma';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_LIMIT = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const REGISTER_LIMIT = 10;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

async function clientAddress(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headerStore.get('x-real-ip') ?? 'local';
}

// Registration action
export async function registerUser(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const rawEmail = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as Role;

  const email = rawEmail ? normalizeEmail(rawEmail) : '';
  const trimmedName = name?.trim();

  // Basic validation
  if (!email || !password || !trimmedName || !role) {
    throw new Error('All fields are required');
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error('Enter a valid email address');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (![Role.WORKER, Role.CLIENT].includes(role)) {
    throw new Error('Invalid role selected');
  }

  const limit = consume(`register:${await clientAddress()}`, REGISTER_LIMIT, REGISTER_WINDOW_MS);
  if (!limit.allowed) {
    throw new Error(retryMessage(limit.retryAfterSeconds));
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  try {
    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: trimmedName,
        role: role as Role,
        status: UserStatus.ACTIVE,
      },
    });

    // Create profile based on role
    if (role === Role.WORKER) {
      await prisma.workerProfile.create({
        data: {
          userId: user.id,
        },
      });

      // Every worker needs a wallet before they can earn or withdraw.
      await prisma.wallet.create({
        data: {
          workerId: user.id,
        },
      });
    } else if (role === Role.CLIENT) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Auto-login after registration
    const { session, token } = await createSession(user.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('An error occurred during registration');
  }

  // Redirect stays outside the try block: redirect() signals by throwing
  // NEXT_REDIRECT, which the catch above would swallow into a sign-up failure.
  redirect('/dashboard');
}

// Login action
export async function loginUser(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const rawEmail = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!rawEmail || !password) {
    throw new Error('Email and password are required');
  }

  const email = normalizeEmail(rawEmail);
  const rateLimitKey = `login:${await clientAddress()}:${email}`;
  const limit = consume(rateLimitKey, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!limit.allowed) {
    throw new Error(retryMessage(limit.retryAfterSeconds));
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return generic error to prevent email enumeration
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    throw new Error('Account is deactivated');
  }

  // Successful login clears the failure window for this address.
  resetRateLimit(rateLimitKey);

  try {
    // Create session
    const { session, token } = await createSession(user.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: session.expiresAt,
    });

  } catch (error) {
    console.error('Login error:', error);
    throw new Error('An error occurred during login');
  }

  // Redirect stays outside the try block: redirect() signals by throwing
  // NEXT_REDIRECT, which the catch above would swallow into a login failure.
  if (user.role === Role.ADMIN) {
    redirect('/admin/dashboard');
  }

  redirect('/dashboard');
}

// Logout action
export async function logoutUser(
  _prevState: unknown | undefined,
  formData: FormData
): Promise<never> {
  'use server';

  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (token) {
    await deleteSession(token);
    cookieStore.delete('session-token');
  }

  const result = redirect('/login');
  return result;
}

// Get current user action
export async function getCurrentUser(): Promise<{ user: null | { id: string; email: string; name: string; role: string; status: string; createdAt: Date; updatedAt: Date } }> {
  'use server';

  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    return { user: null };
  }

  const validationResult = await validateSession(token);

  if (!validationResult) {
    return { user: null };
  }

  return { user: validationResult.user };
}

// Simple sign out action (no form data required)
export async function signOut(): Promise<void> {
  'use server';

  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (token) {
    await deleteSession(token);
    cookieStore.delete('session-token');
  }
}
