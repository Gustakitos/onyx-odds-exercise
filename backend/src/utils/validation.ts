export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMatchFilters(filters: any): ValidationResult {
  const errors: string[] = [];

  if (filters.sport && typeof filters.sport !== 'string') {
    errors.push('Sport filter must be a string');
  }

  if (filters.status && !['scheduled', 'in_progress', 'completed'].includes(filters.status)) {
    errors.push('Status must be one of: scheduled, in_progress, completed');
  }

  if (filters.limit !== undefined) {
    const limit = parseInt(filters.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }

  if (filters.offset !== undefined) {
    const offset = parseInt(filters.offset);
    if (isNaN(offset) || offset < 0) {
      errors.push('Offset must be a non-negative number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateId(id: any): ValidationResult {
  const errors: string[] = [];
  const numId = parseInt(id);

  if (isNaN(numId) || numId < 1) {
    errors.push('ID must be a positive integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateSportName(name: any): ValidationResult {
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Sport name must be a non-empty string');
  }

  if (name && name.length > 50) {
    errors.push('Sport name must be 50 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function parseIntSafely(value: any, defaultValue: number = 0): number {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

