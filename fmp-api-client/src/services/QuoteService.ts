import { BaseHttpClient } from '../client/base.js';
import {
  StockQuote,
  HistoricalPrice,
  IntradayPrice,
  MostActiveStock,
  StockGainerLoser,
  EarningsCalendar,
  HistoricalPeriod,
} from '../types/quotes.js';
import { CompanyProfile, CompanyQuote, RealTimeQuote } from '../types/company.js';
import { DateString, Period } from '../types/api.js';

export class QuoteService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Get real-time quote for a single stock
   */
  async getRealTimeQuote(symbol: string): Promise<StockQuote | null> {
    const response = await this.httpClient.get<StockQuote[]>(`/quote/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get real-time quotes for multiple stocks
   */
  async getRealTimeQuotes(symbols: string[]): Promise<StockQuote[]> {
    const symbolList = symbols.join(',');
    const response = await this.httpClient.get<StockQuote[]>(`/quote/${symbolList}`);
    return response.data as any;
  }

  /**
   * Get full company quote (includes more detailed information)
   */
  async getCompanyQuote(symbol: string): Promise<CompanyQuote | null> {
    const response = await this.httpClient.get<CompanyQuote[]>(`/quote/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get company profile
   */
  async getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
    const response = await this.httpClient.get<CompanyProfile[]>(`/profile/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get company profiles for multiple symbols
   */
  async getCompanyProfiles(symbols: string[]): Promise<CompanyProfile[]> {
    const symbolList = symbols.join(',');
    const response = await this.httpClient.get<CompanyProfile[]>(`/profile/${symbolList}`);
    return response.data as any;
  }

  /**
   * Get historical price data
   */
  async getHistoricalPrices(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/${symbol}`,
      params
    );
    
    return response.data.historical || [];
  }

  /**
   * Get historical price data for a specific date range
   */
  async getHistoricalPriceRange(
    symbol: string,
    from: DateString,
    to: DateString
  ): Promise<HistoricalPrice[]> {
    return this.getHistoricalPrices(symbol, { from, to });
  }

  /**
   * Get last N historical prices
   */
  async getLastNHistoricalPrices(symbol: string, limit: number): Promise<HistoricalPrice[]> {
    return this.getHistoricalPrices(symbol, { limit });
  }

  /**
   * Get intraday price data
   */
  async getIntradayPrices(
    symbol: string,
    interval: HistoricalPeriod = '1min',
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<IntradayPrice[]> {
    const params: Record<string, unknown> = { interval };
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<IntradayPrice[]>(
      `/historical-chart/${interval}/${symbol}`,
      params
    );
    
    return response.data as any;
  }

  /**
   * Get pre-market price
   */
  async getPreMarketPrice(symbol: string): Promise<RealTimeQuote | null> {
    const response = await this.httpClient.get<RealTimeQuote[]>(`/pre-market/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get after-market price
   */
  async getAfterMarketPrice(symbol: string): Promise<RealTimeQuote | null> {
    const response = await this.httpClient.get<RealTimeQuote[]>(`/after-market/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get market hours for specific exchange
   */
  async getMarketHours(exchange?: string): Promise<any> {
    const params = exchange ? { exchange } : {};
    const response = await this.httpClient.get('/market-hours', params);
    return response.data as any;
  }

  /**
   * Check if market is open
   */
  async isMarketOpen(): Promise<{ isMarketOpen: boolean }> {
    const response = await this.httpClient.get<{ isMarketOpen: boolean }>('/is-the-market-open');
    return response.data as any;
  }

  /**
   * Get most active stocks
   */
  async getMostActiveStocks(): Promise<MostActiveStock[]> {
    const response = await this.httpClient.get<MostActiveStock[]>('/stock_market/actives');
    return response.data as any;
  }

  /**
   * Get top gainers
   */
  async getTopGainers(): Promise<StockGainerLoser[]> {
    const response = await this.httpClient.get<StockGainerLoser[]>('/stock_market/gainers');
    return response.data as any;
  }

  /**
   * Get top losers
   */
  async getTopLosers(): Promise<StockGainerLoser[]> {
    const response = await this.httpClient.get<StockGainerLoser[]>('/stock_market/losers');
    return response.data as any;
  }

  /**
   * Get market cap changes for a symbol
   */
  async getMarketCapHistory(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(`/historical-market-capitalization/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get earnings calendar
   */
  async getEarningsCalendar(options: {
    from?: DateString;
    to?: DateString;
    symbol?: string;
  } = {}): Promise<EarningsCalendar[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.symbol) params.symbol = options.symbol;

    const response = await this.httpClient.get<EarningsCalendar[]>('/earning_calendar', params);
    return response.data as any;
  }

  /**
   * Get earnings calendar for today
   */
  async getTodaysEarnings(): Promise<EarningsCalendar[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getEarningsCalendar({ from: today, to: today });
  }

  /**
   * Get dividend calendar
   */
  async getDividendCalendar(options: {
    from?: DateString;
    to?: DateString;
    symbol?: string;
  } = {}): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.symbol) params.symbol = options.symbol;

    const response = await this.httpClient.get('/stock_dividend_calendar', params);
    return response.data as any;
  }

  /**
   * Get stock split calendar
   */
  async getStockSplitCalendar(options: {
    from?: DateString;
    to?: DateString;
    symbol?: string;
  } = {}): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.symbol) params.symbol = options.symbol;

    const response = await this.httpClient.get('/stock_split_calendar', params);
    return response.data as any;
  }

  /**
   * Get IPO calendar
   */
  async getIPOCalendar(options: {
    from?: DateString;
    to?: DateString;
  } = {}): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get('/ipo_calendar', params);
    return response.data as any;
  }

  /**
   * Get economic calendar
   */
  async getEconomicCalendar(options: {
    from?: DateString;
    to?: DateString;
  } = {}): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get('/economic_calendar', params);
    return response.data as any;
  }

  /**
   * Get price target for a symbol
   */
  async getPriceTarget(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/price-target/${symbol}`);
    return response.data as any;
  }

  /**
   * Get analyst estimates
   */
  async getAnalystEstimates(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(`/analyst-estimates/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get upgrades and downgrades
   */
  async getUpgradesDowngrades(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/upgrades-downgrades/${symbol}`);
    return response.data as any;
  }

  /**
   * Get earnings surprises
   */
  async getEarningsSurprises(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/earnings-surprises/${symbol}`);
    return response.data as any;
  }
}