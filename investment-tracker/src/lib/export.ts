interface ExportData {
  ticker: string
  name: string
  status: string
  quantity?: number | null
  avgPrice?: number | null
  currentPrice?: number | null
  marketValue?: number
  gainLoss?: number
  gainLossPercent?: number
  sector?: string | null
  currency: string
  notes?: string | null
}

export class ExportService {
  static exportToCSV(data: ExportData[], filename: string = 'portfolio-export.csv') {
    const headers = [
      'Ticker',
      'Company Name',
      'Status',
      'Quantity',
      'Avg Price',
      'Current Price',
      'Market Value',
      'Gain/Loss ($)',
      'Gain/Loss (%)',
      'Sector',
      'Currency',
      'Notes'
    ]

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.ticker,
        `"${row.name.replace(/"/g, '""')}"`,
        row.status,
        row.quantity || '',
        row.avgPrice || '',
        row.currentPrice || '',
        row.marketValue || '',
        row.gainLoss || '',
        row.gainLossPercent ? `${row.gainLossPercent.toFixed(2)}%` : '',
        row.sector || '',
        row.currency,
        row.notes ? `"${row.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n')

    this.downloadFile(csvContent, filename, 'text/csv')
  }

  static exportToJSON(data: ExportData[], filename: string = 'portfolio-export.json') {
    const jsonContent = JSON.stringify(data, null, 2)
    this.downloadFile(jsonContent, filename, 'application/json')
  }

  static exportPortfolioSummary(data: ExportData[], filename: string = 'portfolio-summary.txt') {
    const ownedStocks = data.filter(item => item.status === 'OWNED')
    const totalValue = ownedStocks.reduce((sum, item) => sum + (item.marketValue || 0), 0)
    const totalGainLoss = ownedStocks.reduce((sum, item) => sum + (item.gainLoss || 0), 0)
    const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0

    const sectorBreakdown = ownedStocks.reduce((acc, item) => {
      const sector = item.sector || 'Unknown'
      if (!acc[sector]) acc[sector] = { value: 0, count: 0 }
      acc[sector].value += item.marketValue || 0
      acc[sector].count += 1
      return acc
    }, {} as Record<string, { value: number; count: number }>)

    const summary = `
INVESTMENT PORTFOLIO SUMMARY
Generated on: ${new Date().toLocaleDateString()}

PORTFOLIO OVERVIEW
=================
Total Portfolio Value: $${totalValue.toLocaleString()}
Total Gain/Loss: ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toLocaleString()}
Total Return: ${totalGainLossPercent >= 0 ? '+' : ''}${totalGainLossPercent.toFixed(2)}%
Number of Positions: ${ownedStocks.length}
Number of Watching: ${data.filter(item => item.status === 'WATCHING').length}

SECTOR ALLOCATION
================
${Object.entries(sectorBreakdown)
  .sort((a, b) => b[1].value - a[1].value)
  .map(([sector, info]) => 
    `${sector}: $${info.value.toLocaleString()} (${((info.value / totalValue) * 100).toFixed(1)}%) - ${info.count} positions`
  ).join('\n')}

TOP POSITIONS BY VALUE
=====================
${ownedStocks
  .sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0))
  .slice(0, 10)
  .map((item, index) => 
    `${index + 1}. ${item.ticker} - $${(item.marketValue || 0).toLocaleString()} (${item.gainLoss ? (item.gainLoss >= 0 ? '+' : '') + '$' + item.gainLoss.toLocaleString() : 'N/A'})`
  ).join('\n')}

DETAILED HOLDINGS
================
${ownedStocks.map(item => `
${item.ticker} - ${item.name}
  Quantity: ${item.quantity || 'N/A'}
  Avg Price: $${item.avgPrice || 'N/A'}
  Current Price: $${item.currentPrice || 'N/A'}
  Market Value: $${(item.marketValue || 0).toLocaleString()}
  Gain/Loss: ${item.gainLoss ? (item.gainLoss >= 0 ? '+' : '') + '$' + item.gainLoss.toLocaleString() : 'N/A'}
  Sector: ${item.sector || 'Unknown'}
  ${item.notes ? 'Notes: ' + item.notes : ''}
`).join('\n')}

WATCHLIST
=========
${data.filter(item => item.status === 'WATCHING').map(item => `
${item.ticker} - ${item.name}
  Current Price: $${item.currentPrice || 'N/A'}
  Sector: ${item.sector || 'Unknown'}
  ${item.notes ? 'Notes: ' + item.notes : ''}
`).join('\n')}
`.trim()

    this.downloadFile(summary, filename, 'text/plain')
  }

  private static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  static prepareExportData(watchlistData: Array<{
    id: string
    status: string
    quantity?: number | null
    avgPrice?: number | null
    notes?: string | null
    stock: {
      ticker: string
      name: string
      price?: number | null
      currency: string
      sector?: string | null
    }
  }>): ExportData[] {
    return watchlistData.map(item => {
      const marketValue = item.quantity && item.stock.price ? 
        item.quantity * item.stock.price : undefined
      
      const gainLoss = item.quantity && item.avgPrice && item.stock.price ?
        (item.quantity * item.stock.price) - (item.quantity * item.avgPrice) : undefined
      
      const gainLossPercent = gainLoss && item.quantity && item.avgPrice ?
        (gainLoss / (item.quantity * item.avgPrice)) * 100 : undefined

      return {
        ticker: item.stock.ticker,
        name: item.stock.name,
        status: item.status,
        quantity: item.quantity,
        avgPrice: item.avgPrice,
        currentPrice: item.stock.price,
        marketValue,
        gainLoss,
        gainLossPercent,
        sector: item.stock.sector,
        currency: item.stock.currency,
        notes: item.notes,
      }
    })
  }
}

export const exportService = ExportService