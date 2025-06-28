# System Architecture

## Overview

The Investment Tracker is a full-stack TypeScript application built with a modern client-server architecture. It combines real-time financial data integration with sophisticated investment analysis algorithms to provide comprehensive portfolio management capabilities.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client (Port 3000)"
        UI[React 19 + TypeScript]
        Charts[Recharts Visualizations]
        State[Zustand State Management]
        Components[shadcn/ui Components]
    end
    
    subgraph "Server (Port 3001)"
        API[tRPC API Layer]
        Business[Business Logic]
        Cache[Cache Management]
        Validation[Zod Validation]
    end
    
    subgraph "Data Layer"
        DB[(SQLite Database)]
        Prisma[Prisma ORM]
    end
    
    subgraph "External APIs"
        FMP[Financial Modeling Prep]
        AV[Alpha Vantage]
    end
    
    UI --> API
    Charts --> State
    Components --> State
    API --> Business
    Business --> Cache
    Business --> Prisma
    Prisma --> DB
    Business --> FMP
    Business --> AV
    Cache --> FMP
    Cache --> AV
```

## Technology Stack

### Frontend Technologies

#### Core Framework
- **React 19**: Latest React with improved concurrent features and optimizations
- **TypeScript**: End-to-end type safety from API to UI components
- **Vite**: Fast development server with hot module replacement and optimized builds

#### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components built on Radix UI
- **Lucide React**: Beautiful, customizable SVG icons

#### State Management & Data Fetching
- **Zustand**: Lightweight, flexible state management for client-side state
- **TanStack Query (React Query)**: Powerful data synchronization and caching
- **tRPC Client**: Type-safe API client with automatic type inference

#### Data Visualization
- **Recharts**: Composable charting library built on D3.js
- **Custom Chart Components**: Portfolio allocation, performance tracking, trend analysis

### Backend Technologies

#### Server Framework
- **Express.js**: Fast, unopinionated web framework for Node.js
- **tRPC**: End-to-end type-safe APIs with automatic client generation
- **CORS**: Cross-origin resource sharing configuration for frontend integration

#### Data Layer
- **Prisma ORM**: Modern database toolkit with type-safe queries
- **SQLite**: Lightweight, file-based database for development and deployment
- **Database Migrations**: Version-controlled schema evolution

#### Validation & Security
- **Zod**: Runtime type validation and parsing
- **Input Sanitization**: Comprehensive input validation on all endpoints
- **Error Handling**: Structured error responses with proper HTTP status codes

### Development & Testing

#### Build Tools
- **TypeScript Compiler**: Strict type checking across the entire codebase
- **Vite**: Module bundling and development server
- **tsx**: TypeScript execution for server development

#### Testing Framework
- **Vitest**: Fast unit testing with jsdom for DOM simulation
- **Playwright**: End-to-end testing with real browser automation
- **Testing Library**: Component testing utilities for React

#### Code Quality
- **ESLint**: Linting and code style enforcement
- **TypeScript**: Compile-time error checking and IntelliSense
- **Prettier**: Code formatting (configurable)

## Application Flow

### Development Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Vite as Vite Dev Server
    participant Express as Express Server
    participant DB as SQLite Database
    participant FMP as FMP API
    
    Dev->>Vite: npm run dev
    Dev->>Express: npm run dev:server
    
    Note over Vite, Express: Concurrent development
    
    Vite->>Express: API requests via tRPC
    Express->>DB: Prisma queries
    Express->>FMP: Financial data requests
    FMP-->>Express: Market data response
    DB-->>Express: Query results
    Express-->>Vite: tRPC response
    Vite-->>Dev: Hot reload updates
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Dashboard[Dashboard]
        WatchlistTable[Watchlist Table]
        Charts[Portfolio Charts]
        Dialogs[Action Dialogs]
    end
    
    subgraph "State Management"
        QueryCache[TanStack Query Cache]
        ZustandStore[Zustand Store]
    end
    
    subgraph "API Layer"
        tRPCClient[tRPC Client]
        tRPCServer[tRPC Server]
    end
    
    subgraph "Business Logic"
        StockService[Stock Operations]
        WatchlistService[Watchlist Management]
        ScoringEngine[Investment Scoring]
        CacheManager[Cache Management]
    end
    
    subgraph "Data Sources"
        PrismaDB[Prisma + SQLite]
        FMPAPI[FMP API]
        AlphaVantage[Alpha Vantage API]
    end
    
    Dashboard --> QueryCache
    WatchlistTable --> QueryCache
    Charts --> ZustandStore
    Dialogs --> tRPCClient
    
    QueryCache --> tRPCClient
    ZustandStore --> tRPCClient
    tRPCClient --> tRPCServer
    
    tRPCServer --> StockService
    tRPCServer --> WatchlistService
    tRPCServer --> ScoringEngine
    
    StockService --> CacheManager
    WatchlistService --> PrismaDB
    ScoringEngine --> PrismaDB
    CacheManager --> FMPAPI
    CacheManager --> AlphaVantage
```

## Component Architecture

### Client-Side Architecture

#### Component Hierarchy
```
App.tsx (Root)
├── tRPC Provider Setup
├── TanStack Query Provider
└── Dashboard.tsx (Main Interface)
    ├── Tabs Navigation
    ├── WatchlistTable.tsx (Portfolio Management)
    │   ├── Stock Rows
    │   ├── Action Buttons
    │   └── Status Indicators
    ├── PortfolioCharts.tsx (Visualizations)
    │   ├── Allocation Charts
    │   ├── Performance Graphs
    │   └── Trend Analysis
    └── Action Dialogs
        ├── AddStockDialog.tsx
        ├── EditWatchlistDialog.tsx
        └── StockDetailDialog.tsx
```

#### State Management Pattern
- **Server State**: Managed by TanStack Query with automatic caching and revalidation
- **UI State**: Local component state for form inputs and UI interactions
- **Global State**: Zustand for cross-component state sharing (minimal usage)

### Server-Side Architecture

#### API Layer Structure
```
server.ts (Express App)
├── CORS Configuration
├── tRPC Middleware
└── Router Mounting

trpc.ts (API Router)
├── Stock Operations
│   ├── CRUD operations
│   ├── Search functionality
│   └── Data enrichment
├── Watchlist Management
│   ├── Add/Remove items
│   ├── Status updates
│   └── Portfolio queries
├── Financial Data
│   ├── Price updates
│   ├── Financial metrics
│   └── Company information
└── Export Operations
    ├── CSV generation
    ├── JSON export
    └── Summary reports
```

## Database Architecture

### Entity Relationship Model

```mermaid
erDiagram
    Stock ||--o{ WatchlistItem : "tracked in"
    Stock ||--o{ FinancialData : "has metrics"
    MetricWeight }|--|| Stock : "affects scoring"
    ExchangeRate }|--|| Stock : "currency conversion"
    ApiKey }|--|| Stock : "data access"
    
    Stock {
        string id PK
        string ticker UK
        string name
        decimal price
        string sector
        decimal marketCap
        datetime updatedAt
    }
    
    WatchlistItem {
        string id PK
        string stockId FK
        decimal quantity
        decimal averagePrice
        enum status
        datetime createdAt
    }
    
    FinancialData {
        string id PK
        string stockId FK
        string period
        decimal revenue
        decimal netIncome
        decimal freeCashFlow
        datetime updatedAt
    }
    
    MetricWeight {
        string id PK
        string metricName UK
        decimal weight
        datetime updatedAt
    }
```

### Data Persistence Strategy

#### Database Configuration
- **SQLite**: Single-file database for simplified deployment
- **Prisma Schema**: Declarative schema definition with migrations
- **Connection Pooling**: Efficient connection management
- **Transaction Support**: ACID compliance for data integrity

#### Migration Strategy
- **Schema Evolution**: Version-controlled database changes
- **Seed Data**: Initial data setup for development and testing
- **Backup Strategy**: Regular database backups for production

## Security Architecture

### API Security

#### Input Validation
- **Zod Schemas**: Runtime validation for all API inputs
- **Type Coercion**: Safe type conversion with validation
- **SQL Injection Prevention**: Parameterized queries via Prisma

#### Error Handling
- **Structured Errors**: Consistent error response format
- **Sensitive Data Protection**: No stack traces or internal details in production
- **Rate Limiting**: API usage limits to prevent abuse

### Environment Security

#### Secret Management
- **SOPS Encryption**: Encrypted environment variable storage
- **API Key Protection**: Secure handling of third-party credentials
- **Environment Separation**: Different configurations for dev/staging/production

## Performance Optimization

### Caching Strategy

#### Client-Side Caching
- **TanStack Query**: Automatic request caching and deduplication
- **Stale-While-Revalidate**: Background data updates for fresh content
- **Cache Invalidation**: Smart cache updates on mutations

#### Server-Side Caching
- **Smart Cache Logic**: Time-based cache invalidation
- **API Rate Limiting**: Efficient external API usage
- **Database Query Optimization**: Indexed queries and eager loading

### Build Optimization

#### Frontend Optimization
- **Code Splitting**: Lazy loading of components and routes
- **Tree Shaking**: Removal of unused code
- **Asset Optimization**: Image and font optimization

#### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Memory Management**: Optimal memory usage patterns

## Deployment Architecture

### Development Environment
- **Concurrent Servers**: Frontend and backend running simultaneously
- **Hot Reloading**: Instant development feedback
- **Database Seeding**: Consistent development data

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database Migrations**: Safe schema updates
- **Health Checks**: Application monitoring and alerting
- **Logging**: Comprehensive application logging

## Integration Points

### External API Integration

#### Financial Modeling Prep (FMP)
- **Real-time Quotes**: Current stock prices and market data
- **Financial Statements**: Comprehensive company financials
- **Company Profiles**: Business information and sector data

#### Alpha Vantage
- **Exchange Rates**: Currency conversion data
- **Alternative Data**: Additional financial metrics

### Data Processing Pipeline
- **Symbol Normalization**: Consistent ticker symbol handling
- **Data Validation**: Comprehensive validation of external data
- **Error Recovery**: Graceful handling of API failures
- **Rate Limiting**: Respect for API usage limits