'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { hashPassword, verifyPassword, createSession, validateSession, deleteSession, getUserById } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus } from '@/types/prisma';

// Registration action
export async function registerUser(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;

  // Basic validation
  if (!email || !password || !name || !role) {
    throw new Error('All fields are required');
  }

  if (![Role.WORKER, Role.CLIENT].includes(role)) {
    throw new Error('Invalid role selected');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Return generic error to prevent email enumeration
    throw new Error('Invalid credentials');
  }

  try {
    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role,
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

    return redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('An error occurred during registration');
  }
}

// Login action
export async function loginUser(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required');
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

    // Redirect based on role
    if (user.role === Role.ADMIN) {
      return redirect('/admin/dashboard');
    } else {
      return redirect('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('An error occurred during login');
  }
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