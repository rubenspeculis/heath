
import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EditWatchlistDialog } from '@/components/edit-watchlist-dialog'
import { StockDetailDialog } from '@/components/stock-detail-dialog'

interface WatchlistTableProps {
  data: Array<{
    id: string
    status: string
    quantity?: number | null
    avgPrice?: number | null
    notes?: string | null
    stock: {
      id: string
      ticker: string
      name: string
      price?: number | null
      currency: string
      sector?: string | null
      exchange?: string | null
    }
  }>
  isLoading: boolean
}

export function WatchlistTable({ data, isLoading }: WatchlistTableProps) {
  const [editItem, setEditItem] = useState<typeof data[0] | null>(null)
  const [removeItem, setRemoveItem] = useState<typeof data[0] | null>(null)
  const [detailItem, setDetailItem] = useState<typeof data[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const removeFromWatchlist = trpc.removeFromWatchlist.useMutation({
    onSuccess: () => {
      utils.getWatchlist.invalidate()
      toast({
        title: "Stock removed",
        description: `${removeItem?.stock.ticker} has been removed from your watchlist.`,
      })
      setRemoveItem(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist. Please try again.",
        variant: "destructive",
      })
    },
  })

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OWNED':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm font-medium">Owned</Badge>
      case 'WATCHING':
        return <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm font-medium">Watching</Badge>
      case 'SOLD':
        return <Badge variant="outline" className="text-slate-400 border-slate-600 bg-slate-700/30 font-medium">Sold</Badge>
      default:
        return <Badge variant="secondary" className="bg-slate-700 text-slate-300 font-medium">{status}</Badge>
    }
  }

  const calculateGainLoss = (item: (typeof data)[0]) => {
    if (!item.quantity || !item.avgPrice || !item.stock.price) return null
    
    const currentValue = item.quantity * item.stock.price
    const costBasis = item.quantity * item.avgPrice
    const gainLoss = currentValue - costBasis
    const gainLossPercent = (gainLoss / costBasis) * 100

    return { gainLoss, gainLossPercent }
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading watchlist...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No stocks in your watchlist yet.</p>
        <p className="text-sm text-gray-500 mt-1">Add a stock to get started!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 bg-slate-800/80 hover:bg-slate-800">
            <TableHead className="font-bold text-slate-200 h-12 px-4">Stock</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Status</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Price</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Exchange</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Quantity</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Avg Cost</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Market Value</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Gain/Loss</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4">Sector</TableHead>
            <TableHead className="font-bold text-slate-200 h-12 px-4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item) => {
            const gainLossData = calculateGainLoss(item)
            const marketValue = item.quantity && item.stock.price ? 
              item.quantity * item.stock.price : null

            return (
              <TableRow key={item.id} className="hover:bg-slate-800/60 border-slate-700/30 transition-colors duration-300 group">
                <TableCell className="px-4 py-4">
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm">{item.stock.ticker}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[200px] group-hover:text-slate-300 transition-colors font-medium">
                      {item.stock.name}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {getStatusBadge(item.status)}
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {item.stock.price ? 
                    <span className="text-emerald-400 font-semibold text-sm">
                      {formatCurrency(item.stock.price, item.stock.currency)}
                    </span> : 
                    <span className="text-slate-500 text-sm">-</span>
                  }
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {item.stock.exchange ? (
                    <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                      {item.stock.exchange}
                    </Badge>
                  ) : (
                    <span className="text-slate-500 text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {item.quantity ? 
                    <span className="text-slate-200 font-medium text-sm">{item.quantity.toLocaleString()}</span> : 
                    <span className="text-slate-500 text-sm">-</span>
                  }
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {item.avgPrice ? 
                    <span className="text-slate-200 font-medium text-sm">
                      {formatCurrency(item.avgPrice, item.stock.currency)}
                    </span> : 
                    <span className="text-slate-500 text-sm">-</span>
                  }
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {marketValue ? 
                    <span className="text-blue-400 font-semibold text-sm">
                      {formatCurrency(marketValue, item.stock.currency)}
                    </span> : 
                    <span className="text-slate-500 text-sm">-</span>
                  }
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {gainLossData ? (
                    <div className="flex items-center gap-1">
                      {gainLossData.gainLoss >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <div className={gainLossData.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                        <div className="font-semibold text-sm">
                          {formatCurrency(Math.abs(gainLossData.gainLoss), item.stock.currency)}
                        </div>
                        <div className="text-xs font-medium">
                          ({gainLossData.gainLossPercent >= 0 ? '+' : ''}{gainLossData.gainLossPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  {item.stock.sector ? (
                    <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                      {item.stock.sector}
                    </Badge>
                  ) : (
                    <span className="text-slate-500 text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailItem(item)}
                      className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-all duration-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditItem(item)}
                      className="h-8 w-8 p-0 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200"
                      title="Edit Position"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemoveItem(item)}
                      className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                      title="Remove Stock"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      {/* Enhanced Pagination Controls */}
      {data.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-0 px-6 py-4 bg-slate-800/60 border-t border-slate-700/50 rounded-b-2xl backdrop-blur-sm">
          <div className="text-sm text-slate-300 font-medium">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} stocks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white shadow-sm transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(data.length / itemsPerPage)
                  if (totalPages <= 7) return true
                  if (page === 1 || page === totalPages) return true
                  if (Math.abs(page - currentPage) <= 1) return true
                  return false
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-slate-500">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 p-0 transition-all duration-200 ${
                        currentPage === page 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border-blue-500' 
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white shadow-sm'
                      }`}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => 
                Math.min(prev + 1, Math.ceil(data.length / itemsPerPage))
              )}
              disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
              className="flex items-center gap-1 bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white shadow-sm transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {editItem && (
        <EditWatchlistDialog 
          open={!!editItem} 
          onOpenChange={(open) => !open && setEditItem(null)}
          item={editItem}
        />
      )}

      {detailItem && (
        <StockDetailDialog
          open={!!detailItem}
          onOpenChange={(open) => !open && setDetailItem(null)}
          stockId={detailItem.stock.id}
          ticker={detailItem.stock.ticker}
        />
      )}

      <AlertDialog open={!!removeItem} onOpenChange={(open) => !open && setRemoveItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Stock</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {removeItem?.stock.ticker} ({removeItem?.stock.name}) from your watchlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeItem && removeFromWatchlist.mutate({ id: removeItem.id })}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}