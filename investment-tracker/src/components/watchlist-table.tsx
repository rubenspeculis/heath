'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { EditWatchlistDialog } from '@/components/edit-watchlist-dialog'

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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const utils = trpc.useUtils()
  const removeFromWatchlist = trpc.removeFromWatchlist.useMutation({
    onSuccess: () => {
      utils.getWatchlist.invalidate()
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
        return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm">Owned</Badge>
      case 'WATCHING':
        return <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">Watching</Badge>
      case 'SOLD':
        return <Badge variant="outline" className="text-slate-600 border-slate-300">Sold</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="font-bold text-white/90">Stock</TableHead>
            <TableHead className="font-bold text-white/90">Status</TableHead>
            <TableHead className="font-bold text-white/90">Price</TableHead>
            <TableHead className="font-bold text-white/90">Exchange</TableHead>
            <TableHead className="font-bold text-white/90">Quantity</TableHead>
            <TableHead className="font-bold text-white/90">Avg Cost</TableHead>
            <TableHead className="font-bold text-white/90">Market Value</TableHead>
            <TableHead className="font-bold text-white/90">Gain/Loss</TableHead>
            <TableHead className="font-bold text-white/90">Sector</TableHead>
            <TableHead className="w-12"></TableHead>
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
              <TableRow key={item.id} className="hover:bg-white/5 border-white/10 transition-colors duration-300 group">
                <TableCell>
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-200 transition-colors">{item.stock.ticker}</div>
                    <div className="text-sm text-white/60 truncate max-w-[200px] group-hover:text-white/80 transition-colors">
                      {item.stock.name}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                
                <TableCell>
                  {item.stock.price ? 
                    formatCurrency(item.stock.price, item.stock.currency) : 
                    <span className="text-gray-400">-</span>
                  }
                </TableCell>
                
                <TableCell>
                  {item.stock.exchange ? (
                    <Badge variant="outline" className="text-xs">
                      {item.stock.exchange}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {item.quantity ? 
                    item.quantity.toLocaleString() : 
                    <span className="text-gray-400">-</span>
                  }
                </TableCell>
                
                <TableCell>
                  {item.avgPrice ? 
                    formatCurrency(item.avgPrice, item.stock.currency) : 
                    <span className="text-gray-400">-</span>
                  }
                </TableCell>
                
                <TableCell>
                  {marketValue ? 
                    formatCurrency(marketValue, item.stock.currency) : 
                    <span className="text-gray-400">-</span>
                  }
                </TableCell>
                
                <TableCell>
                  {gainLossData ? (
                    <div className="flex items-center gap-1">
                      {gainLossData.gainLoss >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <div className={gainLossData.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(Math.abs(gainLossData.gainLoss), item.stock.currency)}
                        <div className="text-xs">
                          ({gainLossData.gainLossPercent >= 0 ? '+' : ''}{gainLossData.gainLossPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {item.stock.sector ? (
                    <Badge variant="outline" className="text-xs">
                      {item.stock.sector}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => setEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Position
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => removeFromWatchlist.mutate({ id: item.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      {/* Sexy Dark Pagination Controls */}
      {data.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-6 px-6 py-4 bg-gradient-to-r from-black/40 to-slate-900/40 border-t border-white/10 rounded-b-3xl backdrop-blur-sm">
          <div className="text-sm text-white/80 font-semibold">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} stocks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm backdrop-blur-sm"
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
                      <span className="px-2 text-white/40">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === page 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                          : 'bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm'
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
              className="flex items-center gap-1 bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm backdrop-blur-sm"
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
    </div>
  )
}