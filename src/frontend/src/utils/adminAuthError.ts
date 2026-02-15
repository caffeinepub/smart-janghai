/**
 * Utility to normalize authorization errors from backend traps
 * Maps backend error messages to stable English messages for UI display
 */
export function normalizeAuthError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for common authorization error patterns
    if (message.includes('unauthorized') || message.includes('only admins')) {
      return 'Unauthorized: Admin access required';
    }
    
    if (message.includes('actor not available')) {
      return 'Connection error: Please try again';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function isAuthorizationError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('unauthorized') || message.includes('only admins');
  }
  return false;
}
