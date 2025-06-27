import { NumericValue, DateString, HistoricalPeriod, Exchange } from './api.js';

/**
 * Stock quote (real-time)
 */
export interface StockQuote {
  symbol: string;
  name: string;
  price: NumericValue;
  changesPercentage: NumericValue;
  change: NumericValue;
  dayLow: NumericValue;
  dayHigh: NumericValue;
  yearHigh: NumericValue;
  yearLow: NumericValue;
  marketCap: NumericValue;
  priceAvg50: NumericValue;
  priceAvg200: NumericValue;
  exchange: Exchange;
  volume: NumericValue;
  avgVolume: NumericValue;
  open: NumericValue;
  previousClose: NumericValue;
  eps: NumericValue;
  pe: NumericValue;
  earningsAnnouncement: DateString;
  sharesOutstanding: NumericValue;
  timestamp: number;
}

/**
 * Historical price data
 */
export interface HistoricalPrice {
  date: DateString;
  open: NumericValue;
  high: NumericValue;
  low: NumericValue;
  close: NumericValue;
  adjClose: NumericValue;
  volume: NumericValue;
  unadjustedVolume: NumericValue;
  change: NumericValue;
  changePercent: NumericValue;
  vwap: NumericValue;
  label: string;
  changeOverTime: NumericValue;
}

/**
 * Intraday price data
 */
export interface IntradayPrice {
  date: string; // DateTime string
  open: NumericValue;
  low: NumericValue;
  high: NumericValue;
  close: NumericValue;
  volume: NumericValue;
}

/**
 * Price target
 */
export interface PriceTarget {
  symbol: string;
  analystCompany: string;
  publishedDate: DateString;
  newsPriceTarget: NumericValue;
  priceWhenPosted: NumericValue;
  newsURL: string;
  newsTitle: string;
}

/**
 * Price target summary
 */
export interface PriceTargetSummary {
  symbol: string;
  lastMonth: number;
  lastMonthAvgPriceTarget: NumericValue;
  lastQuarter: number;
  lastQuarterAvgPriceTarget: NumericValue;
  lastYear: number;
  lastYearAvgPriceTarget: NumericValue;
}

/**
 * Analyst estimates
 */
export interface AnalystEstimates {
  symbol: string;
  date: DateString;
  estimatedRevenueLow: NumericValue;
  estimatedRevenueHigh: NumericValue;
  estimatedRevenueAvg: NumericValue;
  estimatedEbitdaLow: NumericValue;
  estimatedEbitdaHigh: NumericValue;
  estimatedEbitdaAvg: NumericValue;
  estimatedEbitLow: NumericValue;
  estimatedEbitHigh: NumericValue;
  estimatedEbitAvg: NumericValue;
  estimatedNetIncomeLow: NumericValue;
  estimatedNetIncomeHigh: NumericValue;
  estimatedNetIncomeAvg: NumericValue;
  estimatedSgaExpenseLow: NumericValue;
  estimatedSgaExpenseHigh: NumericValue;
  estimatedSgaExpenseAvg: NumericValue;
  estimatedEpsAvg: NumericValue;
  estimatedEpsHigh: NumericValue;
  estimatedEpsLow: NumericValue;
  numberAnalystEstimatedRevenue: number;
  numberAnalystEstimatedEps: number;
}

/**
 * Earnings estimates
 */
export interface EarningsEstimates {
  symbol: string;
  date: DateString;
  period: string;
  growth: string;
  earningsGrowth: string;
  revenueGrowth: string;
  epsgrowth: string;
  ebitgrowth: string;
  netIncomeGrowth: string;
}

/**
 * Earnings calendar
 */
export interface EarningsCalendar {
  date: DateString;
  symbol: string;
  eps: NumericValue;
  epsEstimated: NumericValue;
  time: string;
  revenue: NumericValue;
  revenueEstimated: NumericValue;
  updatedFromDate: DateString;
  fiscalDateEnding: DateString;
}

/**
 * Economic calendar
 */
export interface EconomicCalendar {
  event: string;
  date: DateString;
  country: string;
  actual: NumericValue;
  previous: NumericValue;
  change: NumericValue;
  changePercentage: NumericValue;
  estimate: NumericValue;
  impact: string;
}

/**
 * Dividend calendar
 */
export interface DividendCalendar {
  date: DateString;
  label: string;
  adjDividend: NumericValue;
  symbol: string;
  dividend: NumericValue;
  recordDate: DateString;
  paymentDate: DateString;
  declarationDate: DateString;
}

/**
 * Stock split calendar
 */
export interface StockSplitCalendar {
  date: DateString;
  label: string;
  symbol: string;
  numerator: NumericValue;
  denominator: NumericValue;
}

/**
 * IPO calendar
 */
export interface IPOCalendar {
  date: DateString;
  company: string;
  symbol: string;
  exchange: Exchange;
  actions: string;
  shares: NumericValue;
  priceRange: string;
  marketCap: NumericValue;
}

/**
 * Stock screener results
 */
export interface StockScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: NumericValue;
  sector: string;
  industry: string;
  beta: NumericValue;
  price: NumericValue;
  lastAnnualDividend: NumericValue;
  volume: NumericValue;
  exchange: Exchange;
  exchangeShortName: Exchange;
  country: string;
  isEtf: boolean;
  isActivelyTrading: boolean;
}

/**
 * Most active stocks
 */
export interface MostActiveStock {
  symbol: string;
  name: string;
  change: NumericValue;
  price: NumericValue;
  changesPercentage: NumericValue;
}

/**
 * Stock gainers/losers
 */
export interface StockGainerLoser {
  symbol: string;
  name: string;
  change: NumericValue;
  price: NumericValue;
  changesPercentage: NumericValue;
}

/**
 * Market performance
 */
export interface MarketPerformance {
  '1D': NumericValue;
  '5D': NumericValue;
  '1M': NumericValue;
  '3M': NumericValue;
  '6M': NumericValue;
  '1Y': NumericValue;
  '3Y': NumericValue;
  '5Y': NumericValue;
  '10Y': NumericValue;
  max: NumericValue;
}

/**
 * Technical indicators
 */
export interface TechnicalIndicator {
  date: DateString;
  open: NumericValue;
  high: NumericValue;
  low: NumericValue;
  close: NumericValue;
  volume: NumericValue;
  sma: NumericValue;
  ema: NumericValue;
  wma: NumericValue;
  dema: NumericValue;
  tema: NumericValue;
  williams: NumericValue;
  rsi: NumericValue;
  adx: NumericValue;
  standardDeviation: NumericValue;
}

/**
 * Options chain
 */
export interface OptionsChain {
  symbol: string;
  optionSymbol: string;
  expiration: DateString;
  side: 'call' | 'put';
  type: string;
  strike: NumericValue;
  contractSize: number;
  currency: string;
  lastPrice: NumericValue;
  change: NumericValue;
  percentChange: NumericValue;
  volume: NumericValue;
  openInterest: NumericValue;
  bid: NumericValue;
  ask: NumericValue;
  contractName: string;
  impliedVolatility: NumericValue;
  inTheMoney: boolean;
}

// Re-export HistoricalPeriod for convenience
export type { HistoricalPeriod };