import { useState } from 'react'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function EnrichStockDataButton() {
  const [isEnriching, setIsEnriching] = useState(false)
  const { toast } = useToast()
  const utils = trpc.useUtils()

  const enrichAllStockData = trpc.enrichAllStockData.useMutation({
    onSuccess: (result) => {
      const { updated, skipped, message } = result
      setIsEnriching(false)
      utils.getStocks.invalidate()
      utils.getWatchlist.invalidate()
      
      toast({
        title: "Stock Data Enrichment Complete",
        description: message || `Updated ${updated.length} stocks, ${skipped} were already complete and fresh`,
        duration: 4000,
      })
    },
    onError: (error) => {
      setIsEnriching(false)
      toast({
        title: "Error enriching stock data",
        description: error.message || "Failed to enrich stock data. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleEnrichData = () => {
    setIsEnriching(true)
    enrichAllStockData.mutate()
  }

  return (
    <Button
      onClick={handleEnrichData}
      disabled={isEnriching}
      variant="outline"
      className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10 backdrop-blur-sm text-white hover:text-white transition-all duration-300"
    >
      {isEnriching ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Enriching...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Enrich Data
        </>
      )}
    </Button>
  )
}