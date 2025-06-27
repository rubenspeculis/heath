import axios from 'axios'
import { db } from './db'

interface AlphaVantageQuote {
  '01. symbol': string
  '02. open': string
  '03. high': string
  '04. low': string
  '05. price': string
  '06. volume': string
  '07. latest trading day': string
  '08. previous close': string
  '09. change': string
  '10. change percent': string
}

interface AlphaVantageResponse {
  'Global Quote': AlphaVantageQuote
}

interface FMPProfile {
  symbol: string
  companyName: string
  currency: string
  exchangeShortName: string
  industry: string
  sector: string
  mktCap: number
  price: number
}

interface FMPFinancials {
  symbol: string
  date: string
  revenue: number
  grossProfit: number
  grossProfitRatio: number
  netIncome: number
  eps: number
  operatingCashFlow: number
  freeCashFlow: number
  totalDebt: number
  totalEquity: number
  ebitda: number
}

export class FinancialApiService {
  private alphaVantageKey?: string
  private fmpKey?: string

  constructor() {
    this.initializeKeys()
  }

  private initializeKeys() {
    // Load API keys from environment variables
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY
    this.fmpKey = process.env.FMP_API_KEY
    
    console.log('Initializing API keys from environment:')
    console.log(`Alpha Vantage key: ${this.alphaVantageKey ? 'Found' : 'Not found'}`)
    console.log(`FMP key: ${this.fmpKey ? 'Found' : 'Not found'}`)
  }

  async getStockQuote(ticker: string): Promise<{ price: number; marketCap?: number } | null> {
    try {
      console.log(`Attempting to fetch quote for ${ticker}`)
      console.log(`Alpha Vantage key available: ${!!this.alphaVantageKey}`)
      console.log(`FMP key available: ${!!this.fmpKey}`)
      
      if (this.fmpKey) {
        // Prefer FMP as it provides both price and market cap
        return await this.getFMPQuote(ticker)
      } else if (this.alphaVantageKey) {
        return await this.getAlphaVantageQuote(ticker)
      }
      throw new Error('No API keys configured')
    } catch (error) {
      console.error(`Error fetching quote for ${ticker}:`, error)
      return null
    }
  }

  private async getAlphaVantageQuote(ticker: string) {
    console.log(`Calling Alpha Vantage API for ${ticker}`)
    const response = await axios.get<AlphaVantageResponse>(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: this.alphaVantageKey,
        },
      }
    )

    console.log(`Alpha Vantage response for ${ticker}:`, response.data)
    const quote = response.data['Global Quote']
    if (!quote) {
      console.log(`No quote data found in Alpha Vantage response for ${ticker}`)
      return null
    }

    const price = parseFloat(quote['05. price'])
    console.log(`Parsed price for ${ticker}: ${price}`)
    
    return {
      price,
    }
  }

  private async getFMPQuote(ticker: string) {
    console.log(`Calling FMP API for ${ticker}`)
    const response = await axios.get<FMPProfile[]>(
      `https://financialmodelingprep.com/api/v3/profile/${ticker}`,
      {
        params: {
          apikey: this.fmpKey,
        },
      }
    )

    console.log(`FMP response for ${ticker}:`, response.data)
    const profile = response.data[0]
    if (!profile) {
      console.log(`No profile data found in FMP response for ${ticker}`)
      return null
    }

    console.log(`Parsed data for ${ticker} - Price: ${profile.price}, Market Cap: ${profile.mktCap}`)
    
    return {
      price: profile.price,
      marketCap: profile.mktCap,
    }
  }

  async getCompanyProfile(ticker: string) {
    try {
      if (!this.fmpKey) {
        throw new Error('FMP API key not configured')
      }

      const response = await axios.get<FMPProfile[]>(
        `https://financialmodelingprep.com/api/v3/profile/${ticker}`,
        {
          params: {
            apikey: this.fmpKey,
          },
        }
      )

      const profile = response.data[0]
      if (!profile) return null

      return {
        name: profile.companyName,
        currency: profile.currency,
        exchange: profile.exchangeShortName,
        industry: profile.industry,
        sector: profile.sector,
        marketCap: profile.mktCap,
        price: profile.price,
      }
    } catch (error) {
      console.error(`Error fetching profile for ${ticker}:`, error)
      return null
    }
  }

  async getFinancialData(ticker: string, period: 'annual' | 'quarter' = 'annual') {
    try {
      if (!this.fmpKey) {
        throw new Error('FMP API key not configured')
      }

      const response = await axios.get<FMPFinancials[]>(
        `https://financialmodelingprep.com/api/v3/income-statement/${ticker}`,
        {
          params: {
            period,
            limit: 5,
            apikey: this.fmpKey,
          },
        }
      )

      return response.data.map(data => ({
        date: data.date,
        revenue: data.revenue,
        grossMargin: data.grossProfitRatio,
        netIncome: data.netIncome,
        eps: data.eps,
        ebitda: data.ebitda,
      }))
    } catch (error) {
      console.error(`Error fetching financial data for ${ticker}:`, error)
      return null
    }
  }

  async searchTicker(query: string) {
    try {
      if (this.alphaVantageKey) {
        return await this.searchAlphaVantage(query)
      } else if (this.fmpKey) {
        return await this.searchFMP(query)
      }
      throw new Error('No API keys configured')
    } catch (error) {
      console.error('Error searching ticker:', error)
      return []
    }
  }

  private async searchAlphaVantage(query: string) {
    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: this.alphaVantageKey,
        },
      }
    )

    return response.data.bestMatches?.map((match: any) => ({
      ticker: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
    })) || []
  }

  private async searchFMP(query: string) {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/search`,
      {
        params: {
          query,
          limit: 10,
          apikey: this.fmpKey,
        },
      }
    )

    return response.data.map((result: any) => ({
      ticker: result.symbol,
      name: result.name,
      currency: result.currency,
      exchange: result.exchangeShortName,
    }))
  }

  async updateStockPrice(stockId: string, ticker: string) {
    const quote = await this.getStockQuote(ticker)
    if (quote) {
      await db.stock.update({
        where: { id: stockId },
        data: {
          price: quote.price,
          marketCap: quote.marketCap,
          updatedAt: new Date(),
        },
      })
    }
    return quote
  }
}

export const financialApi = new FinancialApiService()