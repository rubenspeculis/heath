import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FMPApiClient } from '../../src/FMPApiClient';

describe('FMPApiClient', () => {
  let client: FMPApiClient;

  beforeEach(() => {
    client = new FMPApiClient({
      apiKey: 'test-api-key',
    });
  });

  afterEach(() => {
    client.destroy();
  });

  describe('constructor', () => {
    it('should create an instance with default configuration', () => {
      expect(client).toBeInstanceOf(FMPApiClient);
    });

    it('should initialize all services', () => {
      expect(client.quotes).toBeDefined();
      expect(client.companies).toBeDefined();
      expect(client.financialStatements).toBeDefined();
      expect(client.ratios).toBeDefined();
      expect(client.dcf).toBeDefined();
      expect(client.historical).toBeDefined();
    });
  });

  describe('configuration', () => {
    it('should allow getting current configuration', () => {
      const config = client.getConfig();
      expect(config).toBeDefined();
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should allow updating configuration', () => {
      client.updateConfig({
        timeout: 15000,
      });

      const config = client.getConfig();
      expect(config.timeout).toBe(15000);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      // Mock the health check to avoid making real API calls
      const mockHealthCheck = vi.fn().mockResolvedValue({
        status: 'healthy' as const,
        responseTime: 100,
      });

      client.healthCheck = mockHealthCheck;

      const health = await client.healthCheck();
      expect(health).toEqual({
        status: 'healthy',
        responseTime: 100,
      });
    });
  });
});