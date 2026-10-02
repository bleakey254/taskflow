// Custom TypeScript interfaces for Prisma models
// Workaround for @prisma/client import issues

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number | { toString: () => string }; // Decimal representation
  referenceId?: string | null;
  referenceType?: string | null;
  metadata?: any; // Json type
  createdAt: Date;
}

export enum WalletTransactionType {
  TASK_EARNING = 'TASK_EARNING',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  createdAt: Date;
}

export enum NotificationType {
  TASK_APPROVED = 'TASK_APPROVED',
  TASK_REJECTED = 'TASK_REJECTED',
  TASK_PUBLISHED = 'TASK_PUBLISHED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  WITHDRAWAL_SUCCESS = 'WITHDRAWAL_SUCCESS',
  WITHDRAWAL_FAILURE = 'WITHDRAWAL_FAILURE',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE'
}

export interface Submission {
  id: string;
  taskId: string;
  workerId: string;
  content: string;
  attachments?: any; // Json type
  status: SubmissionStatus;
  submittedAt: Date;
  reviewedAt?: Date | null;
  reviewerId?: string | null;
  feedback?: string | null;
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum TaskStatus {
  DRAFT = 'DRAFT',
  SUBMITTED_FOR_APPROVAL = 'SUBMITTED_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  VIEWED = 'VIEWED',
  UNLOCKED = 'UNLOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  APPROVED_BY_REVIEWER = 'APPROVED_BY_REVIEWER',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum Role {
  WORKER = 'WORKER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentPurpose {
  TASK_UNLOCK = 'TASK_UNLOCK',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Simple User interface for basic needs
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'WORKER' | 'CLIENT' | 'ADMIN';
}

// Simple Wallet interface for basic needs
export interface Wallet {
  id: string;
  workerId: string;
  balance: number | { toString: () => string }; // Decimal representation
}