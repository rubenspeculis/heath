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
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Value: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-gray-600">
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
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution of your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-500">No owned positions to display</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>Portfolio diversification by sector</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-500">No sector data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution by market value</CardDescription>
          </CardHeader>
          <CardContent>
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
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
            <CardDescription>Portfolio diversification by sector</CardDescription>
          </CardHeader>
          <CardContent>
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
        <Card>
          <CardHeader>
            <CardTitle>Position Performance</CardTitle>
            <CardDescription>Gain/Loss for your largest positions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    'Gain/Loss'
                  ]}
                  labelFormatter={(label) => `Stock: ${label}`}
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