import { BaseHttpClient } from '../client/base.js';
import {
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
} from '../types/company.js';
import { DateString } from '../types/api.js';

export class CompanyService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Search for companies by name or symbol
   */
  async searchCompanies(
    query: string,
    options: {
      limit?: number;
      exchange?: string;
    } = {}
  ): Promise<CompanySearchResult[]> {
    const params: Record<string, unknown> = { query };
    
    if (options.limit) params.limit = options.limit;
    if (options.exchange) params.exchange = options.exchange;

    const response = await this.httpClient.get<CompanySearchResult[]>('/search', params);
    return response.data as any;
  }

  /**
   * Get company profile by symbol
   */
  async getProfile(symbol: string): Promise<CompanyProfile | null> {
    const response = await this.httpClient.get<CompanyProfile[]>(`/profile/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get company profiles for multiple symbols
   */
  async getProfiles(symbols: string[]): Promise<CompanyProfile[]> {
    const symbolList = symbols.join(',');
    const response = await this.httpClient.get<CompanyProfile[]>(`/profile/${symbolList}`);
    return response.data as any;
  }

  /**
   * Get company key executives
   */
  async getKeyExecutives(symbol: string): Promise<CompanyExecutive[]> {
    const response = await this.httpClient.get<CompanyExecutive[]>(`/key-executives/${symbol}`);
    return response.data as any;
  }

  /**
   * Get company key executives (alternative endpoint)
   */
  async getCompanyKeyExecutives(symbol: string): Promise<CompanyKeyExecutives | null> {
    const response = await this.httpClient.get<CompanyKeyExecutives[]>(`/company-key-executives/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get market capitalization history
   */
  async getMarketCapitalization(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
      limit?: number;
    } = {}
  ): Promise<MarketCapitalization[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<MarketCapitalization[]>(
      `/historical-market-capitalization/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get company outlook (comprehensive overview)
   */
  async getCompanyOutlook(symbol: string): Promise<CompanyOutlook | null> {
    const response = await this.httpClient.get<CompanyOutlook[]>(`/company-outlook/${symbol}`);
    return response.data[0] || null;
  }

  /**
   * Get company rating
   */
  async getRating(symbol: string): Promise<CompanyRating[]> {
    const response = await this.httpClient.get<CompanyRating[]>(`/rating/${symbol}`);
    return response.data as any;
  }

  /**
   * Get historical rating
   */
  async getHistoricalRating(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<CompanyRating[]> {
    const params: Record<string, unknown> = {};
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<CompanyRating[]>(
      `/historical-rating/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get insider trades
   */
  async getInsiderTrades(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<InsiderTrade[]> {
    const params: Record<string, unknown> = {};
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<InsiderTrade[]>(`/insider-trading/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get stock split history
   */
  async getStockSplits(symbol: string): Promise<StockSplit[]> {
    const response = await this.httpClient.get<StockSplit[]>(`/stock_split/${symbol}`);
    return response.data as any;
  }

  /**
   * Get dividend history
   */
  async getDividendHistory(symbol: string): Promise<StockDividend[]> {
    const response = await this.httpClient.get<StockDividend[]>(`/historical-price-full/stock_dividend/${symbol}`);
    return response.data as any;
  }

  /**
   * Get stock news
   */
  async getStockNews(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<StockNews[]> {
    const params: Record<string, unknown> = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<StockNews[]>(`/stock_news/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get general news (market news)
   */
  async getGeneralNews(
    options: {
      limit?: number;
    } = {}
  ): Promise<StockNews[]> {
    const params: Record<string, unknown> = {};
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<StockNews[]>('/stock_news', params);
    return response.data as any;
  }

  /**
   * Get press releases
   */
  async getPressReleases(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<StockNews[]> {
    const params: Record<string, unknown> = {};
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<StockNews[]>(`/press-releases/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get market hours for an exchange
   */
  async getMarketHours(exchange?: string): Promise<MarketHours[]> {
    const params = exchange ? { exchange } : {};
    const response = await this.httpClient.get<MarketHours[]>('/market-hours', params);
    return response.data as any;
  }

  /**
   * Get available symbols for trading
   */
  async getAvailableSymbols(): Promise<AvailableSymbol[]> {
    const response = await this.httpClient.get<AvailableSymbol[]>('/available-traded/list');
    return response.data as any;
  }

  /**
   * Get symbols by exchange
   */
  async getSymbolsByExchange(exchange: string): Promise<AvailableSymbol[]> {
    const response = await this.httpClient.get<AvailableSymbol[]>(`/symbol/${exchange}`);
    return response.data as any;
  }

  /**
   * Get all available exchanges
   */
  async getExchanges(): Promise<string[]> {
    const response = await this.httpClient.get<{ name: string; code: string }[]>('/exchanges-list');
    return response.data.map(exchange => exchange.code);
  }

  /**
   * Get delisted companies
   */
  async getDelistedCompanies(
    options: {
      limit?: number;
      page?: number;
    } = {}
  ): Promise<CompanyProfile[]> {
    const params: Record<string, unknown> = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.page) params.page = options.page;

    const response = await this.httpClient.get<CompanyProfile[]>('/delisted-companies', params);
    return response.data as any;
  }

  /**
   * Get companies by sector
   */
  async getCompaniesBySector(sector: string): Promise<CompanyProfile[]> {
    const response = await this.httpClient.get<CompanyProfile[]>(`/stock-screener?sector=${sector}`);
    return response.data as any;
  }

  /**
   * Get companies by industry
   */
  async getCompaniesByIndustry(industry: string): Promise<CompanyProfile[]> {
    const response = await this.httpClient.get<CompanyProfile[]>(`/stock-screener?industry=${industry}`);
    return response.data as any;
  }

  /**
   * Get companies by country
   */
  async getCompaniesByCountry(country: string): Promise<CompanyProfile[]> {
    const response = await this.httpClient.get<CompanyProfile[]>(`/stock-screener?country=${country}`);
    return response.data as any;
  }

  /**
   * Get analyst recommendations
   */
  async getAnalystRecommendations(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/grade/${symbol}`);
    return response.data as any[];
  }

  /**
   * Get earnings call transcript
   */
  async getEarningsCallTranscript(
    symbol: string,
    options: {
      year?: number;
      quarter?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.year) params.year = options.year;
    if (options.quarter) params.quarter = options.quarter;

    const response = await this.httpClient.get(`/earning_call_transcript/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get SEC filings
   */
  async getSECFilings(
    symbol: string,
    options: {
      type?: string;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.type) params.type = options.type;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(`/sec_filings/${symbol}`, params);
    return response.data as any;
  }

  /**
   * Get company core information
   */
  async getCoreInformation(symbol: string): Promise<any> {
    const response = await this.httpClient.get(`/core_information/${symbol}`);
    return response.data as any;
  }

  /**
   * Get employee count
   */
  async getEmployeeCount(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/employee_count/${symbol}`);
    return response.data as any;
  }
}