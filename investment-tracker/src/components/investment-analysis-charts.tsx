'use client'

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
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
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

export function InvestmentAnalysisCharts({ data }: InvestmentAnalysisChartsProps) {
  const [analysisData, setAnalysisData] = useState<any[]>([])
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
  }, {} as Record<string, any>)

  // Calculate sector averages
  Object.values(sectorAnalysis).forEach((sector: any) => {
    sector.avgGrowthScore = sector.stocks.reduce((sum: number, s: any) => sum + s.growthScore, 0) / sector.count
    sector.avgQualityScore = sector.stocks.reduce((sum: number, s: any) => sum + s.qualityScore, 0) / sector.count
    sector.avgOverallScore = sector.stocks.reduce((sum: number, s: any) => sum + s.overallScore, 0) / sector.count
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
      risk: stock.peRatio > 30 ? 'High' : stock.peRatio > 15 ? 'Medium' : 'Low'
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

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <h3 className="font-bold">{data.ticker}</h3>
          <p className="text-sm text-gray-600 mb-2">{data.name}</p>
          <p><strong>Sector:</strong> {data.sector || 'Unknown'}</p>
          <p><strong>Quality Score:</strong> {data.x.toFixed(1)}</p>
          <p><strong>Growth Score:</strong> {data.y.toFixed(1)}</p>
          <p><strong>Overall Score:</strong> {(data.overallScore * 100).toFixed(1)}</p>
          <Badge className="mt-2" variant={data.status === 'OWNED' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )
    }
    return null
  }

  // Check if we have any financial data
  const stocksWithFinancialData = analysisData.filter(stock => stock.hasFinancialData)
  const stocksWithoutFinancialData = analysisData.filter(stock => !stock.hasFinancialData)

  if (analysisData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Investment Analysis
          </CardTitle>
          <CardDescription>
            Advanced scoring and analysis of your investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No stocks available for analysis.</p>
          <p className="text-sm text-gray-400 mt-1">Add stocks to your watchlist to see detailed investment analysis.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial Data Status */}
      {stocksWithoutFinancialData.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Limited Financial Data
            </CardTitle>
            <CardDescription className="text-yellow-700">
              {stocksWithoutFinancialData.length} of {analysisData.length} stocks are missing financial data for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-3">
              Stocks currently showing 0% quality scores due to missing financial data:
            </p>
            <div className="flex flex-wrap gap-2">
              {stocksWithoutFinancialData.slice(0, 20).map(stock => (
                <Badge key={stock.ticker} variant="outline" className="text-yellow-800 border-yellow-300">
                  {stock.ticker}
                </Badge>
              ))}
              {stocksWithoutFinancialData.length > 20 && (
                <Badge variant="outline" className="text-yellow-800 border-yellow-300">
                  +{stocksWithoutFinancialData.length - 20} more
                </Badge>
              )}
            </div>
            <p className="text-xs text-yellow-600 mt-3">
              💡 <strong>Next step:</strong> We need to fetch financial data from APIs to get accurate scoring. 
              The system is currently using only price data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Growth vs Quality Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Growth vs Quality Matrix
          </CardTitle>
          <CardDescription>
            Identify high-quality growth stocks in the top-right quadrant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, 100]}
                label={{ value: 'Quality Score', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 100]}
                label={{ value: 'Growth Score', angle: -90, position: 'insideLeft' }}
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
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Top Right:</strong> High Growth + High Quality (Best opportunities)</p>
            <p><strong>Colors:</strong> <span className="text-green-600">Green = Owned</span>, <span className="text-blue-600">Blue = Watching</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Investment Scores
            </CardTitle>
            <CardDescription>
              Highest scoring stocks by our investment algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPerformers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="ticker" type="category" width={60} />
                <Tooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', 'Score']}
                />
                <Bar dataKey="overallScore" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sector Performance
            </CardTitle>
            <CardDescription>
              Average investment scores by sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 1]} />
                <Tooltip 
                  formatter={(value: number) => [(value * 100).toFixed(1) + '%', 'Avg Score']}
                />
                <Bar dataKey="avgOverallScore" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk/Reward Analysis */}
      {riskRewardData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk vs Reward Analysis
            </CardTitle>
            <CardDescription>
              PE Ratio vs Growth Score - Find undervalued growth stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="peRatio" 
                  label={{ value: 'PE Ratio', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="growthScore" 
                  domain={[0, 100]}
                  label={{ value: 'Growth Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'growthScore' ? value.toFixed(1) : value.toFixed(2),
                    name === 'growthScore' ? 'Growth Score' : 'PE Ratio'
                  ]}
                  labelFormatter={(label) => `Stock: ${label}`}
                />
                <Scatter name="Stocks" data={riskRewardData} fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Sweet Spot:</strong> High Growth Score + Low PE Ratio (bottom-right area)</p>
              <p><strong>Avoid:</strong> High PE + Low Growth (top-left area)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Stock Scores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Stock Scoring Breakdown
              </CardTitle>
              <CardDescription>
                Detailed scores for each stock in your watchlist
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              {analysisData.length} total stocks
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((stock) => (
                <div key={stock.ticker} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{stock.ticker}</h3>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                      <p className="text-xs text-gray-500">{stock.sector || 'Unknown Sector'}</p>
                    </div>
                    <div className="text-right">
                      <Badge {...getScoreBadge(stock.overallScore)}>
                        {(stock.overallScore * 100).toFixed(1)}%
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{stock.status}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">Growth Score</p>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(stock.growthScore) }}
                      >
                        {(stock.growthScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Quality Score</p>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(stock.qualityScore) }}
                      >
                        {(stock.qualityScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Overall Score</p>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: getScoreColor(stock.overallScore) }}
                      >
                        {(stock.overallScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Pagination Controls */}
          {analysisData.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, analysisData.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, analysisData.length)} of {analysisData.length} stocks
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
                    Math.min(prev + 1, Math.ceil(analysisData.length / itemsPerPage))
                  )}
                  disabled={currentPage === Math.ceil(analysisData.length / itemsPerPage)}
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