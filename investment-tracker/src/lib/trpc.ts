import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { db } from './db'
import { financialApi } from './financial-api'

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
            financialData: true,
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

  // Real-time data operations
  refreshStockPrice: publicProcedure
    .input(z.object({
      stockId: z.string(),
      ticker: z.string(),
    }))
    .mutation(async ({ input }) => {
      const quote = await financialApi.getStockQuote(input.ticker)
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
      const profile = await financialApi.getCompanyProfile(input.ticker)
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
    .mutation(async () => {
      const watchlistStocks = await db.stock.findMany({
        where: {
          watchlistItems: {
            some: {
              status: {
                in: ['WATCHING', 'OWNED']
              }
            }
          }
        }
      })

      console.log(`Found ${watchlistStocks.length} stocks to update:`, watchlistStocks.map(s => s.ticker))

      const results = []
      for (const stock of watchlistStocks) {
        try {
          console.log(`Fetching quote for ${stock.ticker}...`)
          const quote = await financialApi.getStockQuote(stock.ticker)
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
      return results
    }),
})

export type AppRouter = typeof appRouter