import { describe, it, expect } from 'vitest';
import { createConfig } from '../../../src/client/config';

describe('Config', () => {
  describe('createConfig', () => {
    it('should create config with default values', () => {
      const config = createConfig({
        apiKey: 'test-key',
      });

      expect(config.apiKey).toBe('test-key');
      expect(config.baseUrl).toBe('https://financialmodelingprep.com/api/v3');
      expect(config.timeout).toBe(30000);
      expect(config.retry.enabled).toBe(true);
      expect(config.retry.attempts).toBe(3);
      expect(config.rateLimit.requestsPerMinute).toBe(250);
    });

    it('should merge provided config with defaults', () => {
      const config = createConfig({
        apiKey: 'test-key',
        timeout: 15000,
        retry: {
          enabled: false,
          attempts: 1,
        },
      });

      expect(config.apiKey).toBe('test-key');
      expect(config.timeout).toBe(15000);
      expect(config.retry.enabled).toBe(false);
      expect(config.retry.attempts).toBe(1);
      // Should still have defaults for other properties
      expect(config.baseUrl).toBe('https://financialmodelingprep.com/api/v3');
    });

    it('should throw error if no API key provided', () => {
      expect(() => {
        createConfig({} as any);
      }).toThrow();
    });
  });
});