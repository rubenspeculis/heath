/**
 * FMP API Client - A comprehensive TypeScript client for Financial Modeling Prep API
 * 
 * This package provides a complete, type-safe interface to the Financial Modeling Prep API,
 * offering access to real-time financial data, historical prices, company information,
 * financial statements, ratios, DCF analysis, and much more.
 * 
 * @author Otivo Labs
 * @version 1.0.0
 * @license MIT
 */

// Main client
import { FMPApiClient } from './FMPApiClient.js';
export { FMPApiClient } from './FMPApiClient.js';

// Services
export { QuoteService } from './services/QuoteService.js';
export { CompanyService } from './services/CompanyService.js';
export { FinancialStatementsService } from './services/FinancialStatementsService.js';
export { RatiosService } from './services/RatiosService.js';
export { DCFService } from './services/DCFService.js';
export { HistoricalService } from './services/HistoricalService.js';

// Configuration
export type { FMPClientConfig } from './client/config.js';
export { createConfig } from './client/config.js';
export { BaseHttpClient } from './client/base.js';

// Types - API
export type {
  APIResponse,
  PaginatedResponse,
  BaseSearchParams,
  DateString,
  Period,
  NumericValue,
} from './types/api.js';

// Types - Company
export type {
  CompanyProfile,
  CompanySearchResult,
  CompanyExecutive,
  CompanyKeyExecutives,
  MarketCapitalization,
  CompanyOutlook,
  CompanyRating,
  InsiderTrade,
  StockSplit,
  StockDividend,
  StockNews,
  MarketHours,
  AvailableSymbol,
  CompanyQuote,
  RealTimeQuote,
} from './types/company.js';

// Types - Financials
export type {
  BaseFinancialStatement,
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  FinancialGrowth,
  KeyMetricsTTM,
  FinancialStatementAsReported,
  EnterpriseValue,
} from './types/financials.js';

// Types - Quotes
export type {
  StockQuote,
  HistoricalPrice,
  IntradayPrice,
  MostActiveStock,
  StockGainerLoser,
  EarningsCalendar,
  HistoricalPeriod,
} from './types/quotes.js';

// Types - Ratios
export type {
  FinancialRatios,
  TTMRatios,
  KeyMetrics,
  FinancialScore,
  OwnerEarnings,
  EfficiencyRatios,
  LeverageRatios,
  LiquidityRatios,
  ProfitabilityRatios,
} from './types/ratios.js';

// Types - DCF
export type {
  DCFValuation,
  AdvancedDCF,
  CustomDCFParams,
  DCFSensitivityAnalysis,
  WACC,
  DCFAssumptions,
  DCFComponents,
  HistoricalDCF,
  DCFRating,
  MonteCarloDAF,
  SectorDCFComparison,
} from './types/dcf.js';

// Types - Responses
export type {
  CompanyProfileResponse,
  CompanyQuoteResponse,
  CompanySearchResponse,
  RealTimeQuoteResponse,
  IncomeStatementResponse,
  BalanceSheetResponse,
  CashFlowResponse,
  FinancialGrowthResponse,
  StockQuoteResponse,
  HistoricalPriceResponse,
  IntradayPriceResponse,
  EarningsCalendarResponse,
  FinancialRatiosResponse,
  KeyMetricsResponse,
  TTMRatiosResponse,
  DCFResponse,
  AdvancedDCFResponse,
  WACCResponse,
  PaginatedCompanySearchResponse,
  PaginatedHistoricalPriceResponse,
  PaginatedEarningsCalendarResponse,
  ErrorResponse,
  BulkDownloadResponse,
} from './types/responses.js';

// Error classes
export {
  FMPError,
  FMPAPIError,
  FMPRateLimitError,
  FMPAuthenticationError,
  FMPValidationError,
  FMPNetworkError,
  FMPTimeoutError,
} from './utils/errors.js';

// Utilities
export { RateLimiter } from './utils/rateLimit.js';

// Default export
export default FMPApiClient;

/**
 * Quick start example:
 * 
 * ```typescript
 * import { FMPApiClient } from 'fmp-api-client';
 * 
 * const client = new FMPApiClient({
 *   apiKey: 'your-api-key-here'
 * });
 * 
 * // Get real-time quote
 * const quote = await client.quotes.getRealTimeQuote('AAPL');
 * console.log(quote);
 * 
 * // Get financial statements
 * const statements = await client.financialStatements.getIncomeStatements('AAPL');
 * console.log(statements);
 * 
 * // Get DCF valuation
 * const dcf = await client.dcf.getDCFValuation('AAPL');
 * console.log(dcf);
 * 
 * // Get comprehensive analysis
 * const analysis = await client.getComprehensiveStockAnalysis('AAPL', {
 *   includeHistorical: true,
 *   includeDCF: true,
 *   includeRatios: true
 * });
 * console.log(analysis);
 * ```
 */