import { BaseHttpClient } from '../client/base.js';
import {
  FinancialRatios,
  TTMRatios,
  KeyMetrics,
  FinancialScore,
  OwnerEarnings,
  EfficiencyRatios,
  LeverageRatios,
  LiquidityRatios,
  ProfitabilityRatios,
} from '../types/ratios.js';
import { DateString, Period } from '../types/api.js';

export class RatiosService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Get financial ratios for a symbol
   */
  async getFinancialRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<FinancialRatios[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<FinancialRatios[]>(
      `/ratios/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get TTM (Trailing Twelve Months) ratios for a symbol
   */
  async getTTMRatios(symbol: string): Promise<TTMRatios[]> {
    const response = await this.httpClient.get<TTMRatios[]>(
      `/ratios-ttm/${symbol}`
    );
    return response.data;
  }

  /**
   * Get key metrics for a symbol
   */
  async getKeyMetrics(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<KeyMetrics[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<KeyMetrics[]>(
      `/key-metrics/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get key metrics TTM for a symbol
   */
  async getKeyMetricsTTM(symbol: string): Promise<KeyMetrics[]> {
    const response = await this.httpClient.get<KeyMetrics[]>(
      `/key-metrics-ttm/${symbol}`
    );
    return response.data;
  }

  /**
   * Get financial scores (Altman Z-Score, Piotroski Score)
   */
  async getFinancialScore(symbol: string): Promise<FinancialScore[]> {
    const response = await this.httpClient.get<FinancialScore[]>(
      `/score/${symbol}`
    );
    return response.data;
  }

  /**
   * Get owner earnings for a symbol
   */
  async getOwnerEarnings(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<OwnerEarnings[]> {
    const params: Record<string, unknown> = {};
    
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<OwnerEarnings[]>(
      `/owner_earnings/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get efficiency ratios for a symbol
   */
  async getEfficiencyRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<EfficiencyRatios[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<EfficiencyRatios[]>(
      `/efficiency-ratios/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get leverage ratios for a symbol
   */
  async getLeverageRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<LeverageRatios[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<LeverageRatios[]>(
      `/leverage-ratios/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get liquidity ratios for a symbol
   */
  async getLiquidityRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<LiquidityRatios[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<LiquidityRatios[]>(
      `/liquidity-ratios/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get profitability ratios for a symbol
   */
  async getProfitabilityRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<ProfitabilityRatios[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<ProfitabilityRatios[]>(
      `/profitability-ratios/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get comprehensive ratio analysis for a symbol
   */
  async getComprehensiveRatios(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<{
    financialRatios: FinancialRatios[];
    ttmRatios: TTMRatios[];
    keyMetrics: KeyMetrics[];
    financialScore: FinancialScore[];
    ownerEarnings: OwnerEarnings[];
  }> {
    const [
      financialRatios,
      ttmRatios,
      keyMetrics,
      financialScore,
      ownerEarnings,
    ] = await Promise.all([
      this.getFinancialRatios(symbol, options),
      this.getTTMRatios(symbol),
      this.getKeyMetrics(symbol, options),
      this.getFinancialScore(symbol),
      this.getOwnerEarnings(symbol, options),
    ]);

    return {
      financialRatios,
      ttmRatios,
      keyMetrics,
      financialScore,
      ownerEarnings,
    };
  }

  /**
   * Get annual financial ratios
   */
  async getAnnualFinancialRatios(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<FinancialRatios[]> {
    return this.getFinancialRatios(symbol, { ...options, period: 'annual' });
  }

  /**
   * Get quarterly financial ratios
   */
  async getQuarterlyFinancialRatios(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<FinancialRatios[]> {
    return this.getFinancialRatios(symbol, { ...options, period: 'quarter' });
  }

  /**
   * Get annual key metrics
   */
  async getAnnualKeyMetrics(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<KeyMetrics[]> {
    return this.getKeyMetrics(symbol, { ...options, period: 'annual' });
  }

  /**
   * Get quarterly key metrics
   */
  async getQuarterlyKeyMetrics(
    symbol: string,
    options: {
      limit?: number;
    } = {}
  ): Promise<KeyMetrics[]> {
    return this.getKeyMetrics(symbol, { ...options, period: 'quarter' });
  }

  /**
   * Get batch financial ratios for multiple symbols
   */
  async getBatchFinancialRatios(
    symbols: string[],
    options: {
      period?: Period;
      year?: number;
    } = {}
  ): Promise<Record<string, FinancialRatios[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.year) params.year = options.year;

    const response = await this.httpClient.get<Record<string, FinancialRatios[]>>(
      `/ratios/${symbolList}`,
      params
    );
    return response.data;
  }

  /**
   * Get batch key metrics for multiple symbols
   */
  async getBatchKeyMetrics(
    symbols: string[],
    options: {
      period?: Period;
      year?: number;
    } = {}
  ): Promise<Record<string, KeyMetrics[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.year) params.year = options.year;

    const response = await this.httpClient.get<Record<string, KeyMetrics[]>>(
      `/key-metrics/${symbolList}`,
      params
    );
    return response.data;
  }

  /**
   * Get P/E ratios for a symbol
   */
  async getPERatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-pe-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get P/E ratios for a date range
   */
  async getPERatiosDateRange(
    symbol: string,
    options: {
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get(`/historical-pe-ratio/${symbol}`, params);
    return response.data;
  }

  /**
   * Get price-to-book ratios for a symbol
   */
  async getPriceToBookRatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-price-to-book-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get price-to-sales ratios for a symbol
   */
  async getPriceToSalesRatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-price-to-sales-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get enterprise value over EBITDA ratios
   */
  async getEVToEBITDARatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-ev-to-ebitda/${symbol}`);
    return response.data;
  }

  /**
   * Get enterprise value over operating cash flow ratios
   */
  async getEVToOperatingCashFlowRatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-ev-to-operating-cash-flow/${symbol}`);
    return response.data;
  }

  /**
   * Get enterprise value over free cash flow ratios
   */
  async getEVToFreeCashFlowRatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-ev-to-free-cash-flow/${symbol}`);
    return response.data;
  }

  /**
   * Get debt-to-equity ratios for a symbol
   */
  async getDebtToEquityRatios(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-debt-to-equity/${symbol}`);
    return response.data;
  }

  /**
   * Get return on equity (ROE) for a symbol
   */
  async getReturnOnEquity(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-roe/${symbol}`);
    return response.data;
  }

  /**
   * Get return on assets (ROA) for a symbol
   */
  async getReturnOnAssets(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-roa/${symbol}`);
    return response.data;
  }

  /**
   * Get return on invested capital (ROIC) for a symbol
   */
  async getReturnOnInvestedCapital(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-roic/${symbol}`);
    return response.data;
  }

  /**
   * Get current ratio history for a symbol
   */
  async getCurrentRatioHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-current-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get quick ratio history for a symbol
   */
  async getQuickRatioHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-quick-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get cash ratio history for a symbol
   */
  async getCashRatioHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-cash-ratio/${symbol}`);
    return response.data;
  }

  /**
   * Get gross margin history for a symbol
   */
  async getGrossMarginHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-gross-margin/${symbol}`);
    return response.data;
  }

  /**
   * Get operating margin history for a symbol
   */
  async getOperatingMarginHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-operating-margin/${symbol}`);
    return response.data;
  }

  /**
   * Get net margin history for a symbol
   */
  async getNetMarginHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-net-margin/${symbol}`);
    return response.data;
  }

  /**
   * Get dividend yield history for a symbol
   */
  async getDividendYieldHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-dividend-yield/${symbol}`);
    return response.data;
  }

  /**
   * Get working capital history for a symbol
   */
  async getWorkingCapitalHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-working-capital/${symbol}`);
    return response.data;
  }

  /**
   * Get asset turnover history for a symbol
   */
  async getAssetTurnoverHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-asset-turnover/${symbol}`);
    return response.data;
  }

  /**
   * Get inventory turnover history for a symbol
   */
  async getInventoryTurnoverHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-inventory-turnover/${symbol}`);
    return response.data;
  }

  /**
   * Get receivables turnover history for a symbol
   */
  async getReceivablesTurnoverHistory(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/historical-receivables-turnover/${symbol}`);
    return response.data;
  }

  /**
   * Get all historical ratios for comprehensive analysis
   */
  async getHistoricalRatiosComprehensive(
    symbol: string
  ): Promise<{
    peRatios: any[];
    priceToBookRatios: any[];
    priceToSalesRatios: any[];
    evToEbitdaRatios: any[];
    currentRatios: any[];
    quickRatios: any[];
    roe: any[];
    roa: any[];
    roic: any[];
    grossMargins: any[];
    operatingMargins: any[];
    netMargins: any[];
  }> {
    const [
      peRatios,
      priceToBookRatios,
      priceToSalesRatios,
      evToEbitdaRatios,
      currentRatios,
      quickRatios,
      roe,
      roa,
      roic,
      grossMargins,
      operatingMargins,
      netMargins,
    ] = await Promise.all([
      this.getPERatios(symbol),
      this.getPriceToBookRatios(symbol),
      this.getPriceToSalesRatios(symbol),
      this.getEVToEBITDARatios(symbol),
      this.getCurrentRatioHistory(symbol),
      this.getQuickRatioHistory(symbol),
      this.getReturnOnEquity(symbol),
      this.getReturnOnAssets(symbol),
      this.getReturnOnInvestedCapital(symbol),
      this.getGrossMarginHistory(symbol),
      this.getOperatingMarginHistory(symbol),
      this.getNetMarginHistory(symbol),
    ]);

    return {
      peRatios,
      priceToBookRatios,
      priceToSalesRatios,
      evToEbitdaRatios,
      currentRatios,
      quickRatios,
      roe,
      roa,
      roic,
      grossMargins,
      operatingMargins,
      netMargins,
    };
  }
}