
import { useState } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc-client-new'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStockDialog({ open, onOpenChange }: AddStockDialogProps) {
  const [step, setStep] = useState<'search' | 'details'>('search')
  const [ticker, setTicker] = useState('')
  const [stockName, setStockName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [sector, setSector] = useState('')
  const [exchange, setExchange] = useState('')
  const [status, setStatus] = useState<'WATCHING' | 'OWNED'>('WATCHING')
  const [quantity, setQuantity] = useState('')
  const [avgPrice, setAvgPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const utils = trpc.useUtils()
  
  const addStock = trpc.addStock.useMutation({
    onSuccess: (newStock) => {
      // Add to watchlist after creating stock
      addToWatchlist.mutate({
        stockId: newStock.id,
        status,
        quantity: quantity ? parseFloat(quantity) : undefined,
        avgPrice: avgPrice ? parseFloat(avgPrice) : undefined,
        notes: notes || undefined,
      })
    },
  })

  const addToWatchlist = trpc.addToWatchlist.useMutation({
    onSuccess: () => {
      utils.getWatchlist.invalidate()
      utils.getStocks.invalidate()
      resetForm()
      onOpenChange(false)
    },
  })

  const resetForm = () => {
    setStep('search')
    setTicker('')
    setStockName('')
    setCurrency('USD')
    setSector('')
    setExchange('')
    setStatus('WATCHING')
    setQuantity('')
    setAvgPrice('')
    setNotes('')
  }

  const handleSearch = async () => {
    if (ticker.trim()) {
      setIsSearching(true)
      try {
        // Search for the ticker using the FMP API
        const searchResults = await utils.client.searchSymbols.query({ query: ticker.trim() })
        
        if (searchResults && searchResults.length > 0) {
          const result = searchResults[0]
          setStockName(result.name)
          setCurrency(result.currency || 'USD')
          setTicker(result.ticker.toUpperCase())
          setStep('details')
        } else {
          // If no results found, still allow manual entry
          setTicker(ticker.toUpperCase())
          setStockName(`${ticker.toUpperCase()} Corporation`)
          setStep('details')
        }
      } catch (error) {
        console.error('Error searching for ticker:', error)
        // Fallback to manual entry
        setTicker(ticker.toUpperCase())
        setStockName(`${ticker.toUpperCase()} Corporation`)
        setStep('details')
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleSubmit = () => {
    if (!ticker || !stockName) return

    addStock.mutate({
      ticker: ticker.toUpperCase(),
      name: stockName,
      currency,
      sector: sector || undefined,
      exchange: exchange || undefined,
    })
  }

  const isLoading = addStock.isPending || addToWatchlist.isPending

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Stock to Portfolio</DialogTitle>
          <DialogDescription>
            {step === 'search' 
              ? 'Search for a stock ticker to add to your watchlist or portfolio'
              : 'Configure the stock details and position information'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'search' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Stock Ticker</Label>
              <div className="flex gap-2">
                <Input
                  id="ticker"
                  placeholder="e.g., AAPL, MSFT, GOOGL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!ticker.trim() || isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticker-display">Ticker</Label>
                <Input
                  id="ticker-display"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-name">Company Name</Label>
              <Input
                id="stock-name"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  placeholder="e.g., Technology"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Input
                  id="exchange"
                  placeholder="e.g., NASDAQ"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Position Status</Label>
              <Select value={status} onValueChange={(value: 'WATCHING' | 'OWNED') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WATCHING">Watching</SelectItem>
                  <SelectItem value="OWNED">Owned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === 'OWNED' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg-price">Average Price</Label>
                  <Input
                    id="avg-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Investment thesis, reminders, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'search' ? (
            <Button onClick={handleSearch} disabled={!ticker.trim() || isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!ticker || !stockName || isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}