
import { useState, useEffect } from 'react'
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Target, BarChart3, Zap, Award, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { scoringEngine } from '@/lib/scoring'

interface InvestmentAnalysisChartsProps {
  data: Array<{
    id: string
    status: string
    stock: {
      id: string
      ticker: string
      name: string
      price?: number | null
      marketCap?: number | null
      sector?: string | null
      financialData?: Array<{
        revenue?: number | null
        revenueGrowth?: number | null
        eps?: number | null
        epsGrowth?: number | null
        fcf?: number | null
        fcfGrowth?: number | null
        fcfMargin?: number | null
        grossMargin?: number | null
        roic?: number | null
        debtToEbitda?: number | null
        peRatio?: number | null
        shareDilution?: number | null
      }>
    }
  }>
}

interface AnalysisStock {
  ticker: string
  name: string
  sector?: string | null
  price?: number | null
  marketCap?: number | null
  status: string
  peRatio?: number | null
  hasFinancialData: boolean
  growthScore: number
  qualityScore: number
  overallScore: number
  metrics: Record<string, number | undefined>
}

export function InvestmentAnalysisCharts({ data }: InvestmentAnalysisChartsProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisStock[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    // Calculate investment scores for all stocks
    const stocksWithScores = data
      .filter(item => item.status === 'WATCHING' || item.status === 'OWNED')
      .map(item => {
        const latestFinancials = item.stock.financialData?.[0]
        
        const metrics = {
          ltmRevenueGrowth: latestFinancials?.revenueGrowth ?? undefined,
          ltmFcfGrowth: latestFinancials?.fcfGrowth ?? undefined,
          ltmEpsGrowth: latestFinancials?.epsGrowth ?? undefined,
          forward3yRevenueGrowth: latestFinancials?.revenueGrowth ? latestFinancials.revenueGrowth * 0.8 : undefined,
          forward3yEpsGrowth: latestFinancials?.epsGrowth ? latestFinancials.epsGrowth * 0.9 : undefined,
          ltmGrossMargin: latestFinancials?.grossMargin ?? undefined,
          ltmRoic: latestFinancials?.roic ?? undefined,
          ltmDebtToEbitda: latestFinancials?.debtToEbitda ?? undefined,
          ltmFcfMargin: latestFinancials?.fcfMargin ?? undefined,
          shareDilution: latestFinancials?.shareDilution ?? undefined,
        }

        const scores = scoringEngine.calculateOverallScore(metrics)
        
        return {
          ticker: item.stock.ticker,
          name: item.stock.name,
          sector: item.stock.sector,
          price: item.stock.price,
          marketCap: item.stock.marketCap,
          status: item.status,
          peRatio: latestFinancials?.peRatio,
          hasFinancialData: !!latestFinancials,
          ...scores,
          metrics
        }
      })

    setAnalysisData(stocksWithScores)
  }, [data])

  // Growth vs Quality scatter plot data
  const scatterData = analysisData.map(stock => ({
    x: stock.qualityScore * 100,
    y: stock.growthScore * 100,
    z: stock.marketCap ? Math.log10(stock.marketCap) : 0,
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    overallScore: stock.overallScore,
    status: stock.status
  }))

  // Top performers by overall score
  const topPerformers = [...analysisData]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10)

  // Sector analysis
  const sectorAnalysis = analysisData.reduce((acc, stock) => {
    const sector = stock.sector || 'Unknown'
    if (!acc[sector]) {
      acc[sector] = {
        sector,
        stocks: [],
        avgGrowthScore: 0,
        avgQualityScore: 0,
        avgOverallScore: 0,
        count: 0
      }
    }
    
    acc[sector].stocks.push(stock)
    acc[sector].count++
    
    return acc
  }, {} as Record<string, { sector: string; count: number; stocks: AnalysisStock[]; avgGrowthScore?: number; avgQualityScore?: number; avgOverallScore?: number }>)

  // Calculate sector averages
  Object.values(sectorAnalysis).forEach((sector) => {
    sector.avgGrowthScore = sector.stocks.reduce((sum: number, s: AnalysisStock) => sum + s.growthScore, 0) / sector.count
    sector.avgQualityScore = sector.stocks.reduce((sum: number, s: AnalysisStock) => sum + s.qualityScore, 0) / sector.count
    sector.avgOverallScore = sector.stocks.reduce((sum: number, s: AnalysisStock) => sum + s.overallScore, 0) / sector.count
  })

  const sectorData = Object.values(sectorAnalysis)

  // Risk/Reward analysis based on PE ratio and growth
  const riskRewardData = analysisData
    .filter(stock => stock.peRatio && stock.peRatio > 0)
    .map(stock => ({
      ticker: stock.ticker,
      peRatio: stock.peRatio,
      growthScore: stock.growthScore * 100,
      overallScore: stock.overallScore,
      risk: (stock.peRatio ?? 0) > 30 ? 'High' : (stock.peRatio ?? 0) > 15 ? 'Medium' : 'Low'
    }))

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return '#22C55E' // Green
    if (score >= 0.5) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  const getScoreBadge = (score: number) => {
    if (score >= 0.7) return { label: 'Excellent', variant: 'default' as const }
    if (score >= 0.5) return { label: 'Good', variant: 'secondary' as const }
    return { label: 'Poor', variant: 'destructive' as const }
  }

  const CustomScatterTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { ticker: string; name: string; sector?: string | null; x: number; y: number; overallScore: number; status: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/90 backdrop-blur-xl p-4 border border-white/20 rounded-lg shadow-2xl">
          <h3 className="font-bold text-white">{data.ticker}</h3>
          <p className="text-sm text-white/70 mb-2">{data.name}</p>
          <p className="text-white/90"><strong className="text-white">Sector:</strong> {data.sector || 'Unknown'}</p>
          <p className="text-white/90"><strong className="text-white">Quality Score:</strong> {data.x.toFixed(1)}</p>
          <p className="text-white/90"><strong className="text-white">Growth Score:</strong> {data.y.toFixed(1)}</p>
          <p className="text-white/90"><strong className="text-white">Overall Score:</strong> {(data.overallScore * 100).toFixed(1)}</p>
          <Badge className="mt-2" variant={data.status === 'OWNED' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )
    }
    return null
  }

  // Check if we have any financial data
  const stocksWithoutFinancialData = analysisData.filter(stock => !stock.hasFinancialData)

  if (analysisData.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5" />
            Investment Analysis
          </CardTitle>
          <CardDescription className="text-white/70">
            Advanced scoring and analysis of your investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-white/60">No stocks available for analysis.</p>
          <p className="text-sm text-white/40 mt-1">Add stocks to your watchlist to see detailed investment analysis.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial Data Status */}
      {stocksWithoutFinancialData.length > 0 && (
        <Card className="bg-black/30 backdrop-blur-2xl border-amber-400/20 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Limited Financial Data
            </CardTitle>
            <CardDescription className="text-amber-200/80">
              {stocksWithoutFinancialData.length} of {analysisData.length} stocks are missing financial data for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-sm text-amber-200/90 mb-3">
              Stocks currently showing 0% quality scores due to missing financial data:
            </p>
            <div className="flex flex-wrap gap-2">
              {stocksWithoutFinancialData.slice(0, 20).map(stock => (
                <Badge key={stock.ticker} variant="outline" className="text-amber-200 border-amber-400/30 bg-amber-500/10">
                  {stock.ticker}
                </Badge>
              ))}
              {stocksWithoutFinancialData.length > 20 && (
                <Badge variant="outline" className="text-amber-200 border-amber-400/30 bg-amber-500/10">
                  +{stocksWithoutFinancialData.length - 20} more
                </Badge>
              )}
            </div>
            <p className="text-xs text-amber-200/70 mt-3">
              💡 <strong className="text-amber-300">Next step:</strong> We need to fetch financial data from APIs to get accurate scoring. 
              The system is currently using only price data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Growth vs Quality Matrix */}
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-emerald-200">
            <Target className="h-5 w-5 text-emerald-400" />
            Growth vs Quality Matrix
          </CardTitle>
          <CardDescription className="text-emerald-200/70">
            Identify high-quality growth stocks in the top-right quadrant
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, 100]}
                label={{ value: 'Quality Score', position: 'insideBottom', offset: -10, fill: '#ffffff80' }}
                tick={{ fill: '#ffffff80' }}
                axisLine={{ stroke: '#ffffff30' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 100]}
                label={{ value: 'Growth Score', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                tick={{ fill: '#ffffff80' }}
                axisLine={{ stroke: '#ffffff30' }}
              />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter 
                name="Stocks" 
                data={scatterData} 
                fill="#3B82F6"
              >
                {scatterData.map((entry, index) => (
                  <div key={`cell-${index}`} style={{ 
                    fill: entry.status === 'OWNED' ? '#10B981' : '#3B82F6',
                    opacity: 0.8
                  }} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-white/70">
            <p><strong className="text-emerald-300">Top Right:</strong> High Growth + High Quality (Best opportunities)</p>
            <p><strong className="text-emerald-300">Colors:</strong> <span className="text-green-400">Green = Owned</span>, <span className="text-blue-400">Blue = Watching</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-blue-200">
              <Award className="h-5 w-5 text-blue-400" />
              Top Investment Scores
            </CardTitle>
            <CardDescription className="text-blue-200/70">
              Highest scoring stocks by our investment algorithm
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPerformers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis type="number" domain={[0, 1]} tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <YAxis dataKey="ticker" type="category" width={60} tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <Tooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', 'Score']}
                  contentStyle={{ backgroundColor: '#00000090', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }}
                />
                <Bar dataKey="overallScore" fill="url(#blueGradient)" />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-emerald-200">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Sector Performance
            </CardTitle>
            <CardDescription className="text-emerald-200/70">
              Average investment scores by sector
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <YAxis domain={[0, 1]} tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <Tooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', 'Avg Score']}
                  contentStyle={{ backgroundColor: '#00000090', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }}
                />
                <Bar dataKey="avgOverallScore" fill="url(#emeraldGradient)" />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk/Reward Analysis */}
      {riskRewardData.length > 0 && (
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-orange-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-orange-200">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Risk vs Reward Analysis
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              PE Ratio vs Growth Score - Find undervalued growth stocks
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  type="number" 
                  dataKey="peRatio" 
                  label={{ value: 'PE Ratio', position: 'insideBottom', offset: -10, fill: '#ffffff80' }}
                  tick={{ fill: '#ffffff80' }}
                  axisLine={{ stroke: '#ffffff30' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="growthScore" 
                  domain={[0, 100]}
                  label={{ value: 'Growth Score', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                  tick={{ fill: '#ffffff80' }}
                  axisLine={{ stroke: '#ffffff30' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'growthScore' ? value.toFixed(1) : value.toFixed(2),
                    name === 'growthScore' ? 'Growth Score' : 'PE Ratio'
                  ]}
                  labelFormatter={(label) => `Stock: ${label}`}
                  contentStyle={{ backgroundColor: '#00000090', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }}
                />
                <Scatter name="Stocks" data={riskRewardData} fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-white/70">
              <p><strong className="text-orange-300">Sweet Spot:</strong> High Growth Score + Low PE Ratio (bottom-right area)</p>
              <p><strong className="text-orange-300">Avoid:</strong> High PE + Low Growth (top-left area)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sexy Dark Stock Scores */}
      <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-600/5"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-violet-200 bg-clip-text text-transparent">
                <Zap className="h-6 w-6 text-purple-400" />
                Stock Scoring Breakdown
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Elite scoring intelligence for each stock in your watchlist
              </CardDescription>
            </div>
            <div className="text-sm text-purple-200/80 font-semibold">
              {analysisData.length} total stocks
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            {analysisData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((stock) => (
                <div key={stock.ticker} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-2xl text-white group-hover:text-purple-200 transition-colors">{stock.ticker}</h3>
                      <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{stock.name}</p>
                      <p className="text-xs text-white/50">{stock.sector || 'Unknown Sector'}</p>
                    </div>
                    <div className="text-right">
                      <Badge {...getScoreBadge(stock.overallScore)} className="shadow-lg">
                        {(stock.overallScore * 100).toFixed(1)}%
                      </Badge>
                      <p className="text-xs text-white/60 mt-1">{stock.status}</p>
                    </div>
                  </div>
                  
                  <div className="relative grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white/80 mb-2">Growth Score</p>
                      <div 
                        className="text-3xl font-black"
                        style={{ color: getScoreColor(stock.growthScore) }}
                      >
                        {(stock.growthScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white/80 mb-2">Quality Score</p>
                      <div 
                        className="text-3xl font-black"
                        style={{ color: getScoreColor(stock.qualityScore) }}
                      >
                        {(stock.qualityScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white/80 mb-2">Overall Score</p>
                      <div 
                        className="text-3xl font-black"
                        style={{ color: getScoreColor(stock.overallScore) }}
                      >
                        {(stock.overallScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Sexy Dark Pagination */}
          {analysisData.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-8 p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="text-sm text-white/80 font-semibold">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, analysisData.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, analysisData.length)} of {analysisData.length} stocks
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
                  {Array.from({ length: Math.ceil(analysisData.length / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = Math.ceil(analysisData.length / itemsPerPage)
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
                              ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30' 
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
                    Math.min(prev + 1, Math.ceil(analysisData.length / itemsPerPage))
                  )}
                  disabled={currentPage === Math.ceil(analysisData.length / itemsPerPage)}
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