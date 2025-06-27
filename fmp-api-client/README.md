# FMP API Client

A comprehensive TypeScript client for the Financial Modeling Prep API.

## Features

- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions
- 🚀 **Production-ready**: Built-in error handling, retry logic, and rate limiting
- 📊 **Comprehensive**: Covers all major FMP API endpoints
- 🧪 **Well-tested**: Extensive unit and integration test coverage
- 📚 **Well-documented**: Complete API documentation and examples

## Installation

```bash
npm install @heath/fmp-api-client
```

## Quick Start

```typescript
import { FMPClient } from '@heath/fmp-api-client';

const fmp = new FMPClient({
  apiKey: 'your-fmp-api-key',
});

// Get company profile
const profile = await fmp.company.getProfile('AAPL');

// Get real-time quote
const quote = await fmp.quotes.getRealTimeQuote('AAPL');

// Get financial statements
const incomeStatement = await fmp.financials.getIncomeStatement('AAPL');
```

## API Coverage

- ✅ Company profiles and search
- ✅ Real-time and historical quotes
- ✅ Financial statements (Income, Balance Sheet, Cash Flow)
- ✅ Financial ratios and metrics
- ✅ DCF (Discounted Cash Flow) analysis
- ✅ Market data and indices
- ✅ Bulk data operations

## Documentation

See the [API Documentation](./docs/API.md) for detailed usage instructions.

## License

MIT