# Investment Tracker Documentation

A comprehensive TypeScript investment portfolio tracking and analysis application with sophisticated scoring algorithms and real-time financial data integration.

## Quick Start

```bash
# Install dependencies
npm install

# Decrypt environment variables
npm run get-secrets

# Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# Start development servers
npm run dev
```

## 📖 Documentation Index

### Core System Documentation
- **[System Architecture](./01-architecture.md)** - High-level system design, technology stack, and component relationships
- **[Data Model](./02-data-model.md)** - Database schema, entity relationships, and data constraints
- **[Investment Scoring Algorithm](./03-scoring-algorithm.md)** - Detailed explanation of the proprietary scoring engine

### Integration & Performance
- **[API Integration](./04-api-integration.md)** - Financial data sources, FMP API integration, and error handling
- **[Caching Strategy](./05-caching-strategy.md)** - Smart caching system for optimal performance and API usage
- **[tRPC API Reference](./06-trpc-api.md)** - Complete API endpoint documentation with examples

### Features & Usage
- **[Export System](./07-export-system.md)** - Data export formats, portfolio analytics, and reporting
- **[UI Components](./08-ui-components.md)** - Component architecture, state management, and visualization
- **[User Guide](./11-user-guide.md)** - Portfolio management workflows and feature usage

### Development
- **[Development Setup](./09-development-setup.md)** - Environment configuration, database setup, and tooling
- **[Testing Documentation](./10-testing.md)** - Unit tests, integration tests, and E2E testing strategy

## 🚀 Key Features

### Investment Analysis
- **Proprietary Scoring Engine** - Weighted scoring based on growth and quality metrics
- **Multi-dimensional Analysis** - Revenue growth, profitability, debt ratios, and operational efficiency
- **Customizable Weights** - Configure scoring algorithm parameters for different investment strategies
- **Percentile Rankings** - Compare stocks across your watchlist with statistical rankings

### Portfolio Management
- **Watchlist Tracking** - Monitor stocks with different status levels (WATCHING, OWNED, SOLD)
- **Real-time Price Updates** - Smart caching with configurable refresh intervals
- **Financial Data Enrichment** - Comprehensive financial metrics from Financial Modeling Prep API
- **Multi-currency Support** - Built-in exchange rate handling

### Data & Reporting
- **Multiple Export Formats** - CSV, JSON, and formatted summary reports
- **Interactive Charts** - Portfolio allocation, performance tracking, and trend analysis
- **Comprehensive Analytics** - Sector allocation, market cap distribution, and scoring distributions

## 🏗️ Technology Stack

### Frontend
- **React 19** with **TypeScript** for type-safe UI development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** + **shadcn/ui** for modern, accessible components
- **Recharts** for interactive data visualizations
- **Zustand** for efficient state management

### Backend
- **Express.js** server with **tRPC** for type-safe API development
- **Prisma ORM** with **SQLite** for reliable data persistence
- **Zod** for runtime validation and type checking

### Development & Testing
- **Vitest** for fast unit testing with jsdom
- **Playwright** for comprehensive E2E testing
- **TypeScript** throughout for end-to-end type safety

## 🔧 Architecture Highlights

### Client-Server Split
- **Frontend**: Vite-powered React SPA (port 3000)
- **Backend**: Express server with tRPC API layer (port 3001)
- **Development**: Concurrent development with hot reloading

### Type Safety
- **End-to-End TypeScript** from database to UI components
- **tRPC Integration** ensures API contracts are enforced at compile time
- **Prisma Generated Types** provide type-safe database operations

### Performance Optimizations
- **Smart Caching** - 2-hour price cache, 12-hour financial data cache
- **Selective Updates** - Only refresh stale data to minimize API calls
- **Efficient Queries** - Optimized database queries with proper indexing

## 🔐 Security & Environment

### Environment Management
- **SOPS Encryption** for secure environment variable storage
- **API Key Management** - Secure handling of financial data provider credentials
- **Development vs Production** - Separate configurations for different environments

### Data Security
- **Input Validation** - Comprehensive validation using Zod schemas
- **Error Handling** - Graceful error handling without exposing sensitive information
- **API Rate Limiting** - Intelligent API usage to stay within provider limits

## 📊 Investment Scoring Details

The proprietary scoring algorithm evaluates stocks across multiple dimensions:

### Growth Metrics (50% weight by default)
- Revenue Growth Rate (3-year trend analysis)
- Earnings Per Share (EPS) Growth
- Free Cash Flow Growth
- Book Value Growth

### Quality Metrics (50% weight by default)
- Return on Invested Capital (ROIC)
- Net Margin and Operating Margin
- Debt-to-Equity Ratio
- Current Ratio (liquidity assessment)

### Scoring Process
1. **Normalization** - Convert raw metrics to 0-100 scale using statistical methods
2. **Weighting** - Apply configurable weights based on investment strategy
3. **Aggregation** - Combine weighted scores into final investment score
4. **Ranking** - Generate percentile rankings across your portfolio

## 🔗 External Integrations

### Financial Modeling Prep (FMP) API
- **Real-time Quotes** - Current stock prices and market data
- **Financial Statements** - Income statements, balance sheets, cash flow statements
- **Company Information** - Sector classification, market capitalization, company profiles
- **Symbol Search** - Dynamic stock symbol lookup and validation

### Data Processing
- **Symbol Normalization** - Handle different ticker formats across markets
- **Currency Conversion** - Multi-currency support with exchange rates
- **Data Validation** - Comprehensive validation of external data sources

## 📈 Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd investment-tracker
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Decrypt environment variables
   npm run get-secrets
   
   # Verify .env file contains required keys:
   # FMP_API_KEY, FMP_DATA_KEY, DATABASE_URL, ALPHA_VANTAGE_API_KEY
   ```

3. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

Visit `http://localhost:3000` to access the application. The backend API runs on `http://localhost:3001`.

## 🤝 Contributing

This documentation provides comprehensive guidance for:
- Understanding the system architecture
- Implementing new features
- Modifying the scoring algorithm
- Adding new data sources
- Extending the UI components

Refer to the specific documentation sections for detailed implementation guidance and best practices.