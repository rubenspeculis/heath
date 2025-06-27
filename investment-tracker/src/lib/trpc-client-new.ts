'use client'

import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode, createElement } from 'react'
import type { AppRouter } from './trpc'

export const trpc = createTRPCReact<AppRouter>()

interface TRPCProviderProps {
  children: ReactNode
}

export function TRPCProvider(props: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  }))

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  )

  const TRPCProviderComponent = trpc.Provider
  
  return createElement(
    TRPCProviderComponent,
    { client: trpcClient, queryClient: queryClient },
    createElement(
      QueryClientProvider,
      { client: queryClient },
      props.children
    )
  )
}