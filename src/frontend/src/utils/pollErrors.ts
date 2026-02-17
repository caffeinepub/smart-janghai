export function normalizePollError(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for common backend trap messages
  if (errorMessage.includes('already voted')) {
    return 'You have already voted in this poll.';
  }

  if (errorMessage.includes('Poll has ended') || errorMessage.includes('expired')) {
    return 'Voting has closed. This poll is no longer accepting votes.';
  }

  if (errorMessage.includes('Poll not available')) {
    return 'No active poll is currently available.';
  }

  if (errorMessage.includes('Candidate') && errorMessage.includes('not found')) {
    return 'The selected candidate is not valid.';
  }

  if (errorMessage.includes('Unauthorized') || errorMessage.includes('authenticated')) {
    return 'You must be logged in to vote. Please log in with Internet Identity.';
  }

  // Generic fallback
  return 'Unable to submit vote. Please try again.';
}

export function isPollAuthError(error: unknown): boolean {
  if (!error) return false;
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage.includes('Unauthorized') || errorMessage.includes('authenticated');
}
