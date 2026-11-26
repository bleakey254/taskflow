// Shared marketplace constants.

export const UNLOCK_FEE = 0.8;
export const CURRENCY = 'USD';
export const MIN_WITHDRAWAL = 1;
export const MIN_TASK_BUDGET = UNLOCK_FEE;

export const TASK_FEED_STATUSES = ['PUBLISHED', 'VIEWED'] as const;

export function formatMoney(value: number | string | { toString(): string }): string {
  return `$${Number(value.toString()).toFixed(2)}`;
}
