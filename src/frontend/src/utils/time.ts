export function nanosToMillis(nanos: bigint): number {
  return Number(nanos / BigInt(1_000_000));
}

export function millisToNanos(millis: number): bigint {
  return BigInt(millis) * BigInt(1_000_000);
}

export function formatTimeRemaining(endTime: bigint): string {
  const now = Date.now();
  const endMillis = nanosToMillis(endTime);
  const remaining = endMillis - now;

  if (remaining <= 0) {
    return 'Voting closed';
  }

  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s remaining`;
  } else {
    return `${seconds}s remaining`;
  }
}

export function getTimeRemaining(endTime: bigint): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = Date.now();
  const endMillis = nanosToMillis(endTime);
  const remaining = endMillis - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    isExpired: false,
  };
}
