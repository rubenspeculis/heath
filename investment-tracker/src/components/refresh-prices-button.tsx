
import { useState } from 'react'
import { RefreshCw, Zap } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshPricesButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [forceRefresh, setForceRefresh] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const refreshAllPrices = trpc.refreshAllWatchlistPrices.useMutation({
    onSuccess: (result) => {
      const { updated, skipped, message } = result
      
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      
      toast({
        title: "Price Refresh Complete",
        description: message || `Updated ${updated.length} stocks, ${skipped} were already fresh`,
        duration: 4000,
      })
    },
    onError: () => {
      toast({
        title: "Price Refresh Failed",
        description: "Unable to refresh prices. Check your API keys.",
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  const refreshFinancialData = trpc.refreshAllFinancialData.useMutation({
    onSuccess: (result) => {
      const { updated, skipped, message } = result
      
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      setIsRefreshing(false)
      
      toast({
        title: "Financial Data Refresh Complete",
        description: message || `Updated ${updated.length} stocks, ${skipped} were already fresh`,
        duration: 4000,
      })
    },
    onError: () => {
      setIsRefreshing(false)
      toast({
        title: "Financial Data Refresh Failed",
        description: "Unable to refresh financial data. Check your API keys.",
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  const handleRefresh = async (force = false) => {
    setIsRefreshing(true)
    setForceRefresh(force)
    
    try {
      // First refresh prices (fast) with cache logic
      await refreshAllPrices.mutateAsync({ forceRefresh: force })
      // Then refresh financial data (slower) with cache logic
      await refreshFinancialData.mutateAsync({ forceRefresh: force })
    } catch (error) {
      setIsRefreshing(false)
    }
  }

  const handleSmartRefresh = () => handleRefresh(false)
  const handleForceRefresh = () => handleRefresh(true)

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleSmartRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing && !forceRefresh ? 'animate-spin' : ''}`} />
        {isRefreshing && !forceRefresh ? 'Smart Refreshing...' : 'Smart Refresh'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleForceRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1 px-3"
        title="Force refresh all data regardless of cache"
      >
        <Zap className={`h-3 w-3 ${isRefreshing && forceRefresh ? 'animate-spin' : ''}`} />
        {isRefreshing && forceRefresh ? 'Forcing...' : 'Force'}
      </Button>
    </div>
  )
}