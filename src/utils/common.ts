/**
 * Formats a date to a readable string
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};


export const formatAmount = (amount: number) => {
  // Divide by 100 because transaction amounts are stored in cents
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount/100);
};

/**
 * Formats how long ago/from now a date is (e.g. "2 hours ago", "in 3 days").
 */
export const formatTimeAgo = (
  date: Date | string | null | undefined,
  options?: { now?: Date | string; assumeUtcIfNoTz?: boolean }
): string => {
  if (!date) return 'N/A';

  const parseDateLike = (d: Date | string, assumeUtcIfNoTz: boolean): Date => {
    if (d instanceof Date) return d;
    const s = d as string;
    // If string already includes timezone info (Z or +/-HH:MM), rely on native parsing
    const hasTz = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(s);
    if (hasTz) return new Date(s);

    if (assumeUtcIfNoTz) {
      // Date-only: YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return new Date(`${s}T00:00:00Z`);
      }
      // Date-time without TZ: append Z to treat as UTC
      return new Date(`${s}Z`);
    }

    // Fallback: treat as local time
    return new Date(s);
  };

  try {
    const assumeUtcIfNoTz = options?.assumeUtcIfNoTz ?? false;
    const target = parseDateLike(date as Date | string, assumeUtcIfNoTz);
    if (isNaN(target.getTime())) return 'Invalid Date';

    let nowMs: number;
    if (options?.now != null) {
      if (options.now instanceof Date) {
        nowMs = options.now.getTime();
      } else {
        nowMs = parseDateLike(options.now, assumeUtcIfNoTz).getTime();
      }
    } else {
      nowMs = Date.now();
    }

    const diffMs = target.getTime() - nowMs; // negative => past, positive => future
    const absSec = Math.abs(diffMs) / 1000;

    if (absSec < 5) return 'just now';

    const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
      { unit: 'year', seconds: 60 * 60 * 24 * 365 },
      { unit: 'month', seconds: 60 * 60 * 24 * 30 },
      { unit: 'week', seconds: 60 * 60 * 24 * 7 },
      { unit: 'day', seconds: 60 * 60 * 24 },
      { unit: 'hour', seconds: 60 * 60 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ];

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    for (const { unit, seconds } of units) {
      if (absSec >= seconds || unit === 'second') {
        const value = Math.round(diffMs / (seconds * 1000));
        return rtf.format(value as number, unit);
      }
    }

    return 'just now';
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats a date and time to a readable string
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number | null | undefined, currency = 'USD'): string => {
  if (amount == null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 */
export const toTitleCase = (text: string): string => {
  if (!text) return text;
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Generates a random ID (simple implementation)
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function call
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Safely gets a nested property value
 */
export const getNestedValue = (obj: any, path: string, defaultValue?: any): any => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};
