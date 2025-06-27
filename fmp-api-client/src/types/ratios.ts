import { NumericValue, DateString, Period } from './api.js';

/**
 * Financial ratios
 */
export interface FinancialRatios {
  symbol: string;
  date: DateString;
  period: Period;
  currentRatio: NumericValue;
  quickRatio: NumericValue;
  cashRatio: NumericValue;
  daysOfSalesOutstanding: NumericValue;
  daysOfInventoryOutstanding: NumericValue;
  operatingCycle: NumericValue;
  daysOfPayablesOutstanding: NumericValue;
  cashConversionCycle: NumericValue;
  grossProfitMargin: NumericValue;
  operatingProfitMargin: NumericValue;
  pretaxProfitMargin: NumericValue;
  netProfitMargin: NumericValue;
  effectiveTaxRate: NumericValue;
  returnOnAssets: NumericValue;
  returnOnEquity: NumericValue;
  returnOnCapitalEmployed: NumericValue;
  netIncomePerEBT: NumericValue;
  ebtPerEbit: NumericValue;
  ebitPerRevenue: NumericValue;
  debtRatio: NumericValue;
  debtEquityRatio: NumericValue;
  longTermDebtToCapitalization: NumericValue;
  totalDebtToCapitalization: NumericValue;
  interestCoverage: NumericValue;
  cashFlowToDebtRatio: NumericValue;
  companyEquityMultiplier: NumericValue;
  receivablesTurnover: NumericValue;
  payablesTurnover: NumericValue;
  inventoryTurnover: NumericValue;
  fixedAssetTurnover: NumericValue;
  assetTurnover: NumericValue;
  operatingCashFlowPerShare: NumericValue;
  freeCashFlowPerShare: NumericValue;
  cashPerShare: NumericValue;
  payoutRatio: NumericValue;
  operatingCashFlowSalesRatio: NumericValue;
  freeCashFlowOperatingCashFlowRatio: NumericValue;
  cashFlowCoverageRatios: NumericValue;
  shortTermCoverageRatios: NumericValue;
  capitalExpenditureCoverageRatio: NumericValue;
  dividendPaidAndCapexCoverageRatio: NumericValue;
  dividendPayoutRatio: NumericValue;
  priceBookValueRatio: NumericValue;
  priceToBookRatio: NumericValue;
  priceToSalesRatio: NumericValue;
  priceEarningsRatio: NumericValue;
  priceToFreeCashFlowsRatio: NumericValue;
  priceToOperatingCashFlowsRatio: NumericValue;
  priceCashFlowRatio: NumericValue;
  priceEarningsToGrowthRatio: NumericValue;
  priceSalesRatio: NumericValue;
  dividendYield: NumericValue;
  enterpriseValueMultiple: NumericValue;
  priceFairValue: NumericValue;
}

/**
 * TTM (Trailing Twelve Months) Ratios
 */
export interface TTMRatios {
  dividendYielTTM: NumericValue;
  dividendYielPercentageTTM: NumericValue;
  peRatioTTM: NumericValue;
  pegRatioTTM: NumericValue;
  payoutRatioTTM: NumericValue;
  currentRatioTTM: NumericValue;
  quickRatioTTM: NumericValue;
  cashRatioTTM: NumericValue;
  daysOfSalesOutstandingTTM: NumericValue;
  daysOfInventoryOutstandingTTM: NumericValue;
  operatingCycleTTM: NumericValue;
  daysOfPayablesOutstandingTTM: NumericValue;
  cashConversionCycleTTM: NumericValue;
  grossProfitMarginTTM: NumericValue;
  operatingProfitMarginTTM: NumericValue;
  pretaxProfitMarginTTM: NumericValue;
  netProfitMarginTTM: NumericValue;
  effectiveTaxRateTTM: NumericValue;
  returnOnAssetsTTM: NumericValue;
  returnOnEquityTTM: NumericValue;
  returnOnCapitalEmployedTTM: NumericValue;
  netIncomePerEBTTTM: NumericValue;
  ebtPerEbitTTM: NumericValue;
  ebitPerRevenueTTM: NumericValue;
  debtRatioTTM: NumericValue;
  debtEquityRatioTTM: NumericValue;
  longTermDebtToCapitalizationTTM: NumericValue;
  totalDebtToCapitalizationTTM: NumericValue;
  interestCoverageTTM: NumericValue;
  cashFlowToDebtRatioTTM: NumericValue;
  companyEquityMultiplierTTM: NumericValue;
  receivablesTurnoverTTM: NumericValue;
  payablesTurnoverTTM: NumericValue;
  inventoryTurnoverTTM: NumericValue;
  fixedAssetTurnoverTTM: NumericValue;
  assetTurnoverTTM: NumericValue;
  operatingCashFlowPerShareTTM: NumericValue;
  freeCashFlowPerShareTTM: NumericValue;
  cashPerShareTTM: NumericValue;
  operatingCashFlowSalesRatioTTM: NumericValue;
  freeCashFlowOperatingCashFlowRatioTTM: NumericValue;
  cashFlowCoverageRatiosTTM: NumericValue;
  shortTermCoverageRatiosTTM: NumericValue;
  capitalExpenditureCoverageRatioTTM: NumericValue;
  dividendPaidAndCapexCoverageRatioTTM: NumericValue;
  priceBookValueRatioTTM: NumericValue;
  priceToBookRatioTTM: NumericValue;
  priceToSalesRatioTTM: NumericValue;
  priceEarningsRatioTTM: NumericValue;
  priceToFreeCashFlowsRatioTTM: NumericValue;
  priceToOperatingCashFlowsRatioTTM: NumericValue;
  priceCashFlowRatioTTM: NumericValue;
  priceEarningsToGrowthRatioTTM: NumericValue;
  priceSalesRatioTTM: NumericValue;
  enterpriseValueMultipleTTM: NumericValue;
  priceFairValueTTM: NumericValue;
}

/**
 * Key metrics
 */
export interface KeyMetrics {
  symbol: string;
  date: DateString;
  period: Period;
  revenuePerShare: NumericValue;
  netIncomePerShare: NumericValue;
  operatingCashFlowPerShare: NumericValue;
  freeCashFlowPerShare: NumericValue;
  cashPerShare: NumericValue;
  bookValuePerShare: NumericValue;
  tangibleBookValuePerShare: NumericValue;
  shareholdersEquityPerShare: NumericValue;
  interestDebtPerShare: NumericValue;
  marketCap: NumericValue;
  enterpriseValue: NumericValue;
  peRatio: NumericValue;
  priceToSalesRatio: NumericValue;
  pocfratio: NumericValue;
  pfcfRatio: NumericValue;
  pbRatio: NumericValue;
  ptbRatio: NumericValue;
  evToSales: NumericValue;
  enterpriseValueOverEBITDA: NumericValue;
  evToOperatingCashFlow: NumericValue;
  evToFreeCashFlow: NumericValue;
  earningsYield: NumericValue;
  freeCashFlowYield: NumericValue;
  debtToEquity: NumericValue;
  debtToAssets: NumericValue;
  netDebtToEBITDA: NumericValue;
  currentRatio: NumericValue;
  interestCoverage: NumericValue;
  incomeQuality: NumericValue;
  dividendYield: NumericValue;
  payoutRatio: NumericValue;
  salesGeneralAndAdministrativeToRevenue: NumericValue;
  researchAndDdevelopementToRevenue: NumericValue;
  intangiblesToTotalAssets: NumericValue;
  capexToOperatingCashFlow: NumericValue;
  capexToRevenue: NumericValue;
  capexToDepreciation: NumericValue;
  stockBasedCompensationToRevenue: NumericValue;
  grahamNumber: NumericValue;
  roic: NumericValue;
  returnOnTangibleAssets: NumericValue;
  grahamNetNet: NumericValue;
  workingCapital: NumericValue;
  tangibleAssetValue: NumericValue;
  netCurrentAssetValue: NumericValue;
  investedCapital: NumericValue;
  averageReceivables: NumericValue;
  averagePayables: NumericValue;
  averageInventory: NumericValue;
  daysSalesOutstanding: NumericValue;
  daysPayablesOutstanding: NumericValue;
  daysOfInventoryOnHand: NumericValue;
  receivablesTurnover: NumericValue;
  payablesTurnover: NumericValue;
  inventoryTurnover: NumericValue;
  roe: NumericValue;
  capexPerShare: NumericValue;
}

/**
 * Financial scores
 */
export interface FinancialScore {
  symbol: string;
  altmanZScore: NumericValue;
  piotroskiScore: NumericValue;
  workingCapital: NumericValue;
  totalAssets: NumericValue;
  retainedEarnings: NumericValue;
  ebit: NumericValue;
  marketCap: NumericValue;
  totalLiabilities: NumericValue;
  revenue: NumericValue;
}

/**
 * Owner earnings
 */
export interface OwnerEarnings {
  symbol: string;
  date: DateString;
  ownerEarnings: NumericValue;
  capexAsPercentageOfSales: NumericValue;
  depreciationAsPercentageOfSales: NumericValue;
  maintenanceCapex: NumericValue;
  growthCapex: NumericValue;
  ownerEarningsPerShare: NumericValue;
}

/**
 * Efficiency ratios
 */
export interface EfficiencyRatios {
  symbol: string;
  date: DateString;
  period: Period;
  assetTurnover: NumericValue;
  inventoryTurnover: NumericValue;
  receivablesTurnover: NumericValue;
  payablesTurnover: NumericValue;
  fixedAssetTurnover: NumericValue;
  totalAssetTurnover: NumericValue;
}

/**
 * Leverage ratios
 */
export interface LeverageRatios {
  symbol: string;
  date: DateString;
  period: Period;
  debtToAssets: NumericValue;
  debtToEquity: NumericValue;
  longTermDebtToCapitalization: NumericValue;
  totalDebtToCapitalization: NumericValue;
  interestCoverage: NumericValue;
  cashCoverage: NumericValue;
  debtServiceCoverage: NumericValue;
}

/**
 * Liquidity ratios
 */
export interface LiquidityRatios {
  symbol: string;
  date: DateString;
  period: Period;
  currentRatio: NumericValue;
  quickRatio: NumericValue;
  cashRatio: NumericValue;
  operatingCashFlowRatio: NumericValue;
  workingCapitalRatio: NumericValue;
}

/**
 * Profitability ratios
 */
export interface ProfitabilityRatios {
  symbol: string;
  date: DateString;
  period: Period;
  grossProfitMargin: NumericValue;
  operatingProfitMargin: NumericValue;
  pretaxProfitMargin: NumericValue;
  netProfitMargin: NumericValue;
  returnOnAssets: NumericValue;
  returnOnEquity: NumericValue;
  returnOnCapitalEmployed: NumericValue;
  roic: NumericValue;
  capexToDepreciation: NumericValue;
}