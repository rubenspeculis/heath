/**
 * Standard API response wrappers
 */

import { APIResponse, PaginatedResponse } from './api.js';
import { CompanyProfile, CompanyQuote, CompanySearchResult, RealTimeQuote } from './company.js';
import { IncomeStatement, BalanceSheetStatement, CashFlowStatement, FinancialGrowth } from './financials.js';
import { StockQuote, HistoricalPrice, IntradayPrice, EarningsCalendar } from './quotes.js';
import { FinancialRatios, KeyMetrics, TTMRatios } from './ratios.js';
import { DCFValuation, AdvancedDCF, WACC } from './dcf.js';

// Company API responses
export type CompanyProfileResponse = APIResponse<CompanyProfile[]>;
export type CompanyQuoteResponse = APIResponse<CompanyQuote[]>;
export type CompanySearchResponse = APIResponse<CompanySearchResult[]>;
export type RealTimeQuoteResponse = APIResponse<RealTimeQuote[]>;

// Financial statements responses
export type IncomeStatementResponse = APIResponse<IncomeStatement[]>;
export type BalanceSheetResponse = APIResponse<BalanceSheetStatement[]>;
export type CashFlowResponse = APIResponse<CashFlowStatement[]>;
export type FinancialGrowthResponse = APIResponse<FinancialGrowth[]>;

// Quote responses
export type StockQuoteResponse = APIResponse<StockQuote[]>;
export type HistoricalPriceResponse = APIResponse<{
  symbol: string;
  historical: HistoricalPrice[];
}>;
export type IntradayPriceResponse = APIResponse<IntradayPrice[]>;
export type EarningsCalendarResponse = APIResponse<EarningsCalendar[]>;

// Ratios responses
export type FinancialRatiosResponse = APIResponse<FinancialRatios[]>;
export type KeyMetricsResponse = APIResponse<KeyMetrics[]>;
export type TTMRatiosResponse = APIResponse<TTMRatios[]>;

// DCF responses
export type DCFResponse = APIResponse<DCFValuation[]>;
export type AdvancedDCFResponse = APIResponse<AdvancedDCF[]>;
export type WACCResponse = APIResponse<WACC[]>;

// Paginated responses
export type PaginatedCompanySearchResponse = PaginatedResponse<CompanySearchResult>;
export type PaginatedHistoricalPriceResponse = PaginatedResponse<HistoricalPrice>;
export type PaginatedEarningsCalendarResponse = PaginatedResponse<EarningsCalendar>;

// Error response
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
  status: number;
}

// Bulk download response
export interface BulkDownloadResponse {
  downloadUrl: string;
  format: 'csv' | 'json';
  size: number;
  generatedAt: string;
  expiresAt: string;
}