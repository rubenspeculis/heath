import { NumericValue, DateString } from './api.js';

/**
 * DCF (Discounted Cash Flow) valuation
 */
export interface DCFValuation {
  symbol: string;
  date: DateString;
  dcf: NumericValue;
  Stock_Price: NumericValue;
}

/**
 * Advanced DCF
 */
export interface AdvancedDCF {
  symbol: string;
  date: DateString;
  dcf: NumericValue;
  revenue: NumericValue;
  revenueGrowthRate: NumericValue;
  operatingCashFlow: NumericValue;
  operatingCashFlowGrowthRate: NumericValue;
  freeCashFlow: NumericValue;
  freeCashFlowGrowthRate: NumericValue;
  terminalValue: NumericValue;
  presentValueOfTerminalValue: NumericValue;
  sumPvFcf: NumericValue;
  enterpriseValue: NumericValue;
  netDebt: NumericValue;
  equityValue: NumericValue;
  equityValuePerShare: NumericValue;
  freeCashFlowT1: NumericValue;
  freeCashFlowT2: NumericValue;
  freeCashFlowT3: NumericValue;
  freeCashFlowT4: NumericValue;
  freeCashFlowT5: NumericValue;
  freeCashFlowT6: NumericValue;
  freeCashFlowT7: NumericValue;
  freeCashFlowT8: NumericValue;
  freeCashFlowT9: NumericValue;
  freeCashFlowT10: NumericValue;
}

/**
 * Custom DCF parameters
 */
export interface CustomDCFParams {
  symbol: string;
  years: number;
  growthRate: NumericValue;
  discountRate: NumericValue;
  terminalGrowthRate: NumericValue;
  freeCashFlow: NumericValue[];
  revenue: NumericValue[];
  capex: NumericValue[];
  workingCapitalChange: NumericValue[];
  taxRate: NumericValue;
}

/**
 * DCF sensitivity analysis
 */
export interface DCFSensitivityAnalysis {
  symbol: string;
  baseCase: {
    dcf: NumericValue;
    discountRate: NumericValue;
    terminalGrowthRate: NumericValue;
  };
  scenarios: Array<{
    scenario: string;
    dcf: NumericValue;
    discountRate: NumericValue;
    terminalGrowthRate: NumericValue;
    probability: NumericValue;
  }>;
  sensitivityMatrix: Array<{
    discountRate: NumericValue;
    terminalGrowthRate: NumericValue;
    dcf: NumericValue;
  }>;
}

/**
 * WACC (Weighted Average Cost of Capital)
 */
export interface WACC {
  symbol: string;
  date: DateString;
  wacc: NumericValue;
  costOfEquity: NumericValue;
  costOfDebt: NumericValue;
  taxRate: NumericValue;
  marketValueOfEquity: NumericValue;
  marketValueOfDebt: NumericValue;
  totalValue: NumericValue;
  equityWeight: NumericValue;
  debtWeight: NumericValue;
  riskFreeRate: NumericValue;
  marketRiskPremium: NumericValue;
  beta: NumericValue;
}

/**
 * DCF assumptions
 */
export interface DCFAssumptions {
  symbol: string;
  projectionYears: number;
  terminalGrowthRate: NumericValue;
  discountRate: NumericValue;
  taxRate: NumericValue;
  capexAsPercentOfRevenue: NumericValue;
  revenueGrowthRates: NumericValue[];
  operatingMarginProjections: NumericValue[];
  workingCapitalAsPercentOfRevenue: NumericValue;
  terminalMultiple: NumericValue;
  confidenceLevel: NumericValue;
}

/**
 * DCF components breakdown
 */
export interface DCFComponents {
  symbol: string;
  date: DateString;
  presentValueOfFCF: {
    year1: NumericValue;
    year2: NumericValue;
    year3: NumericValue;
    year4: NumericValue;
    year5: NumericValue;
    year6: NumericValue;
    year7: NumericValue;
    year8: NumericValue;
    year9: NumericValue;
    year10: NumericValue;
    total: NumericValue;
  };
  terminalValue: {
    terminalFCF: NumericValue;
    terminalGrowthRate: NumericValue;
    discountRate: NumericValue;
    terminalValue: NumericValue;
    presentValueOfTerminalValue: NumericValue;
  };
  enterpriseValue: NumericValue;
  minusCashAndEquivalents: NumericValue;
  plusTotalDebt: NumericValue;
  equityValue: NumericValue;
  sharesOutstanding: NumericValue;
  valuePerShare: NumericValue;
}

/**
 * Historical DCF
 */
export interface HistoricalDCF {
  symbol: string;
  date: DateString;
  dcf: NumericValue;
  stockPrice: NumericValue;
  accuracy: NumericValue; // How close the DCF was to actual price
  discountToPremium: NumericValue; // Percentage difference
}

/**
 * DCF rating
 */
export interface DCFRating {
  symbol: string;
  date: DateString;
  dcf: NumericValue;
  stockPrice: NumericValue;
  rating: string; // 'Undervalued', 'Fairly Valued', 'Overvalued'
  upside: NumericValue; // Percentage upside/downside
  confidence: 'High' | 'Medium' | 'Low';
  lastUpdated: DateString;
}

/**
 * Monte Carlo DCF simulation
 */
export interface MonteCarloDAF {
  symbol: string;
  simulations: number;
  confidenceInterval: {
    lower5: NumericValue;
    lower25: NumericValue;
    median: NumericValue;
    upper75: NumericValue;
    upper95: NumericValue;
  };
  meanDCF: NumericValue;
  standardDeviation: NumericValue;
  probabilityOfUndervaluation: NumericValue;
  targetPriceDistribution: Array<{
    price: NumericValue;
    probability: NumericValue;
  }>;
}

/**
 * Sector DCF comparison
 */
export interface SectorDCFComparison {
  sector: string;
  stocks: Array<{
    symbol: string;
    companyName: string;
    dcf: NumericValue;
    stockPrice: NumericValue;
    upside: NumericValue;
    marketCap: NumericValue;
  }>;
  sectorMedianUpside: NumericValue;
  sectorAverageUpside: NumericValue;
  mostUndervaluedStocks: string[];
  mostOvervaluedStocks: string[];
}