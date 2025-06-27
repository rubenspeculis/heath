# Heath Monorepo Development Guide

## Architecture Overview

This monorepo consists of two main packages:

- **`investment-tracker`**: A React-based investment tracking application
- **`fmp-api-client`**: A TypeScript client for Financial Modeling Prep API

## Technology Stack

### Investment Tracker
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Radix UI components
- **State Management**: Zustand, tRPC React Query
- **API**: tRPC with Express backend
- **Database**: Prisma with SQLite
- **Testing**: Vitest, Testing Library, Playwright
- **Build**: Vite with optimized chunking

### FMP API Client
- **Language**: TypeScript
- **Build**: Vite library mode
- **HTTP**: Axios with rate limiting
- **Validation**: Zod schemas
- **Testing**: Vitest

## Quick Start

```bash
# Install dependencies
npm install

# Get secrets (requires sops)
npm run get-secrets

# Set up database
npm run db:setup

# Start development
npm run dev

# Run tests
npm run test:run

# Build everything
npm run build
```

## Development Commands

### Monorepo Level
```bash
npm run dev              # Start investment tracker dev server
npm run build            # Build all packages
npm run test:run         # Run all tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests
npm run lint             # Lint all packages
npm run lint:fix         # Fix linting issues
npm run typecheck        # Type check all packages
npm run check:all        # Full CI check (typecheck + lint + test + build)
npm run ci               # Complete CI pipeline
```

### Investment Tracker Specific
```bash
npm run dev:tracker      # Development server
npm run build:tracker    # Production build
npm run test --workspace=investment-tracker
npm run test:e2e --workspace=investment-tracker
npm run db:setup         # Set up database
npm run db:seed          # Seed with sample data
```

### FMP API Client Specific
```bash
npm run dev:api          # Watch mode development
npm run build:api        # Library build
npm run test --workspace=fmp-api-client
```

## Testing Strategy

### Unit Tests
- **Framework**: Vitest with jsdom environment
- **Coverage**: Configured with v8 provider
- **Location**: `src/**/*.{test,spec}.{ts,tsx}`
- **Mocking**: Vi mocks for external dependencies

### Component Tests
- **Framework**: React Testing Library
- **Setup**: Custom render utilities with providers
- **Focus**: User interactions and component behavior

### E2E Tests
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Location**: `e2e/` directory
- **Focus**: Full user workflows

### Test Coverage Thresholds
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

## Project Structure

```
heath/
├── investment-tracker/          # Main application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities and services
│   │   ├── styles/              # Global styles
│   │   ├── test/                # Test utilities
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── server.ts            # Express server
│   ├── e2e/                     # E2E tests
│   ├── public/                  # Static assets
│   ├── prisma/                  # Database schema
│   └── dist/                    # Build output
├── fmp-api-client/              # API client library
│   ├── src/                     # Source code
│   ├── dist/                    # Build output
│   └── docs/                    # Documentation
└── package.json                 # Monorepo config
```

## Build & Deployment

### Development Build
```bash
npm run build:tracker
```
- Outputs to `investment-tracker/dist/`
- Includes source maps for debugging
- Development-optimized chunks

### Production Build
```bash
npm run build
```
- Optimized for production
- Tree-shaking enabled
- Compressed assets
- Chunked for optimal loading

### Build Analysis
The build process creates optimized chunks:
- **vendor**: React, React DOM
- **trpc**: tRPC client libraries
- **ui**: Radix UI components
- **main**: Application code

## Environment Setup

### Required Environment Variables
```bash
# Investment Tracker
FMP_API_KEY=your_fmp_api_key
DATABASE_URL=file:./dev.db

# Optional
PORT=3000
NODE_ENV=development
```

### Secrets Management
We use `sops` for encrypted environment files:
```bash
npm run get-secrets
```

## Code Quality

### ESLint Configuration
- TypeScript-aware rules
- React best practices
- Import/export validation
- Unused variable detection

### Prettier Integration
- Consistent code formatting
- Integrated with ESLint
- Auto-fix on save

### TypeScript
- Strict mode enabled
- Path mapping configured
- Proper type exports

## Performance Considerations

### Vite Optimizations
- Fast HMR in development
- Optimized production builds
- Dynamic imports for code splitting
- Tree-shaking for smaller bundles

### React Optimizations
- Lazy loading for heavy components
- React Query for data caching
- Optimized re-renders with proper memoization

### Bundle Size
- Chunk size warnings at 500KB
- Manual chunk configuration
- Dynamic imports for large dependencies

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   npm run clean && npm install
   npm run build
   ```

2. **Test Failures**
   ```bash
   npm run test:run -- --reporter=verbose
   ```

3. **Type Errors**
   ```bash
   npm run typecheck
   ```

4. **Database Issues**
   ```bash
   npm run db:setup
   ```

### Debug Mode
```bash
DEBUG=* npm run dev:tracker
```

## Contributing

1. **Code Standards**: Follow ESLint and Prettier configs
2. **Testing**: Write tests for new features
3. **Type Safety**: Maintain strict TypeScript usage
4. **Performance**: Consider bundle size and runtime performance
5. **Documentation**: Update this guide for architectural changes

## API Integration

The application integrates with Financial Modeling Prep API through our custom client:

### Features
- Rate limiting (5 requests/second)
- Comprehensive error handling
- TypeScript type safety
- Caching strategies
- Retry mechanisms

### Endpoints Used
- Real-time quotes
- Company profiles
- Financial statements
- Historical data
- Market data

## Database Schema

### Core Tables
- `Stock`: Company information and current prices
- `WatchlistItem`: User's tracked investments
- `FinancialData`: Historical financial metrics
- `MetricWeight`: Scoring configuration

### Migrations
```bash
npm run db:migrate
npm run db:push
```

## Monitoring & Observability

### Development
- Vite dev server with HMR
- React DevTools support
- Redux DevTools for state
- Network request logging

### Production
- Error boundaries for React crashes
- API error tracking
- Performance monitoring ready
- Build size analysis

This development setup provides a modern, type-safe, and well-tested foundation for financial application development.