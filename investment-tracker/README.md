# Investment Portfolio Tracker

A sophisticated web-based investment portfolio tracking and analysis application built with modern TypeScript technologies.

## Features

### 🏦 Portfolio Management
- **Multi-status tracking**: Track stocks as `WATCHING`, `OWNED`, or `SOLD`
- **Position management**: Record quantity, average price, and notes for each position
- **Real-time calculations**: Automatic gain/loss calculations and portfolio valuation
- **Multi-currency support**: Handle stocks in different currencies (USD, EUR, GBP, etc.)

### 📊 Advanced Analytics
- **Investment scoring algorithm**: Sophisticated scoring based on growth and quality metrics
- **Weighted scoring system**: Configurable weights for different financial metrics
- **Performance ranking**: Rank stocks by overall score, growth potential, and quality metrics
- **Portfolio visualization**: Interactive charts for allocation and performance analysis

### 📈 Visualizations
- **Portfolio allocation charts**: Pie charts showing investment distribution by value
- **Sector allocation**: Understand your portfolio diversification by sector
- **Performance tracking**: Bar charts showing gain/loss for each position
- **Responsive design**: Beautiful, mobile-first interface

### 🔄 Data Management
- **Financial API integration**: Support for Alpha Vantage and Financial Modeling Prep APIs
- **Real-time price updates**: Automatic stock price refreshing
- **Company search**: Search and add stocks with auto-completion
- **Data persistence**: SQLite database for reliable data storage

### 📤 Export Capabilities
- **CSV export**: Full portfolio data in spreadsheet format
- **JSON export**: Machine-readable data export
- **Portfolio summary**: Detailed text report with analysis

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern, accessible UI components
- **Recharts**: Interactive data visualizations
- **Lucide React**: Beautiful icons

### Backend
- **tRPC**: End-to-end type safety for APIs
- **Prisma ORM**: Type-safe database access
- **SQLite**: Lightweight, serverless database
- **Zod**: Runtime type validation

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Stocks
1. Click the "Add Stock" button
2. Search for a ticker symbol (e.g., AAPL, MSFT)
3. Configure stock details and position information
4. Choose status: Watching or Owned
5. For owned positions, enter quantity and average price

### Viewing Analytics
- **Dashboard**: Overview of portfolio performance and key metrics
- **Charts**: Visual representation of allocation and performance
- **Table**: Detailed view of all positions with sorting and filtering

### Exporting Data
1. Click the "Export" dropdown
2. Choose format: CSV, JSON, or Summary
3. File will download automatically with timestamp

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Self-hosted
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## License

This project is licensed under the MIT License.
