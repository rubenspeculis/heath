# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start both client (Vite) and server (Express) concurrently
- `npm run dev:client` - Start only the Vite frontend (port 3000)
- `npm run dev:server` - Start only the Express backend (port 3001)
- `npm run build` - Build production bundle
- `npm run typecheck` - Run TypeScript type checking
- `npm run get-secrets` - Decrypt environment variables from sops

### Testing
- `npm run test` - Run Vitest unit tests in watch mode
- `npm run test:run` - Run unit tests once
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI

### Database Operations
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## Architecture Overview

This is a full-stack TypeScript investment tracking application with a **client-server split architecture**:

- **Frontend**: React 19 + Vite SPA on port 3000
- **Backend**: Express server with tRPC API on port 3001
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand for client state
- **UI**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization

## Key Technical Concepts

### tRPC API Layer
The entire API is built with tRPC (`src/lib/trpc.ts`) providing end-to-end type safety. All database operations, external API calls, and business logic are handled through tRPC procedures.

### Investment Scoring Engine
Core algorithmic component in `src/lib/scoring.ts` that calculates weighted investment scores based on financial metrics. Uses configurable weights stored in the `MetricWeight` database table.

### Financial Data Integration
External financial data comes through Financial Modeling Prep API via a custom client (`@heath/fmp-api-client` local package). The `src/lib/fmp-financial-api.ts` handles all external API interactions.

### Database Schema
Six main entities:
- `Stock` - Core stock information
- `WatchlistItem` - User portfolio positions with status (WATCHING/OWNED/SOLD)
- `FinancialData` - Comprehensive financial metrics per stock
- `MetricWeight` - Configurable scoring algorithm weights
- `ExchangeRate` - Multi-currency support
- `ApiKey` - Financial data provider credentials

### Component Structure
- `App.tsx` - Root component with tRPC provider setup
- `components/dashboard.tsx` - Main application interface with tabbed navigation
- `components/watchlist-table.tsx` - Primary portfolio management interface
- `components/ui/` - Complete shadcn/ui component library implementation

## Development Patterns

### Adding New Features
1. Define tRPC procedures in `src/lib/trpc.ts` for any API interactions
2. Use Prisma for database operations with proper TypeScript types
3. Follow shadcn/ui patterns for new UI components
4. Add corresponding unit tests in `*.test.ts` files

### Working with Financial Data
- All external API calls go through `src/lib/fmp-financial-api.ts`
- Financial metrics are stored in `FinancialData` table with proper normalization
- Use the scoring engine for any investment analysis features

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:push` for development or `npm run db:migrate` for production
4. Update seed data in `prisma/seed.ts` if needed

## Environment Variables

Environment variables are managed through SOPS encryption:
- Encrypted file: `env.enc.yaml`
- Decrypt with: `npm run get-secrets`
- Required variables: `FMP_API_KEY`, `FMP_DATA_KEY`, `DATABASE_URL`, `ALPHA_VANTAGE_API_KEY`