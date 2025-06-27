import { useState } from 'react'
import { Database, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function RefreshFinancialDataButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const refreshFinancialData = trpc.refreshAllFinancialData.useMutation({
    onMutate: () => {
      setIsRefreshing(true)
    },
    onSuccess: (results) => {
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      setIsRefreshing(false)
      
      toast({
        title: "Financial Data Updated",
        description: `Successfully refreshed financial data for ${results.length} stocks`,
        duration: 3000,
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

  const handleRefresh = () => {
    refreshFinancialData.mutate()
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2"
    >
      {isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isRefreshing ? 'Fetching Financial Data...' : 'Refresh Financial Data'}
    </Button>
  )
}