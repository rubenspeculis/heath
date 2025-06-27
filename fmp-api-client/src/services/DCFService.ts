import { BaseHttpClient } from '../client/base.js';
import {
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
} from '../types/dcf.js';
import { DateString, NumericValue } from '../types/api.js';

export class DCFService {
  constructor(private httpClient: BaseHttpClient) {}

  /**
   * Get basic DCF valuation for a symbol
   */
  async getDCFValuation(symbol: string): Promise<DCFValuation[]> {
    const response = await this.httpClient.get<DCFValuation[]>(
      `/discounted-cash-flow/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get advanced DCF analysis with detailed projections
   */
  async getAdvancedDCF(symbol: string): Promise<AdvancedDCF[]> {
    const response = await this.httpClient.get<AdvancedDCF[]>(
      `/advanced-discounted-cash-flow/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get historical DCF valuations
   */
  async getHistoricalDCF(
    symbol: string,
    options: {
      limit?: number;
      from?: DateString;
      to?: DateString;
    } = {}
  ): Promise<HistoricalDCF[]> {
    const params: Record<string, unknown> = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;

    const response = await this.httpClient.get<HistoricalDCF[]>(
      `/historical-discounted-cash-flow-statement/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get WACC (Weighted Average Cost of Capital)
   */
  async getWACC(symbol: string): Promise<WACC[]> {
    const response = await this.httpClient.get<WACC[]>(
      `/wacc/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get DCF valuation with custom parameters
   */
  async getCustomDCF(
    symbol: string,
    params: CustomDCFParams
  ): Promise<DCFValuation[]> {
    const response = await this.httpClient.post<DCFValuation[]>(
      `/custom-discounted-cash-flow/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get DCF sensitivity analysis
   */
  async getDCFSensitivityAnalysis(
    symbol: string,
    options: {
      discountRateRange?: [number, number];
      terminalGrowthRateRange?: [number, number];
      steps?: number;
    } = {}
  ): Promise<DCFSensitivityAnalysis> {
    const params: Record<string, unknown> = {};
    
    if (options.discountRateRange) {
      params.discountRateMin = options.discountRateRange[0];
      params.discountRateMax = options.discountRateRange[1];
    }
    if (options.terminalGrowthRateRange) {
      params.terminalGrowthRateMin = options.terminalGrowthRateRange[0];
      params.terminalGrowthRateMax = options.terminalGrowthRateRange[1];
    }
    if (options.steps) params.steps = options.steps;

    const response = await this.httpClient.get<DCFSensitivityAnalysis>(
      `/dcf-sensitivity-analysis/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get DCF assumptions for a symbol
   */
  async getDCFAssumptions(symbol: string): Promise<DCFAssumptions> {
    const response = await this.httpClient.get<DCFAssumptions>(
      `/dcf-assumptions/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Update DCF assumptions
   */
  async updateDCFAssumptions(
    symbol: string,
    assumptions: Partial<DCFAssumptions>
  ): Promise<DCFAssumptions> {
    const response = await this.httpClient.put<DCFAssumptions>(
      `/dcf-assumptions/${symbol}`,
      assumptions
    );
    return response.data as any;
  }

  /**
   * Get detailed DCF components breakdown
   */
  async getDCFComponents(symbol: string): Promise<DCFComponents> {
    const response = await this.httpClient.get<DCFComponents>(
      `/dcf-components/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get DCF rating and recommendation
   */
  async getDCFRating(symbol: string): Promise<DCFRating> {
    const response = await this.httpClient.get<DCFRating>(
      `/dcf-rating/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get Monte Carlo DCF simulation
   */
  async getMonteCarloDAF(
    symbol: string,
    options: {
      simulations?: number;
      confidenceLevel?: number;
    } = {}
  ): Promise<MonteCarloDAF> {
    const params: Record<string, unknown> = {};
    
    if (options.simulations) params.simulations = options.simulations;
    if (options.confidenceLevel) params.confidenceLevel = options.confidenceLevel;

    const response = await this.httpClient.get<MonteCarloDAF>(
      `/monte-carlo-dcf/${symbol}`,
      params
    );
    return response.data as any;
  }

  /**
   * Get sector DCF comparison
   */
  async getSectorDCFComparison(sector: string): Promise<SectorDCFComparison> {
    const response = await this.httpClient.get<SectorDCFComparison>(
      `/sector-dcf-comparison/${sector}`
    );
    return response.data as any;
  }

  /**
   * Get comprehensive DCF analysis
   */
  async getComprehensiveDCFAnalysis(
    symbol: string
  ): Promise<{
    basicDCF: DCFValuation[];
    advancedDCF: AdvancedDCF[];
    historicalDCF: HistoricalDCF[];
    wacc: WACC[];
    dcfRating: DCFRating;
    dcfComponents: DCFComponents;
    dcfAssumptions: DCFAssumptions;
  }> {
    const [
      basicDCF,
      advancedDCF,
      historicalDCF,
      wacc,
      dcfRating,
      dcfComponents,
      dcfAssumptions,
    ] = await Promise.all([
      this.getDCFValuation(symbol),
      this.getAdvancedDCF(symbol),
      this.getHistoricalDCF(symbol, { limit: 5 }),
      this.getWACC(symbol),
      this.getDCFRating(symbol),
      this.getDCFComponents(symbol),
      this.getDCFAssumptions(symbol),
    ]);

    return {
      basicDCF,
      advancedDCF,
      historicalDCF,
      wacc,
      dcfRating,
      dcfComponents,
      dcfAssumptions,
    };
  }

  /**
   * Calculate DCF with industry benchmarks
   */
  async getDCFWithBenchmarks(
    symbol: string,
    industry: string
  ): Promise<{
    dcf: DCFValuation[];
    industryMedianPE: NumericValue;
    industryMedianPB: NumericValue;
    industryMedianEVEBITDA: NumericValue;
    relativeValuation: {
      isPEOvervalued: boolean;
      isPBOvervalued: boolean;
      isEVEBITDAOvervalued: boolean;
    };
  }> {
    const response = await this.httpClient.get(
      `/dcf-with-benchmarks/${symbol}?industry=${industry}`
    );
    return response.data as any;
  }

  /**
   * Get DCF for multiple symbols
   */
  async getBatchDCF(symbols: string[]): Promise<Record<string, DCFValuation[]>> {
    const symbolList = symbols.join(',');
    const response = await this.httpClient.get<Record<string, DCFValuation[]>>(
      `/discounted-cash-flow/${symbolList}`
    );
    return response.data as any;
  }

  /**
   * Get levered/unlevered DCF analysis
   */
  async getLeveredUnleveredDCF(
    symbol: string
  ): Promise<{
    leveredDCF: DCFValuation[];
    unleveredDCF: DCFValuation[];
    leverageEffect: NumericValue;
    optimalCapitalStructure: {
      debtRatio: NumericValue;
      equityRatio: NumericValue;
      wacc: NumericValue;
      enterpriseValue: NumericValue;
    };
  }> {
    const response = await this.httpClient.get(
      `/levered-unlevered-dcf/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get sum-of-parts DCF for conglomerates
   */
  async getSumOfPartsDCF(
    symbol: string
  ): Promise<{
    segments: Array<{
      segmentName: string;
      revenue: NumericValue;
      operatingIncome: NumericValue;
      dcfValue: NumericValue;
      multiple: NumericValue;
    }>;
    totalDCF: NumericValue;
    sumOfParts: NumericValue;
    conglomerateDiscount: NumericValue;
  }> {
    const response = await this.httpClient.get(
      `/sum-of-parts-dcf/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get DCF stress test results
   */
  async getDCFStressTest(
    symbol: string,
    scenarios: Array<{
      name: string;
      revenueGrowthChange: NumericValue;
      marginChange: NumericValue;
      discountRateChange: NumericValue;
    }>
  ): Promise<{
    baseCase: DCFValuation;
    stressTestResults: Array<{
      scenario: string;
      dcfValue: NumericValue;
      percentageChange: NumericValue;
      outcome: 'Positive' | 'Negative' | 'Neutral';
    }>;
    worstCase: {
      scenario: string;
      dcfValue: NumericValue;
      percentageChange: NumericValue;
    };
    bestCase: {
      scenario: string;
      dcfValue: NumericValue;
      percentageChange: NumericValue;
    };
  }> {
    const response = await this.httpClient.post(
      `/dcf-stress-test/${symbol}`,
      { scenarios }
    );
    return response.data as any;
  }

  /**
   * Get DCF terminal value analysis
   */
  async getTerminalValueAnalysis(
    symbol: string
  ): Promise<{
    perpetualGrowthMethod: {
      terminalValue: NumericValue;
      presentValue: NumericValue;
      growthRate: NumericValue;
    };
    exitMultipleMethod: {
      terminalValue: NumericValue;
      presentValue: NumericValue;
      exitMultiple: NumericValue;
    };
    recommendedMethod: 'perpetualGrowth' | 'exitMultiple';
    terminalValueAsPercentOfTotalValue: NumericValue;
  }> {
    const response = await this.httpClient.get(
      `/terminal-value-analysis/${symbol}`
    );
    return response.data as any;
  }

  /**
   * Get DCF confidence intervals
   */
  async getDCFConfidenceIntervals(
    symbol: string,
    confidenceLevel: number = 95
  ): Promise<{
    pointEstimate: NumericValue;
    lowerBound: NumericValue;
    upperBound: NumericValue;
    confidenceLevel: number;
    standardError: NumericValue;
    keyAssumptionSensitivity: Array<{
      assumption: string;
      impact: NumericValue;
      elasticity: NumericValue;
    }>;
  }> {
    const response = await this.httpClient.get(
      `/dcf-confidence-intervals/${symbol}?confidenceLevel=${confidenceLevel}`
    );
    return response.data as any;
  }

  /**
   * Export DCF model to Excel
   */
  async exportDCFModel(
    symbol: string,
    options: {
      includeAssumptions?: boolean;
      includeSensitivity?: boolean;
      includeCharts?: boolean;
    } = {}
  ): Promise<{
    downloadUrl: string;
    expiresAt: DateString;
  }> {
    const params = new URLSearchParams();
    if (options.includeAssumptions) params.append('includeAssumptions', 'true');
    if (options.includeSensitivity) params.append('includeSensitivity', 'true');
    if (options.includeCharts) params.append('includeCharts', 'true');

    const response = await this.httpClient.get(
      `/export-dcf-model/${symbol}?${params.toString()}`
    );
    return response.data as any;
  }
}