import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique ID using UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Generates a custom ID with a prefix
 */
export function generateIdWithPrefix(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}
