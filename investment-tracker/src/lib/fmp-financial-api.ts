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

  private normalizeSymbol(symbol: string): string {
    // Remove common foreign exchange suffixes that FMP might not support
    // FMP primarily supports US markets
    return symbol.replace(/\.(ST|HK|L|WA|TO|V|DE|PA|MI)$/i, '')
  }

  constructor() {
    const apiKey = process.env.FMP_API_KEY
    if (!apiKey) {
      console.warn('FMP_API_KEY not found in environment variables')
    }

    this.client = new FMPApiClient({
      apiKey: apiKey || 'demo',
      baseUrl: 'https://financialmodelingprep.com/api/v3',
      timeout: 10000,
      rateLimit: {
        requestsPerMinute: 300,
        burstSize: 10
      }
    })
  }

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const normalizedSymbol = this.normalizeSymbol(symbol)
      console.log(`Fetching quote for ${symbol} (normalized: ${normalizedSymbol}) from FMP...`)
      const quotes = await this.client.quotes.getRealTimeQuote(normalizedSymbol) as unknown as any[]
      
      if (!quotes || !Array.isArray(quotes) || quotes.length === 0) {
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
      const normalizedSymbol = this.normalizeSymbol(symbol)
      console.log(`Fetching company profile for ${symbol} (normalized: ${normalizedSymbol}) from FMP...`)
      const profile = await this.client.companies.getProfile(normalizedSymbol)
      
      if (!profile) {
        console.log(`No profile found for ${symbol}`)
        return null
      }

      return {
        symbol: profile.symbol,
        name: profile.companyName,
        currency: profile.currency || 'USD',
        exchange: profile.exchangeShortName || 'Unknown',
        industry: profile.industry,
        sector: profile.sector,
        marketCap: typeof profile.mktCap === 'number' ? profile.mktCap : undefined,
        price: typeof profile.price === 'number' ? profile.price : undefined
      }
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error)
      return null
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    try {
      console.log(`Searching symbols for "${query}" from FMP...`)
      const results = await this.client.companies.searchCompanies(query, { limit: 10 })
      
      if (!results || results.length === 0) {
        console.log(`No search results for "${query}"`)
        return []
      }

      return results.map((result) => ({
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
      const normalizedSymbol = this.normalizeSymbol(symbol)
      console.log(`Fetching financial data for ${symbol} (normalized: ${normalizedSymbol}) from FMP...`)
      
      // Get income statements for financial metrics (current + previous year for growth calculation)
      const incomeStatements = await this.client.financialStatements.getIncomeStatements(normalizedSymbol, { period: 'annual', limit: 2 })
      const balanceSheets = await this.client.financialStatements.getBalanceSheetStatements(normalizedSymbol, { period: 'annual', limit: 1 })
      const cashFlows = await this.client.financialStatements.getCashFlowStatements(normalizedSymbol, { period: 'annual', limit: 2 })
      const ratios = await this.client.ratios.getFinancialRatios(normalizedSymbol, { period: 'annual', limit: 1 })

      if (!incomeStatements?.[0] || !balanceSheets?.[0] || !cashFlows?.[0]) {
        console.log(`Incomplete financial data for ${symbol}`)
        return null
      }

      const income = incomeStatements[0]
      const previousIncome = incomeStatements[1]
      const balance = balanceSheets[0]
      const cashFlow = cashFlows[0]
      const previousCashFlow = cashFlows[1]
      const ratio = ratios?.[0]

      // Calculate growth rates (as decimals, not percentages)
      const revenueGrowth = income.revenue && previousIncome?.revenue 
        ? (income.revenue - previousIncome.revenue) / previousIncome.revenue 
        : null

      const epsGrowth = income.eps && previousIncome?.eps 
        ? (income.eps - previousIncome.eps) / previousIncome.eps 
        : null

      const fcfGrowth = cashFlow.freeCashFlow && previousCashFlow?.freeCashFlow 
        ? (cashFlow.freeCashFlow - previousCashFlow.freeCashFlow) / previousCashFlow.freeCashFlow 
        : null

      console.log(`Growth rates for ${symbol}:`, {
        revenueGrowth: revenueGrowth ? `${(revenueGrowth * 100).toFixed(1)}%` : 'N/A',
        epsGrowth: epsGrowth ? `${(epsGrowth * 100).toFixed(1)}%` : 'N/A',
        fcfGrowth: fcfGrowth ? `${(fcfGrowth * 100).toFixed(1)}%` : 'N/A',
      })

      return {
        symbol,
        date: income.date,
        revenue: income.revenue,
        revenueGrowth,
        ebitda: income.ebitda,
        ebitdaMargin: income.ebitda && income.revenue ? (income.ebitda / income.revenue) : null,
        eps: income.eps,
        epsGrowth,
        fcf: cashFlow.freeCashFlow,
        fcfMargin: cashFlow.freeCashFlow && income.revenue ? (cashFlow.freeCashFlow / income.revenue) : null,
        fcfGrowth,
        grossMargin: income.grossProfit && income.revenue ? (income.grossProfit / income.revenue) : null,
        roic: (ratio as any)?.roic ? (ratio as any).roic / 100 : null, // Convert percentage to decimal
        debtToEbitda: balance.totalDebt && income.ebitda ? balance.totalDebt / income.ebitda : null,
        peRatio: (ratio as any)?.peRatio,
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