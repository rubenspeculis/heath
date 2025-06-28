
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshAllDataButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const refreshAllPrices = trpc.refreshAllWatchlistPrices.useMutation()
  const refreshFinancialData = trpc.refreshAllFinancialData.useMutation()
  const enrichAllStockData = trpc.enrichAllStockData.useMutation()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      const results = await Promise.allSettled([
        refreshAllPrices.mutateAsync(),
        refreshFinancialData.mutateAsync(), 
        enrichAllStockData.mutateAsync()
      ])

      // Process results and create summary
      const priceResult = results[0].status === 'fulfilled' ? results[0].value : null
      const financialResult = results[1].status === 'fulfilled' ? results[1].value : null
      const enrichResult = results[2].status === 'fulfilled' ? results[2].value : null

      // Count totals
      const totalUpdated = (priceResult?.updated.length || 0) + 
                          (financialResult?.updated.length || 0) + 
                          (enrichResult?.updated.length || 0)
      
      const totalSkipped = (priceResult?.skipped || 0) + 
                          (financialResult?.skipped || 0) + 
                          (enrichResult?.skipped || 0)

      // Check for any errors
      const errors = results.filter(r => r.status === 'rejected')
      
      // Invalidate caches
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      
      if (errors.length > 0) {
        toast({
          title: "Refresh Partially Failed",
          description: `Updated ${totalUpdated} items, but ${errors.length} operations failed. Check your API keys.`,
          variant: "destructive",
          duration: 5000,
        })
      } else {
        toast({
          title: "All Data Refreshed",
          description: `Smart refresh complete: Updated ${totalUpdated} items, ${totalSkipped} were already fresh`,
          duration: 4000,
        })
      }
      
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Check your API keys and connection.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
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
      {isRefreshing ? 'Refreshing All Data...' : 'Refresh All Data'}
    </Button>
  )
}

// Export alias for backward compatibility
export { RefreshAllDataButton as RefreshPricesButton }