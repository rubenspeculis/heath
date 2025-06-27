import { NumericValue, DateString, Period } from './api.js';

/**
 * Base financial statement
 */
export interface BaseFinancialStatement {
  date: DateString;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: DateString;
  acceptedDate: DateString;
  calendarYear: string;
  period: Period;
  link: string;
  finalLink: string;
}

/**
 * Income Statement
 */
export interface IncomeStatement extends BaseFinancialStatement {
  revenue: NumericValue;
  costOfRevenue: NumericValue;
  grossProfit: NumericValue;
  grossProfitRatio: NumericValue;
  researchAndDevelopmentExpenses: NumericValue;
  generalAndAdministrativeExpenses: NumericValue;
  sellingAndMarketingExpenses: NumericValue;
  sellingGeneralAndAdministrativeExpenses: NumericValue;
  otherExpenses: NumericValue;
  operatingExpenses: NumericValue;
  costAndExpenses: NumericValue;
  interestIncome: NumericValue;
  interestExpense: NumericValue;
  depreciationAndAmortization: NumericValue;
  ebitda: NumericValue;
  ebitdaratio: NumericValue;
  operatingIncome: NumericValue;
  operatingIncomeRatio: NumericValue;
  totalOtherIncomeExpensesNet: NumericValue;
  incomeBeforeTax: NumericValue;
  incomeBeforeTaxRatio: NumericValue;
  incomeTaxExpense: NumericValue;
  netIncome: NumericValue;
  netIncomeRatio: NumericValue;
  eps: NumericValue;
  epsdiluted: NumericValue;
  weightedAverageShsOut: NumericValue;
  weightedAverageShsOutDil: NumericValue;
}

/**
 * Balance Sheet Statement
 */
export interface BalanceSheetStatement extends BaseFinancialStatement {
  cashAndCashEquivalents: NumericValue;
  shortTermInvestments: NumericValue;
  cashAndShortTermInvestments: NumericValue;
  netReceivables: NumericValue;
  inventory: NumericValue;
  otherCurrentAssets: NumericValue;
  totalCurrentAssets: NumericValue;
  propertyPlantEquipmentNet: NumericValue;
  goodwill: NumericValue;
  intangibleAssets: NumericValue;
  goodwillAndIntangibleAssets: NumericValue;
  longTermInvestments: NumericValue;
  taxAssets: NumericValue;
  otherNonCurrentAssets: NumericValue;
  totalNonCurrentAssets: NumericValue;
  otherAssets: NumericValue;
  totalAssets: NumericValue;
  accountPayables: NumericValue;
  shortTermDebt: NumericValue;
  taxPayables: NumericValue;
  deferredRevenue: NumericValue;
  otherCurrentLiabilities: NumericValue;
  totalCurrentLiabilities: NumericValue;
  longTermDebt: NumericValue;
  deferredRevenueNonCurrent: NumericValue;
  deferredTaxLiabilitiesNonCurrent: NumericValue;
  otherNonCurrentLiabilities: NumericValue;
  totalNonCurrentLiabilities: NumericValue;
  otherLiabilities: NumericValue;
  capitalLeaseObligations: NumericValue;
  totalLiabilities: NumericValue;
  preferredStock: NumericValue;
  commonStock: NumericValue;
  retainedEarnings: NumericValue;
  accumulatedOtherComprehensiveIncomeLoss: NumericValue;
  othertotalStockholdersEquity: NumericValue;
  totalStockholdersEquity: NumericValue;
  totalEquity: NumericValue;
  totalLiabilitiesAndStockholdersEquity: NumericValue;
  minorityInterest: NumericValue;
  totalLiabilitiesAndTotalEquity: NumericValue;
  totalInvestments: NumericValue;
  totalDebt: NumericValue;
  netDebt: NumericValue;
}

/**
 * Cash Flow Statement
 */
export interface CashFlowStatement extends BaseFinancialStatement {
  netIncome: NumericValue;
  depreciationAndAmortization: NumericValue;
  deferredIncomeTax: NumericValue;
  stockBasedCompensation: NumericValue;
  changeInWorkingCapital: NumericValue;
  accountsReceivables: NumericValue;
  inventory: NumericValue;
  accountsPayables: NumericValue;
  otherWorkingCapital: NumericValue;
  otherNonCashItems: NumericValue;
  netCashProvidedByOperatingActivities: NumericValue;
  investmentsInPropertyPlantAndEquipment: NumericValue;
  acquisitionsNet: NumericValue;
  purchasesOfInvestments: NumericValue;
  salesMaturitiesOfInvestments: NumericValue;
  otherInvestingActivites: NumericValue;
  netCashUsedForInvestingActivites: NumericValue;
  debtRepayment: NumericValue;
  commonStockIssued: NumericValue;
  commonStockRepurchased: NumericValue;
  dividendsPaid: NumericValue;
  otherFinancingActivites: NumericValue;
  netCashUsedProvidedByFinancingActivities: NumericValue;
  effectOfForexChangesOnCash: NumericValue;
  netChangeInCash: NumericValue;
  cashAtEndOfPeriod: NumericValue;
  cashAtBeginningOfPeriod: NumericValue;
  operatingCashFlow: NumericValue;
  capitalExpenditure: NumericValue;
  freeCashFlow: NumericValue;
}

/**
 * Financial Growth
 */
export interface FinancialGrowth {
  symbol: string;
  date: DateString;
  period: Period;
  growthRevenue: NumericValue;
  growthCostOfRevenue: NumericValue;
  growthGrossProfit: NumericValue;
  growthGrossProfitRatio: NumericValue;
  growthResearchAndDevelopmentExpenses: NumericValue;
  growthGeneralAndAdministrativeExpenses: NumericValue;
  growthSellingAndMarketingExpenses: NumericValue;
  growthOtherExpenses: NumericValue;
  growthOperatingExpenses: NumericValue;
  growthCostAndExpenses: NumericValue;
  growthInterestExpense: NumericValue;
  growthDepreciationAndAmortization: NumericValue;
  growthEBITDA: NumericValue;
  growthEBITDARatio: NumericValue;
  growthOperatingIncome: NumericValue;
  growthOperatingIncomeRatio: NumericValue;
  growthTotalOtherIncomeExpensesNet: NumericValue;
  growthIncomeBeforeTax: NumericValue;
  growthIncomeBeforeTaxRatio: NumericValue;
  growthIncomeTaxExpense: NumericValue;
  growthNetIncome: NumericValue;
  growthNetIncomeRatio: NumericValue;
  growthEPS: NumericValue;
  growthEPSDiluted: NumericValue;
  growthWeightedAverageShsOut: NumericValue;
  growthWeightedAverageShsOutDil: NumericValue;
  growthDividendsperBasicCommonShare: NumericValue;
  growthDividendsperDilutedCommonShare: NumericValue;
  growthOperatingCashFlow: NumericValue;
  growthCapitalExpenditure: NumericValue;
  growthFreeCashFlow: NumericValue;
  growthTenYRevenueGrowthPerShare: NumericValue;
  growthFiveYRevenueGrowthPerShare: NumericValue;
  growthThreeYRevenueGrowthPerShare: NumericValue;
  growthTenYOperatingCFGrowthPerShare: NumericValue;
  growthFiveYOperatingCFGrowthPerShare: NumericValue;
  growthThreeYOperatingCFGrowthPerShare: NumericValue;
  growthTenYNetIncomeGrowthPerShare: NumericValue;
  growthFiveYNetIncomeGrowthPerShare: NumericValue;
  growthThreeYNetIncomeGrowthPerShare: NumericValue;
  growthTenYShareholdersEquityGrowthPerShare: NumericValue;
  growthFiveYShareholdersEquityGrowthPerShare: NumericValue;
  growthThreeYShareholdersEquityGrowthPerShare: NumericValue;
  growthTenYDividendperShareGrowthPerShare: NumericValue;
  growthFiveYDividendperShareGrowthPerShare: NumericValue;
  growthThreeYDividendperShareGrowthPerShare: NumericValue;
  growthReceivablesGrowth: NumericValue;
  growthInventoryGrowth: NumericValue;
  growthAssetGrowth: NumericValue;
  growthBookValueperShareGrowth: NumericValue;
  growthDebtGrowth: NumericValue;
  growthRdexpenseGrowth: NumericValue;
  growthSgaexpensesGrowth: NumericValue;
}

/**
 * Key Metrics (TTM)
 */
export interface KeyMetricsTTM {
  symbol: string;
  revenuePerShareTTM: NumericValue;
  netIncomePerShareTTM: NumericValue;
  operatingCashFlowPerShareTTM: NumericValue;
  freeCashFlowPerShareTTM: NumericValue;
  cashPerShareTTM: NumericValue;
  bookValuePerShareTTM: NumericValue;
  tangibleBookValuePerShareTTM: NumericValue;
  shareholdersEquityPerShareTTM: NumericValue;
  interestDebtPerShareTTM: NumericValue;
  marketCapTTM: NumericValue;
  enterpriseValueTTM: NumericValue;
  peRatioTTM: NumericValue;
  priceToSalesRatioTTM: NumericValue;
  pocfratioTTM: NumericValue;
  pfcfRatioTTM: NumericValue;
  pbRatioTTM: NumericValue;
  ptbRatioTTM: NumericValue;
  evToSalesTTM: NumericValue;
  enterpriseValueOverEBITDATTM: NumericValue;
  evToOperatingCashFlowTTM: NumericValue;
  evToFreeCashFlowTTM: NumericValue;
  earningsYieldTTM: NumericValue;
  freeCashFlowYieldTTM: NumericValue;
  debtToEquityTTM: NumericValue;
  debtToAssetsTTM: NumericValue;
  netDebtToEBITDATTM: NumericValue;
  currentRatioTTM: NumericValue;
  interestCoverageTTM: NumericValue;
  incomeQualityTTM: NumericValue;
  dividendYieldTTM: NumericValue;
  payoutRatioTTM: NumericValue;
  salesGeneralAndAdministrativeToRevenueTTM: NumericValue;
  researchAndDdevelopementToRevenueTTM: NumericValue;
  intangiblesToTotalAssetsTTM: NumericValue;
  capexToOperatingCashFlowTTM: NumericValue;
  capexToRevenueTTM: NumericValue;
  capexToDepreciationTTM: NumericValue;
  stockBasedCompensationToRevenueTTM: NumericValue;
  grahamNumberTTM: NumericValue;
  roicTTM: NumericValue;
  returnOnTangibleAssetsTTM: NumericValue;
  grahamNetNetTTM: NumericValue;
  workingCapitalTTM: NumericValue;
  tangibleAssetValueTTM: NumericValue;
  netCurrentAssetValueTTM: NumericValue;
  investedCapitalTTM: NumericValue;
  averageReceivablesTTM: NumericValue;
  averagePayablesTTM: NumericValue;
  averageInventoryTTM: NumericValue;
  daysSalesOutstandingTTM: NumericValue;
  daysPayablesOutstandingTTM: NumericValue;
  daysOfInventoryOnHandTTM: NumericValue;
  receivablesTurnoverTTM: NumericValue;
  payablesTurnoverTTM: NumericValue;
  inventoryTurnoverTTM: NumericValue;
  roeTTM: NumericValue;
  capexPerShareTTM: NumericValue;
}

/**
 * Financial statement as reported (unprocessed)
 */
export interface FinancialStatementAsReported {
  date: DateString;
  symbol: string;
  period: Period;
  documenttype: string;
  documentannualreport: boolean;
  documenttransitionreport: boolean;
  entityregistrantname: string;
  entitycentralindexkey: string;
  currentfiscalyearenddate: DateString;
  entitypublicfloat: NumericValue;
  entitycommonstocksharesoutstanding: NumericValue;
  documentfiscalyearfocus: string;
  documentfiscalperiodfocus: string;
  amendmentflag: boolean;
  amendments: string[];
  [key: string]: string | number | boolean | string[] | null;
}

/**
 * Enterprise value
 */
export interface EnterpriseValue {
  symbol: string;
  date: DateString;
  stockPrice: NumericValue;
  numberOfShares: NumericValue;
  marketCapitalization: NumericValue;
  minusCashAndCashEquivalents: NumericValue;
  addTotalDebt: NumericValue;
  enterpriseValue: NumericValue;
}