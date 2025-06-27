/**
 * Common API types and interfaces
 */

export type Period = 'annual' | 'quarter';
export type Exchange = string;
export type Currency = string;
export type Sector = string;
export type Industry = string;

/**
 * Standard API response wrapper
 */
export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Error response from FMP API
 */
export interface FMPErrorResponse {
  'Error Message': string;
}

/**
 * Date string in YYYY-MM-DD format
 */
export type DateString = string;

/**
 * Timestamp in ISO format
 */
export type Timestamp = string;

/**
 * Numeric value that can be null in API responses
 */
export type NumericValue = number | null;

/**
 * String value that can be null in API responses
 */
export type StringValue = string | null;

/**
 * Base interface for entities with timestamps
 */
export interface TimestampedEntity {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Base search parameters
 */
export interface BaseSearchParams {
  query?: string;
  limit?: number;
  page?: number;
}

/**
 * Date range parameters
 */
export interface DateRangeParams {
  from?: DateString;
  to?: DateString;
}

/**
 * Common stock identifiers
 */
export interface StockIdentifiers {
  symbol: string;
  exchange?: Exchange;
  cusip?: string;
  isin?: string;
  cik?: string;
}

/**
 * Common request parameters
 */
export interface CommonParams {
  period?: Period;
  limit?: number;
  datatype?: 'json' | 'csv';
  format?: 'json' | 'csv';
}

/**
 * Market hours status
 */
export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'after-hours';

/**
 * Price change information
 */
export interface PriceChange {
  change: NumericValue;
  changesPercentage: NumericValue;
}

/**
 * Volume information
 */
export interface VolumeInfo {
  volume: NumericValue;
  avgVolume: NumericValue;
}

/**
 * Market cap categories
 */
export type MarketCapCategory = 'mega' | 'large' | 'mid' | 'small' | 'micro' | 'nano';

/**
 * Stock types
 */
export type StockType = 'stock' | 'etf' | 'fund' | 'index' | 'crypto' | 'forex';

/**
 * Rating scale
 */
export type Rating = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

/**
 * Recommendation types
 */
export type Recommendation = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';

/**
 * Grade types
 */
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Financial statement types
 */
export type StatementType = 'income' | 'balance' | 'cash' | 'ratios';

/**
 * Time periods for historical data
 */
export type HistoricalPeriod = '1min' | '5min' | '15min' | '30min' | '1hour' | '4hour' | '1day';

/**
 * Sorting directions
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Common sorting parameters
 */
export interface SortParams {
  sortBy?: string;
  sortDirection?: SortDirection;
}