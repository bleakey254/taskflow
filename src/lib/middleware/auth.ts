import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Role } from '@/types/prisma';

// Require authentication
export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    // Redirect to login if not authenticated
    redirect('/login');
  }

  const validationResult = await validateSession(token);

  if (!validationResult) {
    // Clear invalid cookie and redirect to login
    const cookieStore = await cookies();
    cookieStore.delete('session-token');
    redirect('/login');
  }

  return validationResult.user;
}

// Require specific role
export async function requireRole(allowedRoles: Role[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    redirect('/login');
  }

  const validationResult = await validateSession(token);

  if (!validationResult) {
    const cookieStore = await cookies();
    cookieStore.delete('session-token');
    redirect('/login');
  }

  const { user } = validationResult;

  if (!allowedRoles.includes(user.role)) {
    // User doesn't have required role
    redirect('/unauthorized');
  }

  return user;
}

// Get current user (optional)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;

  if (!token) {
    return null;
  }

  const validationResult = await validateSession(token);

  if (!validationResult) {
    return null;
  }

  return validationResult.user;
}