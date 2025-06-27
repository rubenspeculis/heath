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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Watchlist Analysis
          </CardTitle>
          <CardDescription>
            Analyze your watchlist stocks to identify investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No stocks in your watchlist to analyze.</p>
          <p className="text-sm text-gray-400 mt-1">Add some stocks to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlist Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{watchlistStats.totalStocks}</div>
            <p className="text-xs text-muted-foreground">
              stocks being monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sector Diversity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{watchlistStats.sectors}</div>
            <p className="text-xs text-muted-foreground">
              different sectors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNaN(watchlistStats.averagePrice) ? '-' : formatCurrency(watchlistStats.averagePrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              per share average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {watchlistStats.totalMarketCap > 0 ? formatMarketCap(watchlistStats.totalMarketCap) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              combined value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Watchlist Analysis
          </CardTitle>
          <CardDescription>
            Filter and sort your watchlist to identify the best opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ticker">Ticker</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter:</label>
              <Select value={filterSector} onValueChange={handleSectorChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              <h4 className="text-sm font-medium mb-2">Sector Distribution:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(sectorDistribution).map(([sector, count]) => (
                  <Badge key={sector} variant="outline" className="text-xs">
                    {sector}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Table */}
      <Card>
        <CardHeader>
          <CardTitle>Watchlist Stocks</CardTitle>
          <CardDescription>
            Detailed analysis of stocks you're monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Cap Category</TableHead>
                  <TableHead>Price Level</TableHead>
                  <TableHead>Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.stock.ticker}</div>
                        <div className="text-sm text-gray-600 truncate max-w-[200px]">
                          {item.stock.name}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.price ? (
                        <div className="font-medium">
                          {formatCurrency(item.stock.price, item.stock.currency)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.marketCap ? (
                        <div className="font-medium">
                          {formatMarketCap(item.stock.marketCap)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.marketCap ? (
                        <Badge variant="outline" className="text-xs">
                          {getMarketCapCategory(item.stock.marketCap)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.price ? (
                        <Badge 
                          variant={getPriceLevel(item.stock.price) === 'High' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {getPriceLevel(item.stock.price)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {item.stock.sector ? (
                        <Badge variant="outline" className="text-xs">
                          {item.stock.sector}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Unknown</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {filteredData.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 border-t">
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} watchlist stocks
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
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
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
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
                  className="flex items-center gap-1"
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