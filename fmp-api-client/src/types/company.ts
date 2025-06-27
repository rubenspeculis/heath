import {
  NumericValue,
  StringValue,
  DateString,
  Exchange,
  Currency,
  Sector,
  Industry,
  StockIdentifiers,
  PriceChange,
} from './api.js';

/**
 * Company profile information
 */
export interface CompanyProfile extends StockIdentifiers {
  companyName: string;
  price: NumericValue;
  beta: NumericValue;
  volAvg: NumericValue;
  mktCap: NumericValue;
  lastDiv: NumericValue;
  range: StringValue;
  changes: NumericValue;
  currency: Currency;
  exchangeShortName: Exchange;
  industry: Industry;
  website: StringValue;
  description: StringValue;
  ceo: StringValue;
  sector: Sector;
  country: StringValue;
  fullTimeEmployees: StringValue;
  phone: StringValue;
  address: StringValue;
  city: StringValue;
  state: StringValue;
  zip: StringValue;
  dcfDiff: NumericValue;
  dcf: NumericValue;
  image: StringValue;
  ipoDate: DateString;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

/**
 * Company search result
 */
export interface CompanySearchResult {
  symbol: string;
  name: string;
  currency: Currency;
  stockExchange: Exchange;
  exchangeShortName: Exchange;
}

/**
 * Company quote information
 */
export interface CompanyQuote extends PriceChange {
  symbol: string;
  name: string;
  price: NumericValue;
  changesPercentage: NumericValue;
  change: NumericValue;
  dayLow: NumericValue;
  dayHigh: NumericValue;
  yearHigh: NumericValue;
  yearLow: NumericValue;
  marketCap: NumericValue;
  priceAvg50: NumericValue;
  priceAvg200: NumericValue;
  exchange: Exchange;
  volume: NumericValue;
  avgVolume: NumericValue;
  open: NumericValue;
  previousClose: NumericValue;
  eps: NumericValue;
  pe: NumericValue;
  earningsAnnouncement: StringValue;
  sharesOutstanding: NumericValue;
  timestamp: number;
}

/**
 * Real-time quote
 */
export interface RealTimeQuote {
  symbol: string;
  name: string;
  price: NumericValue;
  change: NumericValue;
  changesPercentage: NumericValue;
  volume: NumericValue;
  timestamp: number;
}

/**
 * Company executives
 */
export interface CompanyExecutive {
  title: string;
  name: string;
  pay: NumericValue;
  currencyPay: Currency;
  gender: StringValue;
  yearBorn: NumericValue;
  titleSince: StringValue;
}

/**
 * Company key executives
 */
export interface CompanyKeyExecutives {
  symbol: string;
  executives: CompanyExecutive[];
}

/**
 * Market capitalization
 */
export interface MarketCapitalization {
  symbol: string;
  date: DateString;
  marketCap: NumericValue;
}

/**
 * Company outlook
 */
export interface CompanyOutlook {
  profile: CompanyProfile;
  metrics: CompanyMetrics;
  financialsAnnual: FinancialGrowth;
  financialsQuarter: FinancialGrowth;
  rating: CompanyRating[];
  insideTrades: InsiderTrade[];
  keyExecutives: CompanyExecutive[];
  splitHistory: StockSplit[];
  stockDividend: StockDividend[];
  stockNews: StockNews[];
}

/**
 * Company metrics
 */
export interface CompanyMetrics {
  dividendYielTTM: NumericValue;
  volume: NumericValue;
  yearHigh: NumericValue;
  yearLow: NumericValue;
}

/**
 * Financial growth
 */
export interface FinancialGrowth {
  growth: GrowthMetrics[];
}

/**
 * Growth metrics
 */
export interface GrowthMetrics {
  date: DateString;
  symbol: string;
  revenueGrowth: NumericValue;
  grossProfitGrowth: NumericValue;
  ebitgrowth: NumericValue;
  operatingIncomeGrowth: NumericValue;
  netIncomeGrowth: NumericValue;
  epsgrowth: NumericValue;
  epsdilutedGrowth: NumericValue;
  weightedAverageSharesGrowth: NumericValue;
  weightedAverageSharesDilutedGrowth: NumericValue;
  dividendsperShareGrowth: NumericValue;
  operatingCashFlowGrowth: NumericValue;
  freeCashFlowGrowth: NumericValue;
  tenYRevenueGrowthPerShare: NumericValue;
  fiveYRevenueGrowthPerShare: NumericValue;
  threeYRevenueGrowthPerShare: NumericValue;
  tenYOperatingCFGrowthPerShare: NumericValue;
  fiveYOperatingCFGrowthPerShare: NumericValue;
  threeYOperatingCFGrowthPerShare: NumericValue;
  tenYNetIncomeGrowthPerShare: NumericValue;
  fiveYNetIncomeGrowthPerShare: NumericValue;
  threeYNetIncomeGrowthPerShare: NumericValue;
  tenYShareholdersEquityGrowthPerShare: NumericValue;
  fiveYShareholdersEquityGrowthPerShare: NumericValue;
  threeYShareholdersEquityGrowthPerShare: NumericValue;
  tenYDividendperShareGrowthPerShare: NumericValue;
  fiveYDividendperShareGrowthPerShare: NumericValue;
  threeYDividendperShareGrowthPerShare: NumericValue;
  receivablesGrowth: NumericValue;
  inventoryGrowth: NumericValue;
  assetGrowth: NumericValue;
  bookValueperShareGrowth: NumericValue;
  debtGrowth: NumericValue;
  rdexpenseGrowth: NumericValue;
  sgaexpensesGrowth: NumericValue;
}

/**
 * Company rating
 */
export interface CompanyRating {
  symbol: string;
  date: DateString;
  rating: string;
  ratingScore: NumericValue;
  ratingRecommendation: string;
  ratingDetailsDCFScore: NumericValue;
  ratingDetailsDCFRecommendation: string;
  ratingDetailsROEScore: NumericValue;
  ratingDetailsROERecommendation: string;
  ratingDetailsROAScore: NumericValue;
  ratingDetailsROARecommendation: string;
  ratingDetailsDEScore: NumericValue;
  ratingDetailsDERecommendation: string;
  ratingDetailsPEScore: NumericValue;
  ratingDetailsPERecommendation: string;
  ratingDetailsPBScore: NumericValue;
  ratingDetailsPBRecommendation: string;
}

/**
 * Insider trade
 */
export interface InsiderTrade {
  symbol: string;
  filingDate: DateString;
  transactionDate: DateString;
  reportingCik: string;
  transactionType: string;
  securitiesOwned: NumericValue;
  companyCik: string;
  reportingName: string;
  typeOfOwner: string;
  acquisitionOrDisposition: string;
  formType: string;
  securitiesTransacted: NumericValue;
  price: NumericValue;
  securityName: string;
  link: string;
}

/**
 * Stock split
 */
export interface StockSplit {
  date: DateString;
  label: string;
  symbol: string;
  numerator: NumericValue;
  denominator: NumericValue;
}

/**
 * Stock dividend
 */
export interface StockDividend {
  date: DateString;
  label: string;
  adjDividend: NumericValue;
  symbol: string;
  dividend: NumericValue;
  recordDate: DateString;
  paymentDate: DateString;
  declarationDate: DateString;
}

/**
 * Stock news
 */
export interface StockNews {
  symbol: string;
  publishedDate: DateString;
  title: string;
  image: StringValue;
  site: string;
  text: string;
  url: string;
}

/**
 * Market hours
 */
export interface MarketHours {
  stockExchangeName: string;
  stockMarketHours: {
    openingHour: string;
    closingHour: string;
  };
  stockMarketHolidays: Array<{
    year: number;
    date: DateString;
    name: string;
  }>;
}

/**
 * Available symbols
 */
export interface AvailableSymbol {
  symbol: string;
  name: string;
  price: NumericValue;
  exchange: Exchange;
  exchangeShortName: Exchange;
  type: string;
}