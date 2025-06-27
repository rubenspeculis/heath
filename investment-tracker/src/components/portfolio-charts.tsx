'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioChartsProps {
  data: Array<{
    stock: {
      ticker: string
      name: string
      sector?: string | null
      price?: number | null
    }
    quantity?: number | null
    avgPrice?: number | null
    status: string
  }>
}

export function PortfolioCharts({ data }: PortfolioChartsProps) {
  const ownedStocks = data.filter(item => item.status === 'OWNED')

  // Portfolio allocation by value
  const portfolioAllocation = ownedStocks
    .filter(item => item.quantity && item.stock.price)
    .map(item => ({
      name: item.stock.ticker,
      value: (item.quantity || 0) * (item.stock.price || 0),
      percentage: 0 // Will calculate below
    }))

  const totalValue = portfolioAllocation.reduce((sum, item) => sum + item.value, 0)
  portfolioAllocation.forEach(item => {
    item.percentage = ((item.value / totalValue) * 100)
  })

  // Sector allocation
  const sectorAllocation = ownedStocks
    .filter(item => item.quantity && item.stock.price && item.stock.sector)
    .reduce((acc, item) => {
      const sector = item.stock.sector || 'Unknown'
      const value = (item.quantity || 0) * (item.stock.price || 0)
      
      if (acc[sector]) {
        acc[sector] += value
      } else {
        acc[sector] = value
      }
      return acc
    }, {} as Record<string, number>)

  const sectorData = Object.entries(sectorAllocation).map(([sector, value]) => ({
    name: sector,
    value,
    percentage: ((value / totalValue) * 100)
  }))

  // Performance data (mock data for demonstration)
  const performanceData = ownedStocks
    .filter(item => item.quantity && item.stock.price && item.avgPrice)
    .map(item => {
      const currentValue = (item.quantity || 0) * (item.stock.price || 0)
      const costBasis = (item.quantity || 0) * (item.avgPrice || 0)
      const gainLoss = currentValue - costBasis
      const gainLossPercent = (gainLoss / costBasis) * 100

      return {
        name: item.stock.ticker,
        gainLoss: gainLoss,
        gainLossPercent: gainLossPercent,
        currentValue: currentValue
      }
    })
    .sort((a, b) => Math.abs(b.gainLoss) - Math.abs(a.gainLoss))
    .slice(0, 10)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl p-3 border border-white/20 rounded-lg shadow-2xl">
          <p className="font-medium text-white">{label}</p>
          <p className="text-emerald-400">
            Value: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-white/70">
            {payload[0].payload.percentage?.toFixed(1)}% of portfolio
          </p>
        </div>
      )
    }
    return null
  }

  if (ownedStocks.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-emerald-200">Portfolio Allocation</CardTitle>
            <CardDescription className="text-emerald-200/70">Distribution of your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent className="relative flex items-center justify-center h-64">
            <p className="text-white/60">No owned positions to display</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-blue-200">Sector Allocation</CardTitle>
            <CardDescription className="text-blue-200/70">Portfolio diversification by sector</CardDescription>
          </CardHeader>
          <CardContent className="relative flex items-center justify-center h-64">
            <p className="text-white/60">No sector data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-emerald-200">Portfolio Allocation</CardTitle>
            <CardDescription className="text-emerald-200/70">Distribution by market value</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-blue-200">Sector Allocation</CardTitle>
            <CardDescription className="text-blue-200/70">Portfolio diversification by sector</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {performanceData.length > 0 && (
        <Card className="bg-black/30 backdrop-blur-2xl border-white/10 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-600/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-purple-200">Position Performance</CardTitle>
            <CardDescription className="text-purple-200/70">Gain/Loss for your largest positions</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <YAxis tick={{ fill: '#ffffff80' }} axisLine={{ stroke: '#ffffff30' }} />
                <Tooltip 
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    'Gain/Loss'
                  ]}
                  labelFormatter={(label) => `Stock: ${label}`}
                  contentStyle={{ backgroundColor: '#00000090', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }}
                />
                <Bar 
                  dataKey="gainLoss" 
                  fill={(entry: any) => entry.gainLoss >= 0 ? '#10B981' : '#EF4444'}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gainLoss >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}