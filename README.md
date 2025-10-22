# Stock Price Watch

A modern, feature-rich web application for real-time stock price watch with advanced analytics, technical indicators, and customizable visualizations.

![Stock Price Watch](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## Features

### Core Functionality
- **Real-time Stock Quotes** - Live price updates with detailed market information
- **Interactive Charts** - Multiple timeframes (1D, 5D, 1M, 3M, 6M, 1Y, 5Y, MAX)
- **Technical Indicators** - RSI, MACD, Bollinger Bands, EMA, SMA
- **Volume Analysis** - Detailed volume charts with color-coded bars
- **Dark/Light Mode** - Seamless theme switching with persistent preferences

### Advanced Features
- **Watchlist Management** - Add/remove stocks with real-time updates
- **Stock Search** - Autocomplete search with trending stocks display
- **Trending Stocks** - Separate scrollable section showing top market movers
- **Market Heatmap** - Visual representation of sector performance
- **News Integration** - Dual-source news with automatic fallback (Finnhub → Alpha Vantage)
- **Smart Notifications** - Real-time alerts for news, price movements, and volume spikes
- **Technical Analysis** - Comprehensive indicator calculations and visualizations
- **Responsive Design** - Optimized for desktop, tablet, and mobile with sticky header

### Customization
- **Chart Settings** - Customize chart types, colors, and indicators
- **Data Persistence** - Watchlist and preferences saved locally
- **Multiple Layouts** - Flexible dashboard with tabbed interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, React-Chartjs-2, Lightweight Charts, Recharts
- **State Management**: Zustand (with persistence)
- **UI Components**: Custom components with shadcn/ui patterns
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Testing**: TSX for TypeScript test execution
- **Environment**: dotenv for configuration

## 🔥 Real-Time Data

This application fetches **real, live market data** from multiple sources with automatic fallback:

- ✅ **Yahoo Finance API** - Real-time stock prices, historical data, search (no API key required)
- ✅ **Finnhub API** - Primary financial news source (optional, free tier available)
- ✅ **Alpha Vantage API** - Fallback news source with sentiment analysis (optional, free tier available)

### Works Out of the Box!
Stock prices, charts, and market data work immediately without any setup. For financial news with automatic fallback, see [API_SETUP.md](./API_SETUP.md).

### Intelligent News Fallback
The app automatically uses Alpha Vantage as a fallback when Finnhub returns no results or encounters errors, ensuring you always get the latest market news.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-price
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure API keys for news:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your API keys:
# NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
# NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Testing

Run comprehensive API tests to verify news integration:

```bash
# Test both Finnhub and Alpha Vantage APIs
npm run test:news

# Test fallback mechanism specifically
npm run test:fallback
```

See [NEWS_API_TEST_RESULTS.md](./NEWS_API_TEST_RESULTS.md) for detailed test documentation.

## Project Structure

```
stock-price/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── news/         # News API with fallback
│   │   └── stock/        # Stock data endpoints
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── charts/           # Chart components
│   │   ├── StockChart.tsx
│   │   ├── VolumeChart.tsx
│   │   └── TechnicalIndicators.tsx
│   ├── dashboard/        # Dashboard components
│   │   └── MarketHeatmap.tsx
│   ├── notifications/    # Notification system
│   │   └── NotificationsDropdown.tsx
│   ├── settings/         # Settings components
│   │   └── SettingsModal.tsx
│   ├── stock/            # Stock-specific components
│   │   ├── StockInfo.tsx
│   │   ├── StockSearch.tsx
│   │   ├── TrendingStocks.tsx
│   │   └── Watchlist.tsx
│   └── ui/               # Base UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
├── lib/                  # Utilities and services
│   ├── services/        # API services
│   │   ├── stockApi.ts
│   │   ├── realStockApi.ts
│   │   └── newsNotificationService.ts
│   ├── stores/          # State management
│   │   └── useStockStore.ts
│   └── utils/           # Helper functions
│       ├── calculations.ts
│       └── cn.ts
├── types/               # TypeScript definitions
│   └── stock.ts
├── test-news-api.ts     # Comprehensive news API tests
├── test-fallback-scenario.ts  # Fallback mechanism tests
├── NEWS_API_TEST_RESULTS.md   # Test documentation
├── API_SETUP.md         # API configuration guide
└── .env.example         # Environment variables template
```

## Features Deep Dive

### Technical Indicators

The application calculates and displays multiple technical indicators:

- **RSI (Relative Strength Index)**: Momentum indicator showing overbought/oversold conditions
- **MACD (Moving Average Convergence Divergence)**: Trend-following momentum indicator
- **Bollinger Bands**: Volatility indicator with upper/middle/lower bands
- **Moving Averages**: SMA (20, 50, 200) and EMA (12, 26, 50)

### Chart Features

- Multiple timeframe selection
- Interactive tooltips with detailed information
- Customizable indicators overlay
- Volume bars with color-coded direction
- Smooth animations and responsive design
- Grid and axis customization

### UI/UX Improvements

#### Sticky Header
- **Logo & Title**: Always visible when scrolling
- **Search Bar**: Persistent access to stock search
- **Action Buttons**: Quick access to theme toggle, notifications, and settings
- **Responsive**: Separate layouts for desktop and mobile views

#### Trending Stocks Section
- **Scrollable Display**: Positioned below sticky header
- **Real-time Data**: Shows current price changes for popular stocks
- **Color-coded**: Green for gains, red for losses
- **Interactive**: Click any stock to view details

#### Smart Notifications
- **News Updates**: Automatically fetched from dual sources
- **Price Alerts**: Triggered on significant movements (>3%)
- **Volume Alerts**: High volume detection (>1.5x average)
- **52-Week Alerts**: Near high/low notifications
- **Badge Counter**: Unread notification count
- **Dropdown View**: Organized by type with timestamps

### News API Integration

The application uses a **dual-source news system** with intelligent fallback:

1. **Primary Source - Finnhub**
   - Financial news and company-specific updates
   - Free tier: 60 API calls/minute
   - Get your key at: https://finnhub.io/

2. **Fallback Source - Alpha Vantage**
   - News with sentiment analysis
   - Free tier: 25 API calls/day
   - Get your key at: https://www.alphavantage.co/

**How the fallback works:**
```
Request News → Try Finnhub → Success? Return news
                          ↓
                        Empty/Error? → Try Alpha Vantage → Return news
```

Both APIs are configured in `.env.local`. See [API_SETUP.md](./API_SETUP.md) for detailed setup instructions.

### Data Persistence

The application uses Zustand with persistence middleware to save:
- Watchlist items
- Chart preferences
- Theme selection
- Alert configurations

Data is stored in browser's localStorage.

## Customization

### Adding New Indicators

1. Add calculation function in \`lib/utils/calculations.ts\`
2. Update \`TechnicalIndicator\` type in \`types/stock.ts\`
3. Add visualization in \`components/charts/TechnicalIndicators.tsx\`
4. Enable toggle in chart settings

### Styling

The app uses Tailwind CSS with custom design tokens defined in \`globals.css\`. Modify CSS variables to change the theme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... more variables */
}
```

## Performance Optimization

- Lazy loading for heavy components
- Memoization for expensive calculations
- Debounced search queries
- Efficient re-renders with proper React patterns
- Code splitting with Next.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Chart.js for powerful charting capabilities
- Zustand for simple state management
- shadcn/ui for design inspiration
- Lucide for beautiful icons

## Completed Features ✅

- ✅ Real API integration (Yahoo Finance, Finnhub, Alpha Vantage)
- ✅ Dual-source news with automatic fallback
- ✅ Smart notification system
- ✅ Responsive sticky header
- ✅ Trending stocks section
- ✅ Dark/light theme toggle
- ✅ Comprehensive test suite

## Future Enhancements

- [ ] Portfolio tracking with P&L
- [ ] Advanced alerts system with custom thresholds
- [ ] Stock comparison overlays
- [ ] Export data to CSV/Excel
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced filtering and screening
- [ ] AI-powered insights
- [ ] News caching and deduplication
- [ ] Historical news archive

## Contact

For questions or support, please open an issue on GitHub.
