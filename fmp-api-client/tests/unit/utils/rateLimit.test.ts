import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from '../../../src/utils/rateLimit';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      requestsPerMinute: 10,
      burstSize: 5,
    });
  });

  describe('checkAndConsume', () => {
    it('should allow requests within rate limit', async () => {
      // Should not throw for the first few requests
      await expect(rateLimiter.checkAndConsume()).resolves.toBeUndefined();
      await expect(rateLimiter.checkAndConsume()).resolves.toBeUndefined();
      await expect(rateLimiter.checkAndConsume()).resolves.toBeUndefined();
    });

    it('should have correct initial status', () => {
      const status = rateLimiter.getStatus();
      expect(status.tokensRemaining).toBe(5); // burst size
      expect(status.requestsInLastMinute).toBe(0);
      expect(status.resetTime).toBeGreaterThan(Date.now());
    });
  });

  describe('getStatus', () => {
    it('should return current rate limit status', () => {
      const status = rateLimiter.getStatus();
      expect(status).toHaveProperty('tokensRemaining');
      expect(status).toHaveProperty('requestsInLastMinute');
      expect(status).toHaveProperty('resetTime');
    });
  });

  describe('reset', () => {
    it('should reset the rate limiter state', async () => {
      // Consume some tokens
      await rateLimiter.checkAndConsume();
      await rateLimiter.checkAndConsume();

      let status = rateLimiter.getStatus();
      expect(status.tokensRemaining).toBeLessThan(5);

      // Reset and check
      rateLimiter.reset();
      status = rateLimiter.getStatus();
      expect(status.tokensRemaining).toBe(5);
      expect(status.requestsInLastMinute).toBe(0);
    });
  });
});