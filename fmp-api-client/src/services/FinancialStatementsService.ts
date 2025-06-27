import { BaseHttpClient } from '../client/base.js';
import {
  IncomeStatement,
  BalanceSheetStatement,
  CashFlowStatement,
  FinancialGrowth,
  KeyMetricsTTM,
  FinancialStatementAsReported,
  EnterpriseValue,
} from '../types/financials.js';
import { DateString, Period } from '../types/api.js';

export class FinancialStatementsService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Get income statements for a symbol
   */
  async getIncomeStatements(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<IncomeStatement[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<IncomeStatement[]>(
      `/income-statement/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get balance sheet statements for a symbol
   */
  async getBalanceSheetStatements(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<BalanceSheetStatement[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<BalanceSheetStatement[]>(
      `/balance-sheet-statement/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get cash flow statements for a symbol
   */
  async getCashFlowStatements(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<CashFlowStatement[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<CashFlowStatement[]>(
      `/cash-flow-statement/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get complete financial statements (income, balance sheet, cash flow)
   */
  async getCompleteFinancialStatements(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<{
    incomeStatements: IncomeStatement[];
    balanceSheetStatements: BalanceSheetStatement[];
    cashFlowStatements: CashFlowStatement[];
  }> {
    const [incomeStatements, balanceSheetStatements, cashFlowStatements] = await Promise.all([
      this.getIncomeStatements(symbol, options),
      this.getBalanceSheetStatements(symbol, options),
      this.getCashFlowStatements(symbol, options),
    ]);

    return {
      incomeStatements,
      balanceSheetStatements,
      cashFlowStatements,
    };
  }

  /**
   * Get annual income statements
   */
  async getAnnualIncomeStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<IncomeStatement[]> {
    return this.getIncomeStatements(symbol, { ...options, period: 'annual' });
  }

  /**
   * Get quarterly income statements
   */
  async getQuarterlyIncomeStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<IncomeStatement[]> {
    return this.getIncomeStatements(symbol, { ...options, period: 'quarter' });
  }

  /**
   * Get annual balance sheet statements
   */
  async getAnnualBalanceSheetStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<BalanceSheetStatement[]> {
    return this.getBalanceSheetStatements(symbol, { ...options, period: 'annual' });
  }

  /**
   * Get quarterly balance sheet statements
   */
  async getQuarterlyBalanceSheetStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<BalanceSheetStatement[]> {
    return this.getBalanceSheetStatements(symbol, { ...options, period: 'quarter' });
  }

  /**
   * Get annual cash flow statements
   */
  async getAnnualCashFlowStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<CashFlowStatement[]> {
    return this.getCashFlowStatements(symbol, { ...options, period: 'annual' });
  }

  /**
   * Get quarterly cash flow statements
   */
  async getQuarterlyCashFlowStatements(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<CashFlowStatement[]> {
    return this.getCashFlowStatements(symbol, { ...options, period: 'quarter' });
  }

  /**
   * Get financial growth metrics
   */
  async getFinancialGrowth(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<FinancialGrowth[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<FinancialGrowth[]>(
      `/financial-growth/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get key metrics TTM (Trailing Twelve Months)
   */
  async getKeyMetricsTTM(symbol: string): Promise<KeyMetricsTTM[]> {
    const response = await this.httpClient.get<KeyMetricsTTM[]>(
      `/key-metrics-ttm/${symbol}`
    );
    return response.data;
  }

  /**
   * Get key metrics for multiple periods
   */
  async getKeyMetrics(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<KeyMetricsTTM[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<KeyMetricsTTM[]>(
      `/key-metrics/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get enterprise values
   */
  async getEnterpriseValues(
    symbol: string,
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<EnterpriseValue[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<EnterpriseValue[]>(
      `/enterprise-values/${symbol}`,
      params
    );
    return response.data;
  }

  /**
   * Get financial statements as reported (raw SEC filing data)
   */
  async getFinancialStatementsAsReported(
    symbol: string,
    options: {
      type?: 'income-statement' | 'balance-sheet-statement' | 'cash-flow-statement';
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<FinancialStatementAsReported[]> {
    const statementType = options.type || 'income-statement';
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get<FinancialStatementAsReported[]>(
      `/financial-statement-full-as-reported/${symbol}?statement=${statementType}`,
      params
    );
    return response.data;
  }

  /**
   * Get financial statements symbols (available symbols for financial data)
   */
  async getFinancialStatementsSymbols(): Promise<{ symbol: string }[]> {
    const response = await this.httpClient.get<{ symbol: string }[]>(
      '/financial-statement-symbol-lists'
    );
    return response.data;
  }

  /**
   * Get batch financial statements for multiple symbols
   */
  async getBatchIncomeStatements(
    symbols: string[],
    options: {
      period?: Period;
      year?: number;
    } = {}
  ): Promise<Record<string, IncomeStatement[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.year) params.year = options.year;

    const response = await this.httpClient.get<Record<string, IncomeStatement[]>>(
      `/income-statement/${symbolList}`,
      params
    );
    return response.data;
  }

  /**
   * Get batch balance sheet statements for multiple symbols
   */
  async getBatchBalanceSheetStatements(
    symbols: string[],
    options: {
      period?: Period;
      year?: number;
    } = {}
  ): Promise<Record<string, BalanceSheetStatement[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.year) params.year = options.year;

    const response = await this.httpClient.get<Record<string, BalanceSheetStatement[]>>(
      `/balance-sheet-statement/${symbolList}`,
      params
    );
    return response.data;
  }

  /**
   * Get batch cash flow statements for multiple symbols
   */
  async getBatchCashFlowStatements(
    symbols: string[],
    options: {
      period?: Period;
      year?: number;
    } = {}
  ): Promise<Record<string, CashFlowStatement[]>> {
    const symbolList = symbols.join(',');
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.year) params.year = options.year;

    const response = await this.httpClient.get<Record<string, CashFlowStatement[]>>(
      `/cash-flow-statement/${symbolList}`,
      params
    );
    return response.data;
  }

  /**
   * Get shares float for a symbol
   */
  async getSharesFloat(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/shares_float/${symbol}`);
    return response.data;
  }

  /**
   * Get shares float for all companies
   */
  async getAllSharesFloat(): Promise<any[]> {
    const response = await this.httpClient.get('/shares_float');
    return response.data;
  }

  /**
   * Get revenue geographic segments
   */
  async getRevenueGeographicSegments(
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
    return response.data;
  }

  /**
   * Get revenue product segments
   */
  async getRevenueProductSegments(
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
    return response.data;
  }

  /**
   * Get fiscal dates for a symbol
   */
  async getFiscalDates(symbol: string): Promise<any[]> {
    const response = await this.httpClient.get(`/fiscal-dates/${symbol}`);
    return response.data;
  }

  /**
   * Get earnings estimates
   */
  async getEarningsEstimates(
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
    return response.data;
  }

  /**
   * Get standardized financial statements
   */
  async getStandardizedFinancialStatements(
    symbol: string,
    statement: 'income-statement' | 'balance-sheet-statement' | 'cash-flow-statement',
    options: {
      period?: Period;
      limit?: number;
    } = {}
  ): Promise<any[]> {
    const params: Record<string, unknown> = {};
    
    if (options.period) params.period = options.period;
    if (options.limit) params.limit = options.limit;

    const response = await this.httpClient.get(
      `/financial-statement-full-as-reported/${symbol}?statement=${statement}&standardized=true`,
      params
    );
    return response.data;
  }
}