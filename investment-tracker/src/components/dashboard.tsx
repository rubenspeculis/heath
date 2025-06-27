'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3, Download, Home, PieChart, LineChart, List } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WatchlistTable } from './watchlist-table'
import { AddStockDialog } from './add-stock-dialog'
import { PortfolioCharts } from './portfolio-charts'
import { WatchlistAnalysis } from './watchlist-analysis'
import { InvestmentAnalysisCharts } from './investment-analysis-charts'
import { RefreshPricesButton } from './refresh-prices-button'
import { exportService } from '@/lib/export'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const { data: watchlist, isLoading: watchlistLoading } = trpc.getWatchlist.useQuery()
  const { data: stocks, isLoading: stocksLoading } = trpc.getStocks.useQuery()

  const ownedStocks = watchlist?.filter(item => item.status === 'OWNED') || []
  const watchingStocks = watchlist?.filter(item => item.status === 'WATCHING') || []
  
  const totalPortfolioValue = ownedStocks.reduce((sum, item) => {
    const value = (item.quantity || 0) * (item.stock.price || 0)
    return sum + value
  }, 0)

  const totalGainLoss = ownedStocks.reduce((sum, item) => {
    const currentValue = (item.quantity || 0) * (item.stock.price || 0)
    const costBasis = (item.quantity || 0) * (item.avgPrice || 0)
    return sum + (currentValue - costBasis)
  }, 0)

  const handleExport = (format: 'csv' | 'json' | 'summary') => {
    if (!watchlist) return
    
    const exportData = exportService.prepareExportData(watchlist)
    const timestamp = new Date().toISOString().split('T')[0]
    
    switch (format) {
      case 'csv':
        exportService.exportToCSV(exportData, `portfolio-${timestamp}.csv`)
        break
      case 'json':
        exportService.exportToJSON(exportData, `portfolio-${timestamp}.json`)
        break
      case 'summary':
        exportService.exportPortfolioSummary(exportData, `portfolio-summary-${timestamp}.txt`)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Portfolio Intelligence
                </h1>
                <p className="text-slate-600 mt-2 text-lg">Advanced investment analytics & portfolio optimization</p>
              </div>
              <div className="flex gap-3">
                <RefreshPricesButton />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white/60 border-slate-200 hover:bg-white/80 backdrop-blur-sm">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-white/20">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('summary')}>
                      Export Summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Stock
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Portfolio Value</CardTitle>
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${totalPortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {ownedStocks.length} active positions
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Gain/Loss</CardTitle>
              <div className={`p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                totalGainLoss >= 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                  : 'bg-gradient-to-r from-red-500 to-rose-600'
              }`}>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-white" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-white" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                totalGainLoss >= 0 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {totalPortfolioValue > 0 ? 
                  `${((totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100).toFixed(2)}% return` : 
                  '0.00% return'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Watchlist</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {watchingStocks.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                stocks monitored
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-white/60 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Stocks</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {stocks?.length || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                in database
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Navigation Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-xl border-white/20 shadow-xl p-1.5 rounded-2xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium"
            >
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium"
            >
              <PieChart className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium"
            >
              <LineChart className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-xl font-medium"
            >
              <List className="h-4 w-4" />
              Watchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Portfolio Overview
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Quick summary of your investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold mb-3 text-blue-900">Recent Activity</h3>
                    <p className="text-sm text-blue-700">Track your latest portfolio changes and market movements in real-time.</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <h3 className="text-lg font-semibold mb-3 text-emerald-900">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setIsAddDialogOpen(true)} 
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Add New Stock
                      </Button>
                      <RefreshPricesButton />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6 mt-8">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <PortfolioCharts data={watchlist || []} />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-8">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <InvestmentAnalysisCharts data={watchlist || []} />
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6 mt-8">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <WatchlistAnalysis data={watchlist || []} />
            </div>
            
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-red-900 bg-clip-text text-transparent">
                  Portfolio & Watchlist
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Monitor your owned positions and stocks on your watchlist
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <WatchlistTable 
                  data={watchlist || []} 
                  isLoading={watchlistLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Stock Dialog */}
        <AddStockDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </div>
  )
}