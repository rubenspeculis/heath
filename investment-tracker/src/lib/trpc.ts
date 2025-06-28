import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { db } from './db'
import { fmpFinancialApi } from './fmp-financial-api'
import { shouldRefreshPriceData, shouldRefreshFinancialData, getUpdateSummary } from './cache-utils'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  // Stock operations
  getStocks: publicProcedure.query(async () => {
    return await db.stock.findMany({
      include: {
        watchlistItems: true,
        financialData: true,
      },
      orderBy: { ticker: 'asc' },
    })
  }),

  addStock: publicProcedure
    .input(z.object({
      ticker: z.string().min(1).max(10),
      name: z.string().min(1),
      currency: z.string().default('USD'),
      sector: z.string().optional(),
      exchange: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.stock.create({
        data: input,
      })
    }),

  // Watchlist operations
  getWatchlist: publicProcedure.query(async () => {
    return await db.watchlistItem.findMany({
      include: {
        stock: {
          include: {
            financialData: {
              where: { period: 'annual' },
              orderBy: { updatedAt: 'desc' },
              take: 1
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  addToWatchlist: publicProcedure
    .input(z.object({
      stockId: z.string(),
      status: z.enum(['WATCHING', 'OWNED', 'SOLD']).default('WATCHING'),
      quantity: z.number().optional(),
      avgPrice: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.watchlistItem.create({
        data: input,
      })
    }),

  updateWatchlistItem: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['WATCHING', 'OWNED', 'SOLD']).optional(),
      quantity: z.number().optional(),
      avgPrice: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      return await db.watchlistItem.update({
        where: { id },
        data: updateData,
      })
    }),

  updateStock: publicProcedure
    .input(z.object({
      id: z.string(),
      ticker: z.string().optional(),
      name: z.string().optional(),
      currency: z.string().optional(),
      sector: z.string().optional(),
      exchange: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      return await db.stock.update({
        where: { id },
        data: updateData,
      })
    }),

  removeFromWatchlist: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await db.watchlistItem.delete({
        where: { id: input.id },
      })
    }),

  // Financial data operations
  updateFinancialData: publicProcedure
    .input(z.object({
      stockId: z.string(),
      period: z.string(),
      data: z.object({
        revenue: z.number().optional(),
        revenueGrowth: z.number().optional(),
        ebitda: z.number().optional(),
        ebitdaMargin: z.number().optional(),
        eps: z.number().optional(),
        epsGrowth: z.number().optional(),
        fcf: z.number().optional(),
        fcfMargin: z.number().optional(),
        fcfGrowth: z.number().optional(),
        grossMargin: z.number().optional(),
        roic: z.number().optional(),
        debtToEbitda: z.number().optional(),
        peRatio: z.number().optional(),
        forwardPE: z.number().optional(),
        shareDilution: z.number().optional(),
        dataDate: z.date(),
      }),
    }))
    .mutation(async ({ input }) => {
      // Find existing record first
      const existing = await db.financialData.findFirst({
        where: {
          stockId: input.stockId,
          period: input.period,
        },
      })

      if (existing) {
        return await db.financialData.update({
          where: { id: existing.id },
          data: input.data,
        })
      } else {
        return await db.financialData.create({
          data: {
            stockId: input.stockId,
            period: input.period,
            ...input.data,
          },
        })
      }
    }),

  // Metric weights operations
  getMetricWeights: publicProcedure.query(async () => {
    return await db.metricWeight.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { metricName: 'asc' }],
    })
  }),

  updateMetricWeight: publicProcedure
    .input(z.object({
      category: z.string(),
      metricName: z.string(),
      weight: z.number().min(0).max(1),
    }))
    .mutation(async ({ input }) => {
      return await db.metricWeight.upsert({
        where: { 
          category_metricName: { 
            category: input.category, 
            metricName: input.metricName 
          } 
        },
        update: { weight: input.weight },
        create: input,
      })
    }),

  // Search operations
  searchSymbols: publicProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return await fmpFinancialApi.searchSymbols(input.query)
    }),

  // Real-time data operations
  refreshStockPrice: publicProcedure
    .input(z.object({
      stockId: z.string(),
      ticker: z.string(),
    }))
    .mutation(async ({ input }) => {
      const quote = await fmpFinancialApi.getStockQuote(input.ticker)
      if (quote) {
        return await db.stock.update({
          where: { id: input.stockId },
          data: {
            price: quote.price,
            marketCap: quote.marketCap,
            updatedAt: new Date(),
          },
        })
      }
      return null
    }),

  enrichStockData: publicProcedure
    .input(z.object({
      stockId: z.string(),
      ticker: z.string(),
    }))
    .mutation(async ({ input }) => {
      const profile = await fmpFinancialApi.getCompanyProfile(input.ticker)
      if (profile) {
        return await db.stock.update({
          where: { id: input.stockId },
          data: {
            name: profile.name,
            currency: profile.currency,
            exchange: profile.exchange,
            industry: profile.industry,
            sector: profile.sector,
            marketCap: profile.marketCap,
            price: profile.price,
            updatedAt: new Date(),
          },
        })
      }
      return null
    }),

  refreshAllWatchlistPrices: publicProcedure
    .input(z.object({
      forceRefresh: z.boolean().default(false)
    }).optional().default({}))
    .mutation(async ({ input = {} }) => {
      const { forceRefresh = false } = input

      const watchlistStocks = await db.stock.findMany({
        where: {
          watchlistItems: {
            some: {
              status: {
                in: ['WATCHING', 'OWNED']
              }
            }
          }
        },
        select: {
          id: true,
          ticker: true,
          price: true,
          marketCap: true,
          updatedAt: true
        }
      })

      console.log(`Found ${watchlistStocks.length} stocks in watchlist`)

      // Filter stocks that need price updates based on cache rules
      const stocksNeedingUpdate = forceRefresh 
        ? watchlistStocks 
        : watchlistStocks.filter(stock => shouldRefreshPriceData(stock.updatedAt))

      const summary = getUpdateSummary(watchlistStocks, 'price')
      
      console.log(`Price cache summary:`, {
        total: summary.total,
        needsUpdate: summary.needsUpdate,
        fresh: summary.fresh,
        forceRefresh,
        stocksToUpdate: stocksNeedingUpdate.map(s => s.ticker)
      })

      if (stocksNeedingUpdate.length === 0 && !forceRefresh) {
        console.log('All price data is fresh, skipping API calls')
        return {
          updated: [],
          skipped: watchlistStocks.length,
          totalStocks: watchlistStocks.length,
          message: 'All price data is already fresh (updated within 2 hours)'
        }
      }

      const results = []
      const skipped = []

      for (const stock of stocksNeedingUpdate) {
        try {
          console.log(`Fetching quote for ${stock.ticker}...`)
          const quote = await fmpFinancialApi.getStockQuote(stock.ticker)
          console.log(`Quote for ${stock.ticker}:`, quote)
          
          if (quote) {
            const updated = await db.stock.update({
              where: { id: stock.id },
              data: {
                price: quote.price,
                marketCap: quote.marketCap,
                updatedAt: new Date(),
              },
            })
            results.push(updated)
            console.log(`Updated ${stock.ticker} with price: ${quote.price}`)
          }
        } catch (error) {
          console.error(`Error updating ${stock.ticker}:`, error)
        }
      }

      // Track skipped stocks for reporting
      const updatedTickers = results.map(r => r.ticker)
      skipped.push(...watchlistStocks.filter(s => !updatedTickers.includes(s.ticker)))

      return {
        updated: results,
        skipped: skipped.length,
        totalStocks: watchlistStocks.length,
        message: forceRefresh 
          ? `Force refreshed ${results.length} stocks`
          : `Smart refresh: Updated ${results.length} stale stocks, ${skipped.length} were already fresh`
      }
    }),

  refreshAllFinancialData: publicProcedure
    .input(z.object({
      forceRefresh: z.boolean().default(false)
    }).optional().default({}))
    .mutation(async ({ input = {} }) => {
      const { forceRefresh = false } = input

      const watchlistStocks = await db.stock.findMany({
        where: {
          watchlistItems: {
            some: {
              status: {
                in: ['WATCHING', 'OWNED']
              }
            }
          }
        },
        include: {
          financialData: {
            where: { period: 'annual' },
            orderBy: { updatedAt: 'desc' },
            take: 1
          }
        }
      })

      console.log(`Found ${watchlistStocks.length} stocks in watchlist`)

      // Filter stocks that need financial data updates based on cache rules
      const stocksNeedingUpdate = forceRefresh 
        ? watchlistStocks 
        : watchlistStocks.filter(stock => {
            const latestFinancialData = stock.financialData[0]
            return shouldRefreshFinancialData(latestFinancialData?.updatedAt)
          })

      const summary = getUpdateSummary(watchlistStocks, 'financial')
      
      console.log(`Financial data cache summary:`, {
        total: summary.total,
        needsUpdate: summary.needsUpdate,
        fresh: summary.fresh,
        forceRefresh,
        stocksToUpdate: stocksNeedingUpdate.map(s => s.ticker)
      })

      if (stocksNeedingUpdate.length === 0 && !forceRefresh) {
        console.log('All financial data is fresh, skipping API calls')
        return {
          updated: [],
          skipped: watchlistStocks.length,
          totalStocks: watchlistStocks.length,
          message: 'All financial data is already fresh (updated within 12 hours)'
        }
      }

      const results = []
      const skipped = []

      for (const stock of stocksNeedingUpdate) {
        try {
          console.log(`Fetching financial data for ${stock.ticker}...`)
          const financialData = await fmpFinancialApi.getFinancialData(stock.ticker)
          console.log(`Financial data for ${stock.ticker}:`, financialData)
          
          if (financialData) {
            // Find existing record first
            const existing = await db.financialData.findFirst({
              where: {
                stockId: stock.id,
                period: 'annual',
              },
            })

            const financialRecord = {
              stockId: stock.id,
              period: 'annual',
              revenue: financialData.revenue,
              revenueGrowth: financialData.revenueGrowth,
              ebitda: financialData.ebitda,
              ebitdaMargin: financialData.ebitdaMargin,
              eps: financialData.eps,
              epsGrowth: financialData.epsGrowth,
              fcf: financialData.fcf,
              fcfMargin: financialData.fcfMargin,
              fcfGrowth: financialData.fcfGrowth,
              grossMargin: financialData.grossMargin,
              roic: financialData.roic,
              debtToEbitda: financialData.debtToEbitda,
              peRatio: financialData.peRatio,
              forwardPE: financialData.forwardPE,
              shareDilution: financialData.shareDilution,
              dataDate: new Date(financialData.date || new Date()),
            }

            if (existing) {
              const updated = await db.financialData.update({
                where: { id: existing.id },
                data: financialRecord,
              })
              results.push({ stock: stock.ticker, financial: updated })
            } else {
              const created = await db.financialData.create({
                data: financialRecord,
              })
              results.push({ stock: stock.ticker, financial: created })
            }
            console.log(`Updated financial data for ${stock.ticker}`)
          }
        } catch (error) {
          console.error(`Error fetching financial data for ${stock.ticker}:`, error)
        }
      }

      // Track skipped stocks for reporting
      const updatedTickers = results.map(r => r.stock)
      skipped.push(...watchlistStocks.filter(s => !updatedTickers.includes(s.ticker)))

      return {
        updated: results,
        skipped: skipped.length,
        totalStocks: watchlistStocks.length,
        message: forceRefresh 
          ? `Force refreshed ${results.length} stocks`
          : `Smart refresh: Updated ${results.length} stale stocks, ${skipped.length} were already fresh`
      }
    }),

  enrichAllStockData: publicProcedure
    .mutation(async () => {
      const stocks = await db.stock.findMany({
        where: {
          OR: [
            { sector: null },
            { exchange: null },
            { industry: null },
            { marketCap: null }
          ]
        }
      })

      console.log(`Found ${stocks.length} stocks missing data to enrich:`, stocks.map((s: any) => s.ticker))

      const results = []
      for (const stock of stocks) {
        try {
          console.log(`Enriching data for ${stock.ticker}...`)
          const profile = await fmpFinancialApi.getCompanyProfile(stock.ticker)
          
          if (profile) {
            const updated = await db.stock.update({
              where: { id: stock.id },
              data: {
                name: profile.name || stock.name,
                currency: profile.currency || stock.currency,
                exchange: profile.exchange || stock.exchange,
                industry: profile.industry || stock.industry,
                sector: profile.sector || stock.sector,
                marketCap: profile.marketCap || stock.marketCap,
                price: profile.price || stock.price,
                updatedAt: new Date(),
              },
            })
            results.push(updated)
            console.log(`Enriched ${stock.ticker} with sector: ${profile.sector}, exchange: ${profile.exchange}`)
          }
        } catch (error) {
          console.error(`Error enriching data for ${stock.ticker}:`, error)
        }
      }
      return results
    }),
})

export type AppRouter = typeof appRouter