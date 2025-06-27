import { TRPCProvider } from './lib/trpc-client-new'
import { Dashboard } from './components/dashboard'

function App() {
  return (
    <TRPCProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Dashboard />
      </div>
    </TRPCProvider>
  )
}

export default App