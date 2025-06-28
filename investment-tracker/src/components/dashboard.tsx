
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
import { RefreshAllDataButton } from './refresh-prices-button'
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
  const { data: stocks } = trpc.getStocks.useQuery()

  const ownedStocks = watchlist?.filter((item: any) => item.status === 'OWNED') || []
  const watchingStocks = watchlist?.filter((item: any) => item.status === 'WATCHING') || []
  
  const totalPortfolioValue = ownedStocks.reduce((sum: number, item: any) => {
    const value = (item.quantity || 0) * (item.stock.price || 0)
    return sum + value
  }, 0)

  const totalGainLoss = ownedStocks.reduce((sum: number, item: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Sexy Dark Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sexy Dark Header */}
        <div className="mb-8">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 p-8 relative overflow-hidden">
            {/* Header Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  PORTFOLIO PRO
                </h1>
                <p className="text-slate-300 mt-3 text-xl font-light">Elite Investment Intelligence Platform</p>
              </div>
              <div className="flex gap-4">
                <RefreshAllDataButton />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10 backdrop-blur-sm text-white hover:text-white transition-all duration-300">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-2xl border-white/20 text-white">
                    <DropdownMenuItem onClick={() => handleExport('csv')} className="hover:bg-white/10">
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')} className="hover:bg-white/10">
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('summary')} className="hover:bg-white/10">
                      Export Summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border-0 font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Add Stock
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sexy Dark Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500 hover:bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/5"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Portfolio Value</CardTitle>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                ${totalPortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-emerald-200/70 mt-2 font-medium">
                {ownedStocks.length} active positions
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:bg-black/40 relative overflow-hidden">
            <div className={`absolute inset-0 ${
              totalGainLoss >= 0 
                ? 'bg-gradient-to-br from-emerald-500/10 to-green-600/5' 
                : 'bg-gradient-to-br from-red-500/10 to-rose-600/5'
            }`}></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                totalGainLoss >= 0 ? 'text-emerald-100' : 'text-red-100'
              }`}>Total Gain/Loss</CardTitle>
              <div className={`p-3 rounded-xl shadow-2xl transition-all duration-300 ${
                totalGainLoss >= 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30 group-hover:shadow-emerald-500/50' 
                  : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 group-hover:shadow-red-500/50'
              }`}>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-white" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-white" />
                )}
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className={`text-4xl font-black ${
                totalGainLoss >= 0 
                  ? 'bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-red-300 to-rose-300 bg-clip-text text-transparent'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <p className={`text-xs mt-2 font-medium ${
                totalGainLoss >= 0 ? 'text-emerald-200/70' : 'text-red-200/70'
              }`}>
                {totalPortfolioValue > 0 ? 
                  `${((totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100).toFixed(2)}% return` : 
                  '0.00% return'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/5"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Watchlist</CardTitle>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-2xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                {watchingStocks.length}
              </div>
              <p className="text-xs text-blue-200/70 mt-2 font-medium">
                stocks monitored
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/5"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Stocks</CardTitle>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-2xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                {stocks?.length || 0}
              </div>
              <p className="text-xs text-purple-200/70 mt-2 font-medium">
                in database
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sexy Dark Navigation Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl p-2 rounded-3xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-2xl font-semibold text-white/70 hover:text-white/90"
            >
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/30 transition-all duration-300 rounded-2xl font-semibold text-white/70 hover:text-white/90"
            >
              <PieChart className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-purple-500/30 transition-all duration-300 rounded-2xl font-semibold text-white/70 hover:text-white/90"
            >
              <LineChart className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-orange-500/30 transition-all duration-300 rounded-2xl font-semibold text-white/70 hover:text-white/90"
            >
              <List className="h-4 w-4" />
              Watchlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Portfolio Overview
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Elite investment intelligence at your fingertips
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 text-blue-200">Recent Activity</h3>
                    <p className="text-blue-100/80 leading-relaxed">Track your latest portfolio changes and market movements in real-time with advanced analytics.</p>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 text-emerald-200">Quick Actions</h3>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setIsAddDialogOpen(true)} 
                        className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:via-teal-500 hover:to-blue-500 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 font-semibold text-lg py-3"
                      >
                        Add New Stock
                      </Button>
                      <RefreshAllDataButton />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6 mt-8">
            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5"></div>
              <div className="relative">
                <PortfolioCharts data={watchlist || []} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-8">
            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-600/5"></div>
              <div className="relative">
                <InvestmentAnalysisCharts data={watchlist || []} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6 mt-8">
            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5"></div>
              <div className="relative">
                <WatchlistAnalysis data={watchlist || []} />
              </div>
            </div>
            
            <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-600/5"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
                  Portfolio & Watchlist
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Monitor your owned positions and stocks on your watchlist
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 relative">
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