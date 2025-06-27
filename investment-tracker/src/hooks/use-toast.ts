// Simple toast hook for now - you can replace with a full toast library later
import { useState, useCallback } from 'react'

interface Toast {
  title: string
  description: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((newToast: Toast) => {
    // For now, just log to console
    // In a full implementation, you'd show actual toast notifications
    console.log(`${newToast.variant === 'destructive' ? '❌' : '✅'} ${newToast.title}: ${newToast.description}`)
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, newToast.duration || 3000)
  }, [])

  return { toast }
}