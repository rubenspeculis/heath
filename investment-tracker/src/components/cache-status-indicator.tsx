import { Clock, Database, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCacheStatus, formatTimeSince } from '@/lib/cache-utils'

interface CacheStatusIndicatorProps {
  priceUpdatedAt?: Date | null
  financialDataUpdatedAt?: Date | null
  showLabels?: boolean
  size?: 'sm' | 'md'
}

export function CacheStatusIndicator({ 
  priceUpdatedAt, 
  financialDataUpdatedAt, 
  showLabels = false,
  size = 'sm'
}: CacheStatusIndicatorProps) {
  const priceStatus = getCacheStatus(priceUpdatedAt, 2) // 2-hour cache for prices
  const financialStatus = getCacheStatus(financialDataUpdatedAt, 12) // 12-hour cache for financial data

  const getStatusIcon = (status: 'missing' | 'fresh' | 'stale', type: 'price' | 'financial') => {
    const iconClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
    const Icon = type === 'price' ? DollarSign : Database

    if (status === 'missing') {
      return <AlertTriangle className={`${iconClass} text-red-500`} />
    } else if (status === 'stale') {
      return <Clock className={`${iconClass} text-amber-500`} />
    } else {
      return <CheckCircle className={`${iconClass} text-green-500`} />
    }
  }

  const getStatusColor = (status: 'missing' | 'fresh' | 'stale') => {
    switch (status) {
      case 'missing': return 'bg-red-500/10 border-red-500/30 text-red-300'
      case 'stale': return 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      case 'fresh': return 'bg-green-500/10 border-green-500/30 text-green-300'
    }
  }

  if (showLabels) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {getStatusIcon(priceStatus.status, 'price')}
          <Badge variant="outline" className={`text-xs ${getStatusColor(priceStatus.status)}`}>
            Price: {formatTimeSince(priceUpdatedAt)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(financialStatus.status, 'financial')}
          <Badge variant="outline" className={`text-xs ${getStatusColor(financialStatus.status)}`}>
            Financial: {formatTimeSince(financialDataUpdatedAt)}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1" title={`Price: ${priceStatus.description} | Financial: ${financialStatus.description}`}>
      <div className="flex items-center gap-0.5">
        {getStatusIcon(priceStatus.status, 'price')}
        {getStatusIcon(financialStatus.status, 'financial')}
      </div>
    </div>
  )
}

interface DataFreshnessLegendProps {
  className?: string
}

export function DataFreshnessLegend({ className = '' }: DataFreshnessLegendProps) {
  return (
    <div className={`text-xs text-white/60 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Fresh</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-amber-500" />
          <span>Stale</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-red-500" />
          <span>Missing</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <DollarSign className="h-3 w-3 text-white/60" />
          <span>Price (2h)</span>
          <Database className="h-3 w-3 text-white/60" />
          <span>Financial (12h)</span>
        </div>
      </div>
    </div>
  )
}