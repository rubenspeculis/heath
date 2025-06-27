import { BaseHttpClient } from './client/base.js';
import { FMPClientConfig, createConfig } from './client/config.js';
import { QuoteService } from './services/QuoteService.js';
import { CompanyService } from './services/CompanyService.js';
import { FinancialStatementsService } from './services/FinancialStatementsService.js';
import { RatiosService } from './services/RatiosService.js';
import { DCFService } from './services/DCFService.js';
import { HistoricalService } from './services/HistoricalService.js';

/**
 * Main FMP API Client
 * 
 * A comprehensive TypeScript client for the Financial Modeling Prep API.
 * Provides access to financial data including real-time quotes, financial statements,
 * ratios, DCF analysis, historical data, and company information.
 * 
 * @example
 * ```typescript
 * import { FMPApiClient } from 'fmp-api-client';
 * 
 * const client = new FMPApiClient({
 *   apiKey: 'your-api-key',
 *   baseURL: 'https://financialmodelingprep.com/api/v3'
 * });
 * 
 * // Get real-time quote
 * const quote = await client.quotes.getRealTimeQuote('AAPL');
 * 
 * // Get financial statements
 * const statements = await client.financialStatements.getCompleteFinancialStatements('AAPL');
 * 
 * // Get DCF valuation
 * const dcf = await client.dcf.getDCFValuation('AAPL');
 * ```
 */
export class FMPApiClient {
  private httpClient: BaseHttpClient;

  /**
   * Service for real-time quotes, historical prices, and market data
   */
  public readonly quotes: QuoteService;

  /**
   * Service for company profiles, search, executives, and corporate data
   */
  public readonly companies: CompanyService;

  /**
   * Service for financial statements (income, balance sheet, cash flow)
   */
  public readonly financialStatements: FinancialStatementsService;

  /**
   * Service for financial ratios, key metrics, and performance indicators
   */
  public readonly ratios: RatiosService;

  /**
   * Service for discounted cash flow analysis and valuation
   */
  public readonly dcf: DCFService;

  /**
   * Service for historical data across all asset classes
   */
  public readonly historical: HistoricalService;

  /**
   * Creates a new FMP API client instance
   * 
   * @param config - Configuration options for the client
   */
  constructor(config: Partial<FMPClientConfig> = {}) {
    const fullConfig = createConfig(config);
    this.httpClient = new BaseHttpClient(fullConfig);

    // Initialize all services
    this.quotes = new QuoteService(this.httpClient);
    this.companies = new CompanyService(this.httpClient);
    this.financialStatements = new FinancialStatementsService(this.httpClient);
    this.ratios = new RatiosService(this.httpClient);
    this.dcf = new DCFService(this.httpClient);
    this.historical = new HistoricalService(this.httpClient);
  }

  /**
   * Get current configuration
   */
  public getConfig(): FMPClientConfig {
    return this.httpClient.getConfig();
  }

  /**
   * Update client configuration
   * 
   * @param newConfig - Partial configuration to merge with current config
   */
  public updateConfig(newConfig: Partial<FMPClientConfig>): void {
    // Convert FMPClientConfig to ResolvedFMPClientConfig format
    const resolvedConfig: Partial<any> = { ...newConfig };
    if (newConfig.rateLimit) {
      resolvedConfig.rateLimit = {
        requestsPerMinute: newConfig.rateLimit.requestsPerMinute,
        burstSize: newConfig.rateLimit.burstSize ?? newConfig.rateLimit.requestsPerMinute,
        enabled: newConfig.rateLimit.enabled ?? true,
      };
    }
    this.httpClient.updateConfig(resolvedConfig as Partial<any>);
  }

  /**
   * Check API health and connectivity
   * 
   * @returns Promise resolving to connection status
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    responseTime: number;
    apiLimits?: {
      callsPerMinute: number;
      callsPerDay: number;
      remainingCalls: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      // Use a lightweight endpoint to test connectivity
      await this.httpClient.get('/is-the-market-open');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        responseTime,
      };
    }
  }

  /**
   * Get comprehensive stock analysis for a symbol
   * 
   * This method combines data from multiple services to provide
   * a complete picture of a stock's financial health and valuation.
   * 
   * @param symbol - Stock symbol (e.g., 'AAPL')
   * @param options - Analysis options
   * @returns Promise resolving to comprehensive stock analysis
   */
  async getComprehensiveStockAnalysis(
    symbol: string,
    options: {
      includeHistorical?: boolean;
      historicalPeriod?: number; // days
      includeDCF?: boolean;
      includeRatios?: boolean;
    } = {}
  ): Promise<{
    symbol: string;
    lastUpdated: string;
    quote: any;
    profile: any;
    financialStatements?: {
      income: any[];
      balanceSheet: any[];
      cashFlow: any[];
    };
    ratios?: {
      current: any[];
      ttm: any[];
      keyMetrics: any[];
    };
    dcf?: {
      valuation: any[];
      wacc: any[];
      rating: any;
    };
    historical?: {
      prices: any[];
      marketCap: any[];
    };
    summary: {
      currentPrice: number;
      marketCap: number;
      peRatio: number;
      dcfValue?: number;
      recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    };
  }> {
    const {
      includeHistorical = false,
      historicalPeriod = 365,
      includeDCF = true,
      includeRatios = true,
    } = options;

    // Gather core data
    const [quote, profile] = await Promise.all([
      this.quotes.getRealTimeQuote(symbol),
      this.companies.getProfile(symbol),
    ]);

    if (!quote || !profile) {
      throw new Error(`Unable to find data for symbol: ${symbol}`);
    }

    const analysis: any = {
      symbol,
      lastUpdated: new Date().toISOString(),
      quote,
      profile,
      summary: {
        currentPrice: quote.price || 0,
        marketCap: profile.mktCap || 0,
        peRatio: quote.pe || 0,
        recommendation: 'Hold' as const,
      },
    };

    // Gather optional data in parallel
    const optionalDataPromises: Promise<any>[] = [];

    // Financial statements
    optionalDataPromises.push(
      this.financialStatements.getCompleteFinancialStatements(symbol, { limit: 4 })
        .then(data => ({ financialStatements: data }))
        .catch(() => ({ financialStatements: undefined }))
    );

    // Ratios
    if (includeRatios) {
      optionalDataPromises.push(
        this.ratios.getComprehensiveRatios(symbol, { limit: 4 })
          .then(data => ({ ratios: data }))
          .catch(() => ({ ratios: undefined }))
      );
    }

    // DCF Analysis
    if (includeDCF) {
      optionalDataPromises.push(
        this.dcf.getComprehensiveDCFAnalysis(symbol)
          .then(data => ({ dcf: data }))
          .catch(() => ({ dcf: undefined }))
      );
    }

    // Historical data
    if (includeHistorical) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - historicalPeriod);
      
      optionalDataPromises.push(
        Promise.all([
          this.historical.getHistoricalDailyPrices(symbol, {
            from: fromDate.toISOString().split('T')[0],
            limit: historicalPeriod,
          }),
          this.historical.getHistoricalMarketCap(symbol, {
            from: fromDate.toISOString().split('T')[0],
            limit: historicalPeriod,
          }),
        ]).then(([prices, marketCap]) => ({
          historical: { prices, marketCap }
        })).catch(() => ({ historical: undefined }))
      );
    }

    // Wait for all optional data
    const optionalData = await Promise.all(optionalDataPromises);
    
    // Merge all data
    optionalData.forEach(data => {
      Object.assign(analysis, data);
    });

    // Generate recommendation based on available data
    if (analysis.dcf?.dcfRating?.rating) {
      analysis.summary.dcfValue = analysis.dcf.basicDCF?.[0]?.dcf;
      analysis.summary.recommendation = analysis.dcf.dcfRating.rating;
    }

    return analysis;
  }

  /**
   * Get market overview with key indices and statistics
   * 
   * @returns Promise resolving to market overview data
   */
  async getMarketOverview(): Promise<{
    indices: any[];
    topGainers: any[];
    topLosers: any[];
    mostActive: any[];
    sectorPerformance: any[];
    marketStatus: any;
  }> {
    const [
      topGainers,
      topLosers,
      mostActive,
      marketStatus,
    ] = await Promise.all([
      this.quotes.getTopGainers(),
      this.quotes.getTopLosers(),
      this.quotes.getMostActiveStocks(),
      this.quotes.isMarketOpen(),
    ]);

    // Get major indices
    const majorIndices = ['^GSPC', '^DJI', '^IXIC']; // S&P 500, Dow Jones, NASDAQ
    const indices = await Promise.all(
      majorIndices.map(index => 
        this.historical.getHistoricalIndexPrices(index, { limit: 1 })
          .catch(() => [])
      )
    );

    return {
      indices: indices.flat(),
      topGainers,
      topLosers,
      mostActive,
      sectorPerformance: [], // Would need to implement sector service
      marketStatus,
    };
  }

  /**
   * Search for stocks and get quick overview
   * 
   * @param query - Search query (company name or symbol)
   * @param limit - Maximum number of results to return
   * @returns Promise resolving to search results with basic data
   */
  async searchStocks(
    query: string,
    limit: number = 10
  ): Promise<Array<{
    symbol: string;
    name: string;
    price?: number;
    change?: number;
    changePercent?: number;
    marketCap?: number;
    exchange: string;
  }>> {
    const searchResults = await this.companies.searchCompanies(query, { limit });
    
    if (searchResults.length === 0) {
      return [];
    }

    // Get quotes for the search results
    const symbols = searchResults.slice(0, limit).map(result => result.symbol);
    const quotes = await this.quotes.getRealTimeQuotes(symbols);
    
    // Create a map for quick lookup
    const quoteMap = new Map(quotes.map(quote => [quote.symbol, quote]));
    
    return searchResults.map(result => {
      const quote = quoteMap.get(result.symbol);
      
      return {
        symbol: result.symbol,
        name: result.name,
        price: quote?.price,
        change: quote?.change,
        changePercent: quote?.changesPercentage,
        marketCap: quote?.marketCap,
        exchange: result.exchangeShortName || 'Unknown',
      };
    });
  }

  /**
   * Compare multiple stocks side by side
   * 
   * @param symbols - Array of stock symbols to compare
   * @returns Promise resolving to comparison data
   */
  async compareStocks(symbols: string[]): Promise<{
    symbols: string[];
    comparison: Array<{
      symbol: string;
      name: string;
      price: number;
      marketCap: number;
      peRatio: number;
      pbRatio: number;
      dividendYield: number;
      roe: number;
      debtToEquity: number;
      dcfValue?: number;
      recommendation?: string;
    }>;
    lastUpdated: string;
  }> {
    // Get basic data for all symbols
    const [quotes, profiles] = await Promise.all([
      this.quotes.getRealTimeQuotes(symbols),
      this.companies.getProfiles(symbols),
    ]);

    // Get key metrics for all symbols
    const keyMetricsPromises = symbols.map(symbol =>
      this.ratios.getKeyMetricsTTM(symbol)
        .then(data => ({ symbol, data: data[0] }))
        .catch(() => ({ symbol, data: null }))
    );
    
    const keyMetrics = await Promise.all(keyMetricsPromises);
    const keyMetricsMap = new Map(keyMetrics.map(item => [item.symbol, item.data]));

    // Create maps for quick lookup
    const quoteMap = new Map(quotes.map(quote => [quote.symbol, quote]));
    const profileMap = new Map(profiles.map(profile => [profile.symbol, profile]));

    const comparison = symbols.map(symbol => {
      const quote = quoteMap.get(symbol);
      const profile = profileMap.get(symbol);
      const metrics = keyMetricsMap.get(symbol);

      return {
        symbol,
        name: profile?.companyName || 'Unknown',
        price: quote?.price || 0,
        marketCap: profile?.mktCap || 0,
        peRatio: quote?.pe || metrics?.peRatio || 0,
        pbRatio: metrics?.pbRatio || 0,
        dividendYield: metrics?.dividendYield || 0,
        roe: metrics?.roe || 0,
        debtToEquity: metrics?.debtToEquity || 0,
      };
    });

    return {
      symbols,
      comparison,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Close the HTTP client and clean up resources
   */
  public destroy(): void {
    // Clean up any resources if needed
    // For now, there's nothing specific to clean up
  }
}