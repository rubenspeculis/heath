import { FMPRateLimitError } from './errors.js';

export interface RateLimitConfig {
  requestsPerMinute: number;
  burstSize?: number;
  enabled?: boolean;
}

export interface RateLimitState {
  tokens: number;
  lastRefill: number;
  requests: Array<{ timestamp: number }>;
}

/**
 * Token bucket rate limiter implementation
 */
export class RateLimiter {
  private state: RateLimitState;
  private readonly config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      requestsPerMinute: config.requestsPerMinute,
      burstSize: config.burstSize ?? config.requestsPerMinute,
      enabled: config.enabled ?? true,
    };

    this.state = {
      tokens: this.config.burstSize,
      lastRefill: Date.now(),
      requests: [],
    };
  }

  /**
   * Check if request can be made and consume a token
   */
  async checkAndConsume(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    this.refillTokens();
    this.cleanOldRequests();

    if (this.state.tokens <= 0) {
      const waitTime = this.calculateWaitTime();
      throw new FMPRateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`,
        waitTime
      );
    }

    this.state.tokens -= 1;
    this.state.requests.push({ timestamp: Date.now() });
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    tokensRemaining: number;
    requestsInLastMinute: number;
    resetTime: number;
  } {
    this.refillTokens();
    this.cleanOldRequests();

    return {
      tokensRemaining: this.state.tokens,
      requestsInLastMinute: this.state.requests.length,
      resetTime: this.calculateResetTime(),
    };
  }

  /**
   * Reset rate limiter state
   */
  reset(): void {
    this.state = {
      tokens: this.config.burstSize,
      lastRefill: Date.now(),
      requests: [],
    };
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refillTokens(): void {
    const now = Date.now();
    const timeSinceLastRefill = now - this.state.lastRefill;
    const tokensToAdd = Math.floor(
      (timeSinceLastRefill / (60 * 1000)) * this.config.requestsPerMinute
    );

    if (tokensToAdd > 0) {
      this.state.tokens = Math.min(this.config.burstSize, this.state.tokens + tokensToAdd);
      this.state.lastRefill = now;
    }
  }

  /**
   * Remove requests older than 1 minute
   */
  private cleanOldRequests(): void {
    const oneMinuteAgo = Date.now() - 60 * 1000;
    this.state.requests = this.state.requests.filter(
      request => request.timestamp > oneMinuteAgo
    );
  }

  /**
   * Calculate how long to wait before next request
   */
  private calculateWaitTime(): number {
    if (this.state.requests.length === 0) {
      return 0;
    }

    const oldestRequest = this.state.requests[0];
    const timeUntilOldestExpires = oldestRequest.timestamp + 60 * 1000 - Date.now();
    return Math.max(0, timeUntilOldestExpires);
  }

  /**
   * Calculate when rate limit will reset
   */
  private calculateResetTime(): number {
    const now = Date.now();
    const nextRefillTime = this.state.lastRefill + (60 * 1000) / this.config.requestsPerMinute;
    return Math.max(now, nextRefillTime);
  }
}

/**
 * Sleep for specified milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exponential backoff calculation
 */
export function calculateBackoff(attempt: number, baseDelay: number = 1000): number {
  const jitter = Math.random() * 0.1; // Add 10% jitter
  return Math.min(baseDelay * Math.pow(2, attempt) * (1 + jitter), 30000); // Max 30 seconds
}