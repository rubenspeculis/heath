'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshPricesButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const refreshAllPrices = trpc.refreshAllWatchlistPrices.useMutation({
    onMutate: () => {
      setIsRefreshing(true)
    },
    onSuccess: (results) => {
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      setIsRefreshing(false)
      
      toast({
        title: "Prices Updated",
        description: `Successfully refreshed prices for ${results.length} stocks`,
        duration: 3000,
      })
    },
    onError: (error) => {
      setIsRefreshing(false)
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh prices. Check your API keys.",
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  const handleRefresh = () => {
    refreshAllPrices.mutate()
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
    </Button>
  )
}