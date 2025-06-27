'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Target, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { scoringEngine } from '@/lib/scoring'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface WatchlistAnalysisProps {
  data: Array<{
    id: string
    status: string
    stock: {
      id: string
      ticker: string
      name: string
      price?: number | null
      currency: string
      sector?: string | null
      marketCap?: number | null
    }
  }>
}

export function WatchlistAnalysis({ data }: WatchlistAnalysisProps) {
  const [sortBy, setSortBy] = useState<'ticker' | 'sector' | 'price' | 'marketCap'>('ticker')
  const [filterSector, setFilterSector] = useState<string>('all')
  const [analysisData, setAnalysisData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Get unique sectors for filtering
  const sectors = Array.from(new Set(data.map(item => item.stock.sector).filter(Boolean)))

  // Reset to page 1 when filters change
  const handleSortChange = (newSortBy: any) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handleSectorChange = (newSector: string) => {
    setFilterSector(newSector)
    setCurrentPage(1)
  }

  // Filter and sort watchlist data
  const filteredData = data
    .filter(item => item.status === 'WATCHING') // Focus on watchlist items
    .filter(item => filterSector === 'all' || item.stock.sector === filterSector)
    .sort((a, b) => {
      switch (sortBy) {
        case 'ticker':
          return a.stock.ticker.localeCompare(b.stock.ticker)
        case 'sector':
          return (a.stock.sector || '').localeCompare(b.stock.sector || '')
        case 'price':
          return (b.stock.price || 0) - (a.stock.price || 0)
        case 'marketCap':
          return (b.stock.marketCap || 0) - (a.stock.marketCap || 0)
        default:
          return 0
      }
    })

  // Calculate watchlist statistics
  const watchlistStats = {
    totalStocks: filteredData.length,
    sectors: sectors.length,
    averagePrice: filteredData.reduce((sum, item) => sum + (item.stock.price || 0), 0) / filteredData.length,
    totalMarketCap: filteredData.reduce((sum, item) => sum + (item.stock.marketCap || 0), 0),
    priceRange: {
      min: Math.min(...filteredData.map(item => item.stock.price || 0).filter(p => p > 0)),
      max: Math.max(...filteredData.map(item => item.stock.price || 0)),
    }
  }

  // Sector distribution for analysis
  const sectorDistribution = filteredData.reduce((acc, item) => {
    const sector = item.stock.sector || 'Unknown'
    acc[sector] = (acc[sector] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      notation: amount > 1000000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const getMarketCapCategory = (marketCap: number) => {
    if (marketCap >= 200e9) return 'Mega Cap'
    if (marketCap >= 10e9) return 'Large Cap'
    if (marketCap >= 2e9) return 'Mid Cap'
    if (marketCap >= 300e6) return 'Small Cap'
    return 'Micro Cap'
  }

  const getPriceLevel = (price: number) => {
    if (price >= 500) return 'High'
    if (price >= 100) return 'Medium'
    if (price >= 20) return 'Low'
    return 'Penny'
  }

  if (filteredData.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5" />
            Watchlist Analysis
          </CardTitle>
          <CardDescription className="text-white/70">
            Analyze your watchlist stocks to identify investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-white/60">No stocks in your watchlist to analyze.</p>
          <p className="text-sm text-white/40 mt-1">Add some stocks to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Watchlist Size</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-blue-100">{watchlistStats.totalStocks}</div>
            <p className="text-xs text-blue-200/70">
              stocks being monitored
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-200">Sector Diversity</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-emerald-100">{watchlistStats.sectors}</div>
            <p className="text-xs text-emerald-200/70">
              different sectors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Avg Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-purple-100">
              {isNaN(watchlistStats.averagePrice) ? '-' : formatCurrency(watchlistStats.averagePrice)}
            </div>
            <p className="text-xs text-purple-200/70">
              per share average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/5"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Total Market Cap</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-orange-100">
              {watchlistStats.totalMarketCap > 0 ? formatMarketCap(watchlistStats.totalMarketCap) : '-'}
            </div>
            <p className="text-xs text-orange-200/70">
              combined value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-600/5"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-slate-400" />
            Watchlist Analysis
          </CardTitle>
          <CardDescription className="text-white/70">
            Filter and sort your watchlist to identify the best opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white/90">Sort by:</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="ticker">Ticker</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white/90">Filter:</label>
              <Select value={filterSector} onValueChange={handleSectorChange}>
                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sector Distribution */}
          {Object.keys(sectorDistribution).length > 1 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-white/90">Sector Distribution:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(sectorDistribution).map(([sector, count]) => (
                  <Badge key={sector} variant="outline" className="text-xs bg-white/5 border-white/20 text-white/80">
                    {sector}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Table */}
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5"></div>
        <CardHeader className="relative">
          <CardTitle className="text-white">Watchlist Stocks</CardTitle>
          <CardDescription className="text-white/70">
            Detailed analysis of stocks you're monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/90 font-bold">Stock</TableHead>
                  <TableHead className="text-white/90 font-bold">Price</TableHead>
                  <TableHead className="text-white/90 font-bold">Market Cap</TableHead>
                  <TableHead className="text-white/90 font-bold">Cap Category</TableHead>
                  <TableHead className="text-white/90 font-bold">Price Level</TableHead>
                  <TableHead className="text-white/90 font-bold">Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                  <TableRow key={item.id} className="hover:bg-white/5 border-white/10 transition-colors duration-300 group">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-200 transition-colors">{item.stock.ticker}</div>
                        <div className="text-sm text-white/60 truncate max-w-[200px] group-hover:text-white/80 transition-colors">
                          {item.stock.name}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.price ? (
                        <div className="font-medium text-white/90">
                          {formatCurrency(item.stock.price, item.stock.currency)}
                        </div>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.marketCap ? (
                        <div className="font-medium text-white/90">
                          {formatMarketCap(item.stock.marketCap)}
                        </div>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.marketCap ? (
                        <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/80">
                          {getMarketCapCategory(item.stock.marketCap)}
                        </Badge>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.price ? (
                        <Badge 
                          className={`text-xs ${
                            getPriceLevel(item.stock.price) === 'High' 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                              : 'bg-white/5 border-white/20 text-white/80'
                          }`}
                        >
                          {getPriceLevel(item.stock.price)}
                        </Badge>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.sector ? (
                        <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/80">
                          {item.stock.sector}
                        </Badge>
                      ) : (
                        <span className="text-white/40">Unknown</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Sexy Dark Pagination Controls */}
          {filteredData.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="text-sm text-white/80">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} watchlist stocks
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = Math.ceil(filteredData.length / itemsPerPage)
                      if (totalPages <= 7) return true
                      if (page === 1 || page === totalPages) return true
                      if (Math.abs(page - currentPage) <= 1) return true
                      return false
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-white/40">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                              : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                          }`}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => 
                    Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage))
                  )}
                  disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                  className="flex items-center gap-1 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}