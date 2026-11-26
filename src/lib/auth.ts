import bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { prisma } from './prisma';

// Crypto is globally available in Node.js, no import needed

// Emails are stored and looked up in one canonical form, so "User@X.com" and
// "user@x.com" cannot become two separate accounts.
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// Password hashing and verification
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Session token generation and hashing
export const generateSessionToken = (): string => {
  // Generate a cryptographically secure random token
  return Array.from(
    crypto.getRandomValues(new Uint8Array(32))
  ).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const hashSessionToken = async (token: string): Promise<string> => {
  // Deterministic hash: the same token must always produce the same value so
  // sessions can be looked up. bcrypt salts every hash, which made lookups
  // impossible and every session invalid.
  return createHash('sha256').update(token).digest('hex');
};

// Session creation
export const createSession = async (
  userId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  // Generate session token
  const token = generateSessionToken();
  const tokenHash = await hashSessionToken(token);

  // Set expiration (e.g., 30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Create session record
  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return { session, token };
};

// Session validation
export const validateSession = async (token: string) => {
  if (!token) return null;

  // Find session by token hash
  const tokenHash = await hashSessionToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) return null;

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    // Delete expired session
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  // Track activity, but do not write on every request: validateSession runs
  // several times per page render, and an unconditional update turned each
  // render into extra database writes. Once per 15 minutes is enough.
  const lastSeen = session.updatedAt.getTime();
  if (Date.now() - lastSeen > 15 * 60 * 1000) {
    await prisma.session.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });
  }

  // Return user without password
  const { password, ...userWithoutPassword } = session.user;
  return { user: userWithoutPassword, session };
};

// Session deletion (logout)
export const deleteSession = async (token: string) => {
  if (!token) return;

  const tokenHash = await hashSessionToken(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};