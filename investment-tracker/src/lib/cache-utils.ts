/**
 * Utility functions for intelligent data caching
 * Helps avoid unnecessary API calls by checking data freshness
 */

/**
 * Check if data is stale based on timestamp and maximum age
 * @param timestamp - The timestamp when data was last updated
 * @param maxAgeHours - Maximum age in hours before data is considered stale
 * @returns true if data should be refreshed, false if still fresh
 */
export function isDataStale(timestamp: Date | null | undefined, maxAgeHours: number): boolean {
  if (!timestamp) {
    return true // No timestamp means data is missing, needs refresh
  }

  const now = new Date()
  const ageInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  
  return ageInHours > maxAgeHours
}

/**
 * Check if financial data needs to be refreshed (12-hour cache)
 * @param updatedAt - Timestamp when financial data was last updated
 * @returns true if data should be refreshed
 */
export function shouldRefreshFinancialData(updatedAt: Date | null | undefined): boolean {
  return isDataStale(updatedAt, 12)
}

/**
 * Check if price data needs to be refreshed (2-hour cache)
 * @param updatedAt - Timestamp when price data was last updated
 * @returns true if data should be refreshed
 */
export function shouldRefreshPriceData(updatedAt: Date | null | undefined): boolean {
  return isDataStale(updatedAt, 2)
}

/**
 * Get human-readable cache status for display
 * @param timestamp - The timestamp to check
 * @param maxAgeHours - Maximum age before considered stale
 * @returns object with status and description
 */
export function getCacheStatus(timestamp: Date | null | undefined, maxAgeHours: number): {
  status: 'missing' | 'fresh' | 'stale'
  description: string
  ageHours?: number
} {
  if (!timestamp) {
    return {
      status: 'missing',
      description: 'No data available'
    }
  }

  const now = new Date()
  const ageInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  
  if (ageInHours > maxAgeHours) {
    return {
      status: 'stale',
      description: `Data is ${Math.floor(ageInHours)} hours old`,
      ageHours: ageInHours
    }
  }

  return {
    status: 'fresh',
    description: `Updated ${Math.floor(ageInHours)} hours ago`,
    ageHours: ageInHours
  }
}

/**
 * Format time difference for user display
 * @param timestamp - The timestamp to format
 * @returns human-readable time difference
 */
export function formatTimeSince(timestamp: Date | null | undefined): string {
  if (!timestamp) {
    return 'Never'
  }

  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours >= 24) {
    const days = Math.floor(diffHours / 24)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (diffHours >= 1) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffMinutes >= 1) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

/**
 * Calculate how many stocks need updates based on cache rules
 * @param stocks - Array of stocks with timestamp data
 * @param checkType - Type of data to check ('price' | 'financial')
 * @returns summary of stocks needing updates
 */
export function getUpdateSummary(
  stocks: Array<{ 
    ticker: string
    updatedAt?: Date | null
    financialData?: Array<{ updatedAt?: Date | null }> | null
  }>,
  checkType: 'price' | 'financial'
): {
  total: number
  needsUpdate: number
  fresh: number
  needsUpdateTickers: string[]
  freshTickers: string[]
} {
  const needsUpdateTickers: string[] = []
  const freshTickers: string[] = []

  stocks.forEach(stock => {
    let needsUpdate = false

    if (checkType === 'price') {
      needsUpdate = shouldRefreshPriceData(stock.updatedAt)
    } else if (checkType === 'financial') {
      // Check if financial data exists and is fresh
      const latestFinancialData = stock.financialData?.[0]
      needsUpdate = shouldRefreshFinancialData(latestFinancialData?.updatedAt)
    }

    if (needsUpdate) {
      needsUpdateTickers.push(stock.ticker)
    } else {
      freshTickers.push(stock.ticker)
    }
  })

  return {
    total: stocks.length,
    needsUpdate: needsUpdateTickers.length,
    fresh: freshTickers.length,
    needsUpdateTickers,
    freshTickers
  }
}