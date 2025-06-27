import { describe, it, expect } from 'vitest';

// Simple test to verify Vitest is working
describe('Basic Test Suite', () => {
  it('should run a basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should work with async functions', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});