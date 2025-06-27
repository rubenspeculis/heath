# Heath Monorepo

A comprehensive investment tracking and financial API client monorepo built with TypeScript.

## 📁 Project Structure

```
heath/
├── fmp-api-client/          # Financial Modeling Prep API client library
├── investment-tracker/      # Next.js investment tracking application
├── package.json            # Root workspace configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- SOPS (for encrypted environment variables)

### Installation
```bash
# Install all dependencies for all workspaces
npm install

# Decrypt environment variables using SOPS
npm run get-secrets

# Set up the database
npm run db:setup
```

### Development

#### Start the Investment Tracker
```bash
# From root
npm run dev

# Or specifically
npm run dev:tracker
```

#### Develop the API Client
```bash
npm run dev:api
```

## 📦 Workspaces

### @heath/fmp-api-client
A comprehensive TypeScript client for the Financial Modeling Prep API.

**Features:**
- Full TypeScript support with type definitions
- Rate limiting and error handling
- Comprehensive API coverage (quotes, financials, ratios, DCF, etc.)
- Built-in validation with Zod schemas
- Jest testing suite

**Scripts:**
```bash
npm run build:api       # Build the API client
npm run test --workspace=fmp-api-client  # Run tests
```

### investment-tracker
A modern Next.js application for tracking investment portfolios.

**Features:**
- Portfolio management and tracking
- Stock watchlist with real-time data
- Investment scoring and analysis
- Dark theme with glass morphism design
- TRPC for type-safe API calls
- Prisma database integration

**Scripts:**
```bash
npm run dev:tracker     # Start development server
npm run build:tracker   # Build for production
```

## 🛠 Available Scripts

### Root Level Commands
```bash
npm run dev             # Start investment tracker dev server
npm run build           # Build all workspaces
npm run test            # Run tests for all workspaces
npm run lint            # Lint all workspaces
npm run typecheck       # Type check all workspaces
npm run clean           # Clean build artifacts for all workspaces
npm run get-secrets     # Decrypt environment variables for all workspaces
npm run db:setup        # Set up Prisma database
npm run db:seed         # Seed the database
```

### Workspace-Specific Commands
```bash
# Investment Tracker
npm run dev:tracker     # Start development server
npm run build:tracker   # Build application
npm run lint --workspace=investment-tracker

# FMP API Client  
npm run dev:api         # Start development mode
npm run build:api       # Build library
npm run test --workspace=fmp-api-client
```

## 🔧 Development Workflow

1. **Install dependencies:** `npm install`
2. **Decrypt secrets:** `npm run get-secrets`
3. **Set up database:** `npm run db:setup`
4. **Start development:** `npm run dev` (starts investment-tracker)
5. **Make changes** to either workspace
6. **Build all:** `npm run build`
7. **Test all:** `npm run test`

## 📋 Dependencies

### Shared Dependencies
- TypeScript 5.x
- Node.js 18+

### Investment Tracker
- Next.js 15.x
- React 19.x
- TRPC 11.x
- Prisma 6.x
- Tailwind CSS 4.x
- Recharts 3.x

### FMP API Client
- Axios 1.x
- Zod 3.x
- Jest 29.x
- Rollup 4.x

## 🏗 Monorepo Structure

This monorepo uses npm workspaces to manage multiple packages:

- **Root `package.json`** defines workspaces and shared scripts
- **Each workspace** has its own `package.json` with specific dependencies
- **Shared dependencies** are hoisted to the root `node_modules`
- **Cross-workspace dependencies** use `file:../package-name` protocol

## 🔧 Environment Configuration

### SOPS Encrypted Secrets

This monorepo uses SOPS (Secrets OPerationS) for secure environment variable management:

1. **Install SOPS:**
   ```bash
   # macOS
   brew install sops
   
   # Or download from: https://github.com/mozilla/sops/releases
   ```

2. **Decrypt secrets:**
   ```bash
   # Decrypt all workspace secrets
   npm run get-secrets
   
   # Or decrypt individual workspace secrets
   npm run get-secrets --workspace=investment-tracker
   npm run get-secrets --workspace=fmp-api-client
   ```

3. **Required API Keys:**
   - **FMP API Key**: Sign up at [Financial Modeling Prep](https://financialmodelingprep.com/)
   - **Alpha Vantage Key** (optional): Sign up at [Alpha Vantage](https://www.alphavantage.co/)

### Encrypted Files Structure
```
investment-tracker/env.enc.yaml    # Investment tracker secrets
fmp-api-client/env.enc.yaml       # API client secrets  
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FMP_API_KEY` | Financial Modeling Prep API key | Yes |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key (fallback) | No |
| `DATABASE_URL` | Database connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `NEXTAUTH_URL` | NextAuth.js URL | No |

## 🔗 Inter-Package Dependencies

The investment-tracker depends on the fmp-api-client:

```json
{
  "dependencies": {
    "@heath/fmp-api-client": "file:../fmp-api-client"
  }
}
```

This allows the investment tracker to import and use the API client:

```typescript
import { FMPApiClient } from '@heath/fmp-api-client'

// API key is automatically loaded from environment variables
const client = new FMPApiClient({ 
  apiKey: process.env.FMP_API_KEY 
})
```

## 📝 License

MIT

## 🤝 Contributing

1. Make changes to the appropriate workspace
2. Run tests: `npm test`
3. Build all packages: `npm run build`
4. Submit a pull request