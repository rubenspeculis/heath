import { useState, useEffect } from 'react'
import { X, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface StockDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockId: string
  ticker: string
}

export function StockDetailDialog({ open, onOpenChange, stockId, ticker }: StockDetailDialogProps) {
  const [isEnriching, setIsEnriching] = useState(false)
  
  const { data: stocks } = trpc.getStocks.useQuery()
  const enrichStockData = trpc.enrichStockData.useMutation({
    onSuccess: () => {
      setIsEnriching(false)
    },
    onError: () => {
      setIsEnriching(false)
    }
  })

  const stock = stocks?.find(s => s.id === stockId)
  const financialData = stock?.financialData?.[0]

  const formatCurrency = (amount: number | null | undefined, currency = 'USD') => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatLargeNumber = (num: number | null | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return `${(value * 100).toFixed(1)}%`
  }

  const handleEnrichData = () => {
    setIsEnriching(true)
    enrichStockData.mutate({ stockId, ticker })
  }

  if (!stock) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-black border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            <div>
              <span className="text-blue-400">{stock.ticker}</span>
              <span className="text-white/80 ml-2">{stock.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-600 p-4">
              <div className="text-sm text-slate-400">Current Price</div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(stock.price, stock.currency)}
              </div>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-600 p-4">
              <div className="text-sm text-slate-400">Market Cap</div>
              <div className="text-xl font-bold text-white">
                {formatLargeNumber(stock.marketCap)}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600 p-4">
              <div className="text-sm text-slate-400">Exchange</div>
              <div className="text-lg font-semibold text-white">
                {stock.exchange || 'N/A'}
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600 p-4">
              <div className="text-sm text-slate-400">Sector</div>
              <div className="text-lg font-semibold text-white">
                {stock.sector || 'N/A'}
              </div>
            </Card>
          </div>

          {/* Company Info */}
          <Card className="bg-slate-800/50 border-slate-600 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-400" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">Industry:</span>
                <span className="text-white ml-2">{stock.industry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400">Currency:</span>
                <span className="text-white ml-2">{stock.currency}</span>
              </div>
              <div className="md:col-span-2">
                <Button
                  onClick={handleEnrichData}
                  disabled={isEnriching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEnriching ? 'Enriching...' : 'Refresh Company Data'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Financial Metrics */}
          {financialData && (
            <Card className="bg-slate-800/50 border-slate-600 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Financial Metrics
              </h3>
              
              {/* Growth Metrics */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-400 mb-3">Growth Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Revenue Growth</div>
                    <div className="text-lg font-bold text-white flex items-center gap-1">
                      {financialData.revenueGrowth ? (
                        <>
                          {financialData.revenueGrowth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={financialData.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercentage(financialData.revenueGrowth)}
                          </span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">EPS Growth</div>
                    <div className="text-lg font-bold text-white flex items-center gap-1">
                      {financialData.epsGrowth ? (
                        <>
                          {financialData.epsGrowth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={financialData.epsGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercentage(financialData.epsGrowth)}
                          </span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">FCF Growth</div>
                    <div className="text-lg font-bold text-white flex items-center gap-1">
                      {financialData.fcfGrowth ? (
                        <>
                          {financialData.fcfGrowth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={financialData.fcfGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercentage(financialData.fcfGrowth)}
                          </span>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Metrics */}
              <div>
                <h4 className="text-md font-semibold text-blue-400 mb-3">Quality Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Gross Margin</div>
                    <div className="text-lg font-bold text-white">
                      {formatPercentage(financialData.grossMargin)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">ROIC</div>
                    <div className="text-lg font-bold text-white">
                      {formatPercentage(financialData.roic)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">FCF Margin</div>
                    <div className="text-lg font-bold text-white">
                      {formatPercentage(financialData.fcfMargin)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Debt/EBITDA</div>
                    <div className="text-lg font-bold text-white">
                      {financialData.debtToEbitda ? financialData.debtToEbitda.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Data */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-yellow-400 mb-3">Financial Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Revenue</div>
                    <div className="text-lg font-bold text-white">
                      {formatLargeNumber(financialData.revenue)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">EBITDA</div>
                    <div className="text-lg font-bold text-white">
                      {formatLargeNumber(financialData.ebitda)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">Free Cash Flow</div>
                    <div className="text-lg font-bold text-white">
                      {formatLargeNumber(financialData.fcf)}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">EPS</div>
                    <div className="text-lg font-bold text-white">
                      {financialData.eps ? `$${financialData.eps.toFixed(2)}` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-400">P/E Ratio</div>
                    <div className="text-lg font-bold text-white">
                      {financialData.peRatio ? financialData.peRatio.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {financialData.dataDate && (
                <div className="mt-4 text-sm text-slate-400">
                  Data as of: {new Date(financialData.dataDate).toLocaleDateString()}
                </div>
              )}
            </Card>
          )}

          {!financialData && (
            <Card className="bg-slate-800/50 border-slate-600 p-6">
              <div className="text-center text-slate-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                <p>No financial data available for this stock.</p>
                <p className="text-sm mt-2">Financial data will be populated when you refresh financial data.</p>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}