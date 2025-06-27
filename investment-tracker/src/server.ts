import express from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './lib/trpc'

const app = express()
const port = process.env.API_PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: () => ({})
}))

app.listen(port, () => {
  console.log(`🚀 API Server running on http://localhost:${port}`)
})