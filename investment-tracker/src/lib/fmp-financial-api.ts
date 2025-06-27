import { FMPApiClient } from '@heath/fmp-api-client'

interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  marketCap?: number
}

interface CompanyProfile {
  symbol: string
  name: string
  currency: string
  exchange: string
  industry?: string
  sector?: string
  marketCap?: number
  price?: number
}

interface SearchResult {
  ticker: string
  name: string
  type?: string
  region?: string
  currency?: string
}

export class FMPFinancialApiService {
  private client: FMPApiClient

  constructor() {
    const apiKey = process.env.FMP_API_KEY
    if (!apiKey) {
      console.warn('FMP_API_KEY not found in environment variables')
    }

    this.client = new FMPApiClient({
      apiKey: apiKey || 'demo',
      baseURL: 'https://financialmodelingprep.com/api/v3',
      timeout: 10000,
      rateLimit: {
        requestsPerSecond: 5,
        burstSize: 10
      }
    })
  }

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      console.log(`Fetching quote for ${symbol} from FMP...`)
      const quotes = await this.client.quotes.getRealTimeQuote(symbol)
      
      if (!quotes || quotes.length === 0) {
        console.log(`No quote found for ${symbol}`)
        return null
      }

      const quote = quotes[0]
      return {
        symbol: quote.symbol,
        price: quote.price || 0,
        change: quote.change || 0,
        changePercent: quote.changesPercentage || 0,
        marketCap: quote.marketCap
      }
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return null
    }
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
    try {
      console.log(`Fetching company profile for ${symbol} from FMP...`)
      const profiles = await this.client.company.getCompanyProfile(symbol)
      
      if (!profiles || profiles.length === 0) {
        console.log(`No profile found for ${symbol}`)
        return null
      }

      const profile = profiles[0]
      return {
        symbol: profile.symbol,
        name: profile.companyName,
        currency: profile.currency || 'USD',
        exchange: profile.exchangeShortName || 'Unknown',
        industry: profile.industry,
        sector: profile.sector,
        marketCap: profile.mktCap,
        price: profile.price
      }
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error)
      return null
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    try {
      console.log(`Searching symbols for "${query}" from FMP...`)
      const results = await this.client.company.searchCompanies(query)
      
      if (!results || results.length === 0) {
        console.log(`No search results for "${query}"`)
        return []
      }

      return results.map(result => ({
        ticker: result.symbol,
        name: result.name,
        type: 'Common Stock',
        region: 'US',
        currency: result.currency || 'USD'
      }))
    } catch (error) {
      console.error(`Error searching for "${query}":`, error)
      return []
    }
  }

  async getFinancialData(symbol: string) {
    try {
      console.log(`Fetching financial data for ${symbol} from FMP...`)
      
      // Get income statements for financial metrics
      const incomeStatements = await this.client.financialStatements.getIncomeStatements(symbol, { period: 'annual', limit: 1 })
      const balanceSheets = await this.client.financialStatements.getBalanceSheetStatements(symbol, { period: 'annual', limit: 1 })
      const cashFlows = await this.client.financialStatements.getCashFlowStatements(symbol, { period: 'annual', limit: 1 })
      const ratios = await this.client.ratios.getFinancialRatios(symbol, { period: 'annual', limit: 1 })

      if (!incomeStatements?.[0] || !balanceSheets?.[0] || !cashFlows?.[0]) {
        console.log(`Incomplete financial data for ${symbol}`)
        return null
      }

      const income = incomeStatements[0]
      const balance = balanceSheets[0]
      const cashFlow = cashFlows[0]
      const ratio = ratios?.[0]

      return {
        symbol,
        date: income.date,
        revenue: income.revenue,
        revenueGrowth: income.revenueGrowth,
        ebitda: income.ebitda,
        ebitdaMargin: income.ebitda && income.revenue ? (income.ebitda / income.revenue) * 100 : null,
        eps: income.eps,
        epsGrowth: income.epsgrowth,
        fcf: cashFlow.freeCashFlow,
        fcfMargin: cashFlow.freeCashFlow && income.revenue ? (cashFlow.freeCashFlow / income.revenue) * 100 : null,
        fcfGrowth: null, // Would need historical data to calculate
        grossMargin: income.grossProfit && income.revenue ? (income.grossProfit / income.revenue) * 100 : null,
        roic: ratio?.roic,
        debtToEbitda: balance.totalDebt && income.ebitda ? balance.totalDebt / income.ebitda : null,
        peRatio: ratio?.peRatio,
        forwardPE: null, // Would need forward earnings estimates
        shareDilution: null // Would need historical share count data
      }
    } catch (error) {
      console.error(`Error fetching financial data for ${symbol}:`, error)
      return null
    }
  }
}

export const fmpFinancialApi = new FMPFinancialApiService()