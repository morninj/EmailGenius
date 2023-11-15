import { ALLOW_DEBUG_MESSAGES } from '../config';

// Log a debugging message to the console
export default function debugLog(message: string): void {
  if (ALLOW_DEBUG_MESSAGES) {
    // eslint-disable-next-line no-console
    console.log(`[EmailGenius extension] ${message}`);
  }
}
