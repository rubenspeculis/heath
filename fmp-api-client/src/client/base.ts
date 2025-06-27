import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ResolvedFMPClientConfig } from './config.js';
import { RateLimiter, sleep, calculateBackoff } from '../utils/rateLimit.js';
import {
  FMPAPIError,
  FMPRateLimitError,
  FMPAuthenticationError,
  FMPTimeoutError,
  FMPNetworkError,
  extractErrorDetails,
} from '../utils/errors.js';

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  skipRateLimit?: boolean;
  cacheTtl?: number;
}

export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Base HTTP client for FMP API with authentication, retry logic, and rate limiting
 */
export class BaseHttpClient {
  private readonly axios: AxiosInstance;
  private readonly rateLimiter: RateLimiter;
  private readonly config: ResolvedFMPClientConfig;

  constructor(config: ResolvedFMPClientConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(config.rateLimit);

    // Create axios instance with default configuration
    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'User-Agent': config.userAgent,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for logging
    this.axios.interceptors.request.use(
      request => {
        if (this.config.logging.enabled && this.config.logging.requests) {
          this.log('info', `Request: ${request.method?.toUpperCase()} ${request.url}`, {
            params: request.params,
            headers: this.sanitizeHeaders(request.headers),
          });
        }
        return request;
      },
      error => {
        if (this.config.logging.enabled && this.config.logging.errors) {
          this.log('error', 'Request interceptor error', extractErrorDetails(error));
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axios.interceptors.response.use(
      response => {
        if (this.config.logging.enabled && this.config.logging.responses) {
          this.log('info', `Response: ${response.status} ${response.statusText}`, {
            url: response.config.url,
            dataSize: JSON.stringify(response.data).length,
          });
        }
        return response;
      },
      error => {
        if (this.config.logging.enabled && this.config.logging.errors) {
          this.log('error', 'Response interceptor error', extractErrorDetails(error));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request with retry logic and rate limiting
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>('GET', endpoint, { params, ...options });
  }

  /**
   * Make a POST request with retry logic and rate limiting
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>('POST', endpoint, { data, ...options });
  }

  /**
   * Make a PUT request with retry logic and rate limiting
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>('PUT', endpoint, { data, ...options });
  }

  /**
   * Make a DELETE request with retry logic and rate limiting
   */
  async delete<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): {
    tokensRemaining: number;
    requestsInLastMinute: number;
    resetTime: number;
  } {
    return this.rateLimiter.getStatus();
  }

  /**
   * Reset rate limiter
   */
  resetRateLimit(): void {
    this.rateLimiter.reset();
  }

  /**
   * Get current configuration
   */
  getConfig(): ResolvedFMPClientConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (partial update)
   */
  updateConfig(newConfig: Partial<ResolvedFMPClientConfig>): void {
    Object.assign(this.config, newConfig);
    
    // Update axios instance if needed
    if (newConfig.baseUrl) {
      this.axios.defaults.baseURL = newConfig.baseUrl;
    }
    if (newConfig.timeout) {
      this.axios.defaults.timeout = newConfig.timeout;
    }
    if (newConfig.headers) {
      Object.assign(this.axios.defaults.headers, newConfig.headers);
    }
  }

  /**
   * Core request method with retry logic and rate limiting
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions & {
      params?: Record<string, unknown>;
      data?: unknown;
    } = {}
  ): Promise<APIResponse<T>> {
    const { timeout, retries, skipRateLimit, params, data, ...restOptions } = options;
    const maxRetries = retries ?? this.config.retry.attempts;

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Apply rate limiting
        if (!skipRateLimit) {
          await this.rateLimiter.checkAndConsume();
        }

        // Prepare request config
        const requestConfig: AxiosRequestConfig = {
          method,
          url: endpoint,
          timeout: timeout ?? this.config.timeout,
          params: {
            ...params,
            apikey: this.config.apiKey, // Add API key to all requests
          },
          data,
          ...restOptions,
        };

        // Make the request
        const response = await this.axios.request<T>(requestConfig);

        // Return standardized response
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as Record<string, string>,
        };
      } catch (error) {
        lastError = error as Error;
        const errorDetails = this.handleError(error);

        // Don't retry on certain errors
        if (
          errorDetails instanceof FMPAuthenticationError ||
          errorDetails instanceof FMPRateLimitError ||
          !this.config.retry.enabled ||
          attempt === maxRetries
        ) {
          throw errorDetails;
        }

        // Calculate backoff delay
        const delay = this.config.retry.backoff === 'exponential'
          ? calculateBackoff(attempt, this.config.retry.baseDelay)
          : this.config.retry.baseDelay * (attempt + 1);

        this.log('warn', `Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`, {
          error: extractErrorDetails(errorDetails),
          endpoint,
          attempt: attempt + 1,
          delay,
        });

        await sleep(delay);
      }
    }

    throw lastError ?? new Error('Request failed after retries');
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Handle different types of errors
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        return new FMPTimeoutError(
          'Request timeout',
          this.config.timeout,
          axiosError
        );
      }

      if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
        return new FMPNetworkError(
          'Network connection failed',
          axiosError
        );
      }

      if (axiosError.response) {
        const { status, statusText, data } = axiosError.response;

        // Handle specific HTTP status codes
        switch (status) {
          case 401:
          case 403:
            return new FMPAuthenticationError(
              'Invalid API key or insufficient permissions',
              axiosError
            );
          case 429:
            return new FMPRateLimitError(
              'Rate limit exceeded',
              this.extractRetryAfter(axiosError.response.headers),
              axiosError
            );
          default:
            return new FMPAPIError(
              `API request failed: ${statusText}`,
              status,
              statusText,
              data,
              axiosError
            );
        }
      }

      return new FMPNetworkError(
        `Network error: ${axiosError.message}`,
        axiosError
      );
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(`Unknown error: ${String(error)}`);
  }

  /**
   * Extract retry-after header value
   */
  private extractRetryAfter(headers: Record<string, unknown>): number | undefined {
    const retryAfter = headers['retry-after'] ?? headers['Retry-After'];
    if (typeof retryAfter === 'string') {
      const seconds = parseInt(retryAfter, 10);
      return isNaN(seconds) ? undefined : seconds * 1000;
    }
    return undefined;
  }

  /**
   * Sanitize headers for logging (remove sensitive information)
   */
  private sanitizeHeaders(headers: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...headers };
    
    // Remove or mask sensitive headers
    if (sanitized.Authorization) {
      sanitized.Authorization = '[REDACTED]';
    }
    
    return sanitized;
  }

  /**
   * Simple logging method
   */
  private log(level: string, message: string, meta?: unknown): void {
    if (!this.config.logging.enabled) {
      return;
    }

    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = logLevels.indexOf(this.config.logging.level);
    const messageLevelIndex = logLevels.indexOf(level);

    if (messageLevelIndex >= currentLevelIndex) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [FMP-API] [${level.toUpperCase()}] ${message}`;
      
      if (meta) {
        console.log(logMessage, meta);
      } else {
        console.log(logMessage);
      }
    }
  }
}