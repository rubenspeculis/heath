/**
 * Base error class for all FMP API related errors
 */
export abstract class FMPError extends Error {
  abstract readonly code: string;
  
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when API returns an error response
 */
export class FMPAPIError extends FMPError {
  readonly code = 'FMP_API_ERROR';
  
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly response?: unknown,
    cause?: Error
  ) {
    super(message, cause);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class FMPRateLimitError extends FMPError {
  readonly code = 'FMP_RATE_LIMIT_ERROR';
  
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    cause?: Error
  ) {
    super(message, cause);
  }
}

/**
 * Error thrown when authentication fails
 */
export class FMPAuthenticationError extends FMPError {
  readonly code = 'FMP_AUTHENTICATION_ERROR';
  
  constructor(message: string = 'Invalid API key', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when request times out
 */
export class FMPTimeoutError extends FMPError {
  readonly code = 'FMP_TIMEOUT_ERROR';
  
  constructor(message: string = 'Request timeout', public readonly timeout: number, cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when network request fails
 */
export class FMPNetworkError extends FMPError {
  readonly code = 'FMP_NETWORK_ERROR';
  
  constructor(message: string = 'Network error', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when validation fails
 */
export class FMPValidationError extends FMPError {
  readonly code = 'FMP_VALIDATION_ERROR';
  
  constructor(message: string, public readonly field?: string, cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class FMPConfigurationError extends FMPError {
  readonly code = 'FMP_CONFIGURATION_ERROR';
  
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}

/**
 * Type guard to check if error is an FMP error
 */
export function isFMPError(error: unknown): error is FMPError {
  return error instanceof FMPError;
}

/**
 * Type guard to check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is FMPRateLimitError {
  return error instanceof FMPRateLimitError;
}

/**
 * Type guard to check if error is an authentication error
 */
export function isAuthenticationError(error: unknown): error is FMPAuthenticationError {
  return error instanceof FMPAuthenticationError;
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): error is FMPValidationError {
  return error instanceof FMPValidationError;
}

/**
 * Extract error details from unknown error for logging
 */
export function extractErrorDetails(error: unknown): {
  message: string;
  code?: string;
  status?: number;
  stack?: string;
} {
  if (isFMPError(error)) {
    return {
      message: error.message,
      code: error.code,
      status: error instanceof FMPAPIError ? error.status : undefined,
      stack: error.stack,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }
  
  return {
    message: String(error),
  };
}