
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshPricesButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      // First refresh prices (fast) with smart cache logic
      await refreshAllPrices.mutateAsync()
      // Then refresh financial data (slower) with smart cache logic
      await refreshFinancialData.mutateAsync()
    } catch (error) {
      setIsRefreshing(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh All Data'}
    </Button>
  )
}