# FMP API Client

A comprehensive, production-ready TypeScript client for the [Financial Modeling Prep API](https://financialmodelingprep.com/). This package provides type-safe access to real-time financial data, historical prices, company information, financial statements, ratios, DCF analysis, and much more.

## Features

- 🚀 **Complete API Coverage** - Access to all major FMP API endpoints
- 📊 **Real-time Financial Data** - Live quotes, prices, and market data
- 🏢 **Company Information** - Profiles, executives, news, and corporate data
- 📈 **Financial Statements** - Income statements, balance sheets, cash flow statements
- 🔢 **Financial Ratios** - Comprehensive ratio analysis and key metrics
- 💰 **DCF Analysis** - Discounted cash flow valuations and WACC calculations
- 📅 **Historical Data** - Historical prices, market data, and time series
- ⚡ **Rate Limiting** - Built-in rate limiting with retry logic
- 🛡️ **Error Handling** - Comprehensive error handling and custom error types
- 📝 **Full TypeScript Support** - Complete type definitions for all API responses
- 🔧 **Configurable** - Flexible configuration options
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install fmp-api-client
```

## Quick Start

```typescript
import { FMPApiClient } from 'fmp-api-client';

// Initialize the client
const client = new FMPApiClient({
  apiKey: 'your-api-key-here'
});

// Get real-time quote
const quote = await client.quotes.getRealTimeQuote('AAPL');
console.log('Apple stock price:', quote.price);

// Get company profile
const profile = await client.companies.getProfile('AAPL');
console.log('Company name:', profile.companyName);

// Get financial statements
const statements = await client.financialStatements.getIncomeStatements('AAPL');
console.log('Revenue:', statements[0].revenue);

// Get comprehensive analysis
const analysis = await client.getComprehensiveStockAnalysis('AAPL', {
  includeHistorical: true,
  includeDCF: true,
  includeRatios: true
});
console.log('Complete analysis:', analysis);
```

## Configuration

```typescript
const client = new FMPApiClient({
  apiKey: 'your-api-key',
  baseURL: 'https://financialmodelingprep.com/api/v3', // Optional, uses default
  timeout: 10000, // Request timeout in milliseconds
  retryAttempts: 3, // Number of retry attempts
  retryDelay: 1000, // Delay between retries
  rateLimit: {
    requestsPerMinute: 300, // API rate limit
    burst: 10 // Burst capacity
  },
  enableLogging: false // Enable request/response logging
});
```

## Services Overview

### Quotes Service

Access real-time and historical price data:

```typescript
// Real-time quotes
const quote = await client.quotes.getRealTimeQuote('AAPL');
const quotes = await client.quotes.getRealTimeQuotes(['AAPL', 'GOOGL', 'MSFT']);

// Historical prices
const historical = await client.quotes.getHistoricalPrices('AAPL', {
  from: '2023-01-01',
  to: '2023-12-31'
});

// Intraday data
const intraday = await client.quotes.getIntradayPrices('AAPL', '1min');

// Market data
const gainers = await client.quotes.getTopGainers();
const losers = await client.quotes.getTopLosers();
const active = await client.quotes.getMostActiveStocks();
```

### Company Service

Get comprehensive company information:

```typescript
// Company search
const searchResults = await client.companies.searchCompanies('Apple');

// Company profile
const profile = await client.companies.getProfile('AAPL');

// Key executives
const executives = await client.companies.getKeyExecutives('AAPL');

// Company news
const news = await client.companies.getStockNews('AAPL', { limit: 10 });

// Insider trading
const insiderTrades = await client.companies.getInsiderTrades('AAPL');
```

### Financial Statements Service

Access detailed financial statements:

```typescript
// Income statements
const incomeStatements = await client.financialStatements.getIncomeStatements('AAPL', {
  period: 'annual',
  limit: 5
});

// Balance sheet
const balanceSheets = await client.financialStatements.getBalanceSheetStatements('AAPL');

// Cash flow statements
const cashFlows = await client.financialStatements.getCashFlowStatements('AAPL');

// Complete financial picture
const complete = await client.financialStatements.getCompleteFinancialStatements('AAPL');
```

### Ratios Service

Analyze financial ratios and metrics:

```typescript
// Financial ratios
const ratios = await client.ratios.getFinancialRatios('AAPL');

// Key metrics
const keyMetrics = await client.ratios.getKeyMetrics('AAPL');

// TTM ratios
const ttmRatios = await client.ratios.getTTMRatios('AAPL');

// Financial scores (Altman Z-Score, Piotroski Score)
const score = await client.ratios.getFinancialScore('AAPL');

// Comprehensive ratio analysis
const comprehensive = await client.ratios.getComprehensiveRatios('AAPL');
```

### DCF Service

Perform discounted cash flow analysis:

```typescript
// Basic DCF valuation
const dcf = await client.dcf.getDCFValuation('AAPL');

// Advanced DCF with projections
const advancedDCF = await client.dcf.getAdvancedDCF('AAPL');

// WACC calculation
const wacc = await client.dcf.getWACC('AAPL');

// DCF sensitivity analysis
const sensitivity = await client.dcf.getDCFSensitivityAnalysis('AAPL');

// Comprehensive DCF analysis
const comprehensiveDCF = await client.dcf.getComprehensiveDCFAnalysis('AAPL');
```

### Historical Service

Access historical data across asset classes:

```typescript
// Historical stock prices
const prices = await client.historical.getHistoricalDailyPrices('AAPL', {
  from: '2023-01-01',
  to: '2023-12-31'
});

// Historical market cap
const marketCap = await client.historical.getHistoricalMarketCap('AAPL');

// Historical dividends
const dividends = await client.historical.getHistoricalDividends('AAPL');

// Index data
const sp500 = await client.historical.getHistoricalIndexPrices('^GSPC');

// Cryptocurrency data
const bitcoin = await client.historical.getHistoricalCryptoPrices('BTCUSD');

// Forex data
const eurusd = await client.historical.getHistoricalForexRates('EURUSD');
```

## High-Level Methods

The client provides convenient high-level methods for common use cases:

### Comprehensive Stock Analysis

```typescript
const analysis = await client.getComprehensiveStockAnalysis('AAPL', {
  includeHistorical: true,
  historicalPeriod: 365,
  includeDCF: true,
  includeRatios: true
});

console.log(analysis.summary.recommendation); // 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'
```

### Market Overview

```typescript
const market = await client.getMarketOverview();
console.log(market.topGainers);
console.log(market.marketStatus);
```

### Stock Search

```typescript
const results = await client.searchStocks('Apple', 5);
console.log(results); // Array of stocks with basic data
```

### Stock Comparison

```typescript
const comparison = await client.compareStocks(['AAPL', 'GOOGL', 'MSFT']);
console.log(comparison.comparison); // Side-by-side comparison
```

## Error Handling

The client provides comprehensive error handling with custom error types:

```typescript
import { FMPApiClient, FMPAuthenticationError, FMPRateLimitError } from 'fmp-api-client';

try {
  const quote = await client.quotes.getRealTimeQuote('AAPL');
} catch (error) {
  if (error instanceof FMPAuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof FMPRateLimitError) {
    console.error('Rate limit exceeded');
  } else {
    console.error('Other error:', error.message);
  }
}
```

## Rate Limiting

The client includes built-in rate limiting to respect API limits:

```typescript
const client = new FMPApiClient({
  apiKey: 'your-api-key',
  rateLimit: {
    requestsPerMinute: 300, // Adjust based on your API plan
    burst: 10 // Number of requests that can be made in quick succession
  }
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  CompanyProfile, 
  IncomeStatement, 
  DCFValuation,
  FinancialRatios 
} from 'fmp-api-client';

const profile: CompanyProfile = await client.companies.getProfile('AAPL');
const income: IncomeStatement[] = await client.financialStatements.getIncomeStatements('AAPL');
```

## Health Check

Monitor API connectivity:

```typescript
const health = await client.healthCheck();
console.log('API Status:', health.status); // 'healthy' | 'unhealthy'
console.log('Response Time:', health.responseTime); // milliseconds
```

## Configuration Updates

Update configuration at runtime:

```typescript
// Update configuration
client.updateConfig({
  timeout: 15000,
  retryAttempts: 5
});

// Get current configuration
const config = client.getConfig();
```

## Environment Variables

You can also configure the client using environment variables:

```bash
FMP_API_KEY=your-api-key
FMP_BASE_URL=https://financialmodelingprep.com/api/v3
FMP_TIMEOUT=10000
FMP_RETRY_ATTEMPTS=3
FMP_ENABLE_LOGGING=true
```

## API Documentation

For detailed API documentation, visit [Financial Modeling Prep API Documentation](https://site.financialmodelingprep.com/developer/docs).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests to the repository.

## Support

For issues and questions:
- GitHub Issues: [Repository Issues](https://github.com/your-repo/fmp-api-client/issues)
- API Documentation: [FMP API Docs](https://site.financialmodelingprep.com/developer/docs)

---

Built with ❤️ by [Otivo Labs](https://github.com/otivo-labs)