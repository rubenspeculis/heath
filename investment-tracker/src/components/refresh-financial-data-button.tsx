import { useState } from 'react'
import { Database, Loader2, Zap } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshFinancialDataButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [forceRefresh, setForceRefresh] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const refreshFinancialData = trpc.refreshAllFinancialData.useMutation({
    onMutate: () => {
      setIsRefreshing(true)
    },
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
        title: "Refresh Failed", 
        description: "Unable to refresh financial data. Check your API keys.",
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  const handleRefresh = (force = false) => {
    setForceRefresh(force)
    refreshFinancialData.mutate({ forceRefresh: force })
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
        {isRefreshing && !forceRefresh ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {isRefreshing && !forceRefresh ? 'Smart Refreshing...' : 'Smart Refresh Financial'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleForceRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1 px-3"
        title="Force refresh all financial data regardless of cache"
      >
        <Zap className={`h-3 w-3 ${isRefreshing && forceRefresh ? 'animate-spin' : ''}`} />
        {isRefreshing && forceRefresh ? 'Forcing...' : 'Force'}
      </Button>
    </div>
  )
}