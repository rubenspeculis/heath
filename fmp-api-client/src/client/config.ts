import { RateLimitConfig } from '../utils/rateLimit.js';
import { FMPConfigurationError } from '../utils/errors.js';

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum number of entries
}

export interface RetryConfig {
  enabled: boolean;
  attempts: number;
  backoff: 'linear' | 'exponential';
  baseDelay: number; // Base delay in milliseconds
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  requests: boolean;
  responses: boolean;
  errors: boolean;
}

export interface FMPClientConfig {
  /**
   * FMP API key (required)
   */
  apiKey: string;

  /**
   * Base URL for FMP API
   * @default 'https://financialmodelingprep.com/api/v3'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Rate limiting configuration
   */
  rateLimit?: RateLimitConfig;

  /**
   * Retry configuration
   */
  retry?: RetryConfig;

  /**
   * Caching configuration
   */
  cache?: CacheConfig;

  /**
   * Logging configuration
   */
  logging?: LoggingConfig;

  /**
   * Custom headers to include with requests
   */
  headers?: Record<string, string>;

  /**
   * User agent string
   */
  userAgent?: string;
}

export interface ResolvedFMPClientConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  rateLimit: Required<RateLimitConfig>;
  retry: RetryConfig;
  cache: CacheConfig;
  logging: LoggingConfig;
  headers: Record<string, string>;
  userAgent: string;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Omit<ResolvedFMPClientConfig, 'apiKey'> = {
  baseUrl: 'https://financialmodelingprep.com/api/v3',
  timeout: 30000,
  rateLimit: {
    requestsPerMinute: 250, // FMP free tier default
    burstSize: 250,
    enabled: true,
  },
  retry: {
    enabled: true,
    attempts: 3,
    backoff: 'exponential',
    baseDelay: 1000,
  },
  cache: {
    enabled: false,
    ttl: 300, // 5 minutes
    maxSize: 1000,
  },
  logging: {
    enabled: false,
    level: 'info',
    requests: false,
    responses: false,
    errors: true,
  },
  headers: {},
  userAgent: '@heath/fmp-api-client/1.0.0',
};

/**
 * Validate and resolve configuration
 */
export function resolveConfig(config: FMPClientConfig): ResolvedFMPClientConfig {
  // Validate required fields
  if (!config.apiKey || typeof config.apiKey !== 'string') {
    throw new FMPConfigurationError('API key is required and must be a string');
  }

  if (config.apiKey.trim().length === 0) {
    throw new FMPConfigurationError('API key cannot be empty');
  }

  // Validate optional fields
  if (config.timeout !== undefined && (config.timeout <= 0 || config.timeout > 300000)) {
    throw new FMPConfigurationError('Timeout must be between 1 and 300000 milliseconds');
  }

  if (config.baseUrl !== undefined && !isValidUrl(config.baseUrl)) {
    throw new FMPConfigurationError('Base URL must be a valid HTTP/HTTPS URL');
  }

  if (config.rateLimit?.requestsPerMinute !== undefined && config.rateLimit.requestsPerMinute <= 0) {
    throw new FMPConfigurationError('Rate limit requests per minute must be greater than 0');
  }

  if (config.retry?.attempts !== undefined && config.retry.attempts < 0) {
    throw new FMPConfigurationError('Retry attempts must be non-negative');
  }

  if (config.cache?.ttl !== undefined && config.cache.ttl < 0) {
    throw new FMPConfigurationError('Cache TTL must be non-negative');
  }

  // Merge with defaults
  return {
    apiKey: config.apiKey.trim(),
    baseUrl: config.baseUrl ?? DEFAULT_CONFIG.baseUrl,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
    rateLimit: {
      ...DEFAULT_CONFIG.rateLimit,
      ...config.rateLimit,
    },
    retry: {
      ...DEFAULT_CONFIG.retry,
      ...config.retry,
    },
    cache: {
      ...DEFAULT_CONFIG.cache,
      ...config.cache,
    },
    logging: {
      ...DEFAULT_CONFIG.logging,
      ...config.logging,
    },
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...config.headers,
    },
    userAgent: config.userAgent ?? DEFAULT_CONFIG.userAgent,
  };
}

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv(): Partial<FMPClientConfig> {
  const config: Partial<FMPClientConfig> = {};

  // API Key
  if (process.env.FMP_API_KEY) {
    config.apiKey = process.env.FMP_API_KEY;
  }

  // Base URL
  if (process.env.FMP_BASE_URL) {
    config.baseUrl = process.env.FMP_BASE_URL;
  }

  // Timeout
  if (process.env.FMP_TIMEOUT) {
    const timeout = parseInt(process.env.FMP_TIMEOUT, 10);
    if (!isNaN(timeout)) {
      config.timeout = timeout;
    }
  }

  // Rate limit
  if (process.env.FMP_RATE_LIMIT_RPM) {
    const rpm = parseInt(process.env.FMP_RATE_LIMIT_RPM, 10);
    if (!isNaN(rpm)) {
      config.rateLimit = { requestsPerMinute: rpm };
    }
  }

  // Logging
  if (process.env.FMP_LOGGING === 'true') {
    config.logging = { enabled: true, level: 'info', requests: true, responses: true, errors: true };
  }

  return config;
}

/**
 * Create configuration from environment variables and overrides
 */
export function createConfig(overrides: Partial<FMPClientConfig> = {}): ResolvedFMPClientConfig {
  const envConfig = loadConfigFromEnv();
  const mergedConfig = { ...envConfig, ...overrides };

  if (!mergedConfig.apiKey) {
    throw new FMPConfigurationError(
      'API key is required. Provide it via config or set FMP_API_KEY environment variable.'
    );
  }

  return resolveConfig(mergedConfig as FMPClientConfig);
}

/**
 * Validate if string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}