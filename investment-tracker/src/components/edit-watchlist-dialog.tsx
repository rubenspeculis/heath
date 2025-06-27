'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { trpc } from '@/lib/trpc-client-new'

interface EditWatchlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: string
    status: string
    quantity?: number | null
    avgPrice?: number | null
    notes?: string | null
    stock: {
      id: string
      ticker: string
      name: string
      currency: string
      sector?: string | null
      exchange?: string | null
    }
  }
}

export function EditWatchlistDialog({ open, onOpenChange, item }: EditWatchlistDialogProps) {
  const [formData, setFormData] = useState({
    // Watchlist item fields
    status: item.status,
    quantity: item.quantity?.toString() || '',
    avgPrice: item.avgPrice?.toString() || '',
    notes: item.notes || '',
    // Stock fields
    ticker: item.stock.ticker,
    name: item.stock.name,
    currency: item.stock.currency,
    sector: item.stock.sector || '',
    exchange: item.stock.exchange || '',
  })
  
  const utils = trpc.useUtils()
  
  const updateWatchlistItem = trpc.updateWatchlistItem.useMutation({
    onSuccess: () => {
      utils.getWatchlist.invalidate()
    },
  })
  
  const updateStock = trpc.updateStock.useMutation({
    onSuccess: () => {
      utils.getWatchlist.invalidate()
    },
  })

  const handleSave = async () => {
    try {
      // Update watchlist item
      await updateWatchlistItem.mutateAsync({
        id: item.id,
        status: formData.status as 'WATCHING' | 'OWNED' | 'SOLD',
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        avgPrice: formData.avgPrice ? parseFloat(formData.avgPrice) : undefined,
        notes: formData.notes || undefined,
      })
      
      // Update stock information
      await updateStock.mutateAsync({
        id: item.stock.id,
        ticker: formData.ticker,
        name: formData.name,
        currency: formData.currency,
        sector: formData.sector || undefined,
        exchange: formData.exchange || undefined,
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit {item.stock.ticker}</DialogTitle>
          <DialogDescription>
            Update the stock information and position details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Input
                id="exchange"
                value={formData.exchange}
                onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                placeholder="e.g., NASDAQ, NYSE, ASX"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WATCHING">Watching</SelectItem>
                <SelectItem value="OWNED">Owned</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Number of shares"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Average Price</Label>
              <Input
                id="avgPrice"
                type="number"
                step="0.01"
                value={formData.avgPrice}
                onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                placeholder="Cost per share"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateWatchlistItem.isPending || updateStock.isPending}
          >
            {updateWatchlistItem.isPending || updateStock.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}