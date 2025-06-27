import { BaseHttpClient } from '../client/base.js';
import {
  HistoricalPrice,
  IntradayPrice,
  HistoricalPeriod,
} from '../types/quotes.js';
import { DateString, Period } from '../types/api.js';

export class HistoricalService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Get historical daily prices for a symbol
   */
  async getHistoricalDailyPrices(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/${symbol}`,
      params
    );
    return response.data.historical || [];
  }

  /**
   * Get historical intraday prices
   */
  async getHistoricalIntradayPrices(
    symbol: string,
    interval: HistoricalPeriod,
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<IntradayPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<IntradayPrice[]>(
      `/historical-chart/${interval}/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical market cap for a symbol
   */
  async getHistoricalMarketCap(
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

    const response = await this.httpClient.get(
      `/historical-market-capitalization/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical stock splits
   */
  async getHistoricalStockSplits(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/stock_split/${symbol}`);
    return response.data as any;
  }

  /**
   * Get historical dividends
   */
  async getHistoricalDividends(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get(
      `/historical-price-full/stock_dividend/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical stock indexes (S&P 500, NASDAQ, etc.)
   */
  async getHistoricalIndexPrices(
    index: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/index/${index}`,
      params
    );
    return response.data.historical || [];
  }

  /**
   * Get historical commodity prices (gold, oil, etc.)
   */
  async getHistoricalCommodityPrices(
    commodity: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/${commodity}`,
      params
    );
    return response.data.historical || [];
  }

  /**
   * Get historical currency exchange rates
   */
  async getHistoricalForexRates(
    pair: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/forex/${pair}`,
      params
    );
    return response.data.historical || [];
  }

  /**
   * Get historical cryptocurrency prices
   */
  async getHistoricalCryptoPrices(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<{ historical: HistoricalPrice[] }>(
      `/historical-price-full/crypto/${symbol}`,
      params
    );
    return response.data.historical || [];
  }

  /**
   * Get historical earnings estimates
   */
  async getHistoricalEarningsEstimates(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(
      `/historical-analyst-estimates/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical sector performance
   */
  async getHistoricalSectorPerformance(
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get('/sectors-performance', params);
    return response.data as any;
  }

  /**
   * Get historical stock gainers and losers
   */
  async getHistoricalGainersLosers(
    date: DateString
  ): Promise<{
    gainers: any[];
    losers: any[];
    mostActive: any[];
  }> {
    const [gainers, losers, mostActive] = await Promise.all([
      this.httpClient.get(`/historical-stock_market/gainers/${date}`),
      this.httpClient.get(`/historical-stock_market/losers/${date}`),
      this.httpClient.get(`/historical-stock_market/actives/${date}`),
    ]);

    return {
      gainers: gainers.data as any[],
      losers: losers.data as any[],
      mostActive: mostActive.data as any[],
    };
  }

  /**
   * Get historical treasury rates
   */
  async getHistoricalTreasuryRates(
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get('/treasury', params);
    return response.data as any;
  }

  /**
   * Get historical economic indicators
   */
  async getHistoricalEconomicIndicators(
    indicator: string,
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get(`/economic/${indicator}`, params);
    return response.data as any;
  }

  /**
   * Get historical insider trading data
   */
  async getHistoricalInsiderTrading(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(`/insider-trading/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get historical institutional holdings
   */
  async getHistoricalInstitutionalHoldings(
    symbol: string,
    options: {
      includeCurrentQuarter?: boolean;
      date?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.includeCurrentQuarter) params.includeCurrentQuarter = 'true';
    if (options.date) params.date = options.date;

    const response = await this.httpClient.get(`/institutional-holder/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get historical mutual fund holdings
   */
  async getHistoricalMutualFundHoldings(
    symbol: string,
    options: {
      date?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.date) params.date = options.date;

    const response = await this.httpClient.get(`/mutual-fund-holder/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get historical ETF holdings
   */
  async getHistoricalETFHoldings(
    symbol: string,
    options: {
      date?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.date) params.date = options.date;

    const response = await this.httpClient.get(`/etf-holder/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get historical revenue by segments
   */
  async getHistoricalRevenueSegments(
    symbol: string,
    options: {
      period?: Period;
      structure?: 'flat' | 'detailed';
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.structure) params.structure = options.structure;

    const response = await this.httpClient.get(
      `/revenue-product-segmentation/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical revenue by geography
   */
  async getHistoricalRevenueGeography(
    symbol: string,
    options: {
      period?: Period;
      structure?: 'flat' | 'detailed';
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.structure) params.structure = options.structure;

    const response = await this.httpClient.get(
      `/revenue-geographic-segmentation/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get historical social sentiment data
   */
  async getHistoricalSocialSentiment(
    symbol: string,
    options: {
      page?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.page) params.page = options.page;

    const response = await this.httpClient.get(`/historical/social-sentiment/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get comprehensive historical data for a symbol
   */
  async getComprehensiveHistoricalData(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<{
    prices: HistoricalPrice[];
    marketCap: any[];
    dividends: any[];
    splits: any[];
    insiderTrading: any[];
    institutionalHoldings: any[];
    socialSentiment: any[];
  }> {
    const [
      prices,
      marketCap,
      dividends,
      splits,
      insiderTrading,
      institutionalHoldings,
      socialSentiment,
    ] = await Promise.all([
      this.getHistoricalDailyPrices(symbol, options),
      this.getHistoricalMarketCap(symbol, options),
      this.getHistoricalDividends(symbol, { from: options.from, to: options.to }),
      this.getHistoricalStockSplits(symbol),
      this.getHistoricalInsiderTrading(symbol, { limit: options.limit }),
      this.getHistoricalInstitutionalHoldings(symbol),
      this.getHistoricalSocialSentiment(symbol),
    ]);

    return {
      prices,
      marketCap,
      dividends,
      splits,
      insiderTrading,
      institutionalHoldings,
      socialSentiment,
    };
  }

  /**
   * Get batch historical prices for multiple symbols
   */
  async getBatchHistoricalPrices(
    symbols: string[],
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<Record<string, HistoricalPrice[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<Record<string, { historical: HistoricalPrice[] }>>(
      `/historical-price-full/${symbolList}`,
      params
    );

    // Transform the response to extract historical arrays
    const result: Record<string, HistoricalPrice[]> = {};
    for (const [symbol, data] of Object.entries(response.data)) {
      result[symbol] = data.historical || [];
    }
    return result;
  }

  /**
   * Get historical earnings calendar
   */
  async getHistoricalEarningsCalendar(
    options: {
      from?: DateString;
      to?: DateString;
      symbol?: string;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.symbol) params.symbol = options.symbol;

    const response = await this.httpClient.get('/earning_calendar', params);
    return response.data as any;
  }

  /**
   * Get historical IPO calendar
   */
  async getHistoricalIPOCalendar(
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get('/ipo_calendar', params);
    return response.data as any;
  }

  /**
   * Get historical stock screener results
   */
  async getHistoricalScreenerResults(
    date: DateString,
    criteria: {
      marketCapMoreThan?: number;
      marketCapLowerThan?: number;
      priceMoreThan?: number;
      priceLowerThan?: number;
      betaMoreThan?: number;
      betaLowerThan?: number;
      volumeMoreThan?: number;
      volumeLowerThan?: number;
      dividendMoreThan?: number;
      dividendLowerThan?: number;
      isEtf?: boolean;
      isActivelyTrading?: boolean;
      sector?: string;
      industry?: string;
      country?: string;
      exchange?: string;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params = new URLSearchParams({ date });
    
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await this.httpClient.get(`/stock-screener?${params.toString()}`);
    return response.data as any;
  }
}