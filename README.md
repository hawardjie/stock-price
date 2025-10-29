# Stock Price Watch

<div align="center">

**Your Real-Time Financial Intelligence Platform**

*Professional-grade stock market analytics, powered by intelligent design*

![Stock Price Watch](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

[Features](#features) • [Getting Started](#getting-started) • [Tech Stack](#tech-stack) • [Documentation](#project-structure)

</div>

---

## What Makes This Special

**Stock Price Watch** is not just another stock tracker—it's a comprehensive financial intelligence platform built for serious traders and investors. Combining real-time market data with advanced technical analysis, intelligent notifications, and a beautifully crafted user interface, this application delivers institutional-grade analytics in a modern, accessible package.

### Key Highlights

- **Zero Setup Required** - Works immediately with real-time data, no API keys needed for core features
- **Intelligent Fallback System** - Dual-source architecture ensures you always get the latest news
- **Advanced Analytics** - Professional technical indicators (RSI, MACD, Bollinger Bands, Moving Averages)
- **Adaptive Design** - Auto-theme follows your system preferences with seamless dark/light mode
- **Lightning Fast** - Optimized search with instant autocomplete and smart caching
- **Truly Responsive** - Desktop-first design that adapts perfectly to mobile and tablet
- **Smart Notifications** - AI-powered deduplication eliminates redundant alerts

---

## Features

### Core Functionality

#### Real-Time Market Data
- **Live Stock Quotes** - Instant price updates with comprehensive market information
- **Interactive Charts** - 8 timeframes (1D, 5D, 1M, 3M, 6M, 1Y, 5Y, MAX) with smooth animations
- **Smart Search** - Yahoo Finance autocomplete with fuzzy matching for stocks and ETFs
- **Volume Analysis** - Color-coded volume bars with average volume comparison
- **Trending Stocks** - Dedicated section showcasing top market movers

#### Technical Analysis
- **RSI (Relative Strength Index)** - Identify overbought/oversold conditions
- **MACD** - Trend-following momentum indicator with signal line
- **Bollinger Bands** - Volatility bands with upper/middle/lower thresholds
- **Moving Averages** - SMA (20, 50, 200) and EMA (12, 26, 50)
- **Custom Indicators** - Toggle individual indicators on/off

### Advanced Features

#### Intelligent Notification System
- **Dual-Source News** - Automatic fallback from Finnhub to Alpha Vantage
- **Price Alerts** - Triggers on significant movements (>3%)
- **Volume Alerts** - Detects unusual trading activity (>1.5x average)
- **52-Week Alerts** - Notifications near yearly highs/lows
- **Smart Deduplication** - Advanced logic prevents redundant notifications
- **Badge Counter** - Real-time unread notification count

#### User Experience
- **Auto Theme** - Follows system preference (light/dark/auto)
- **Sticky Header** - Logo, search, and controls always accessible
- **Responsive Layouts** - Optimized mobile/tablet/desktop experiences
- **Watchlist Management** - Add/remove stocks with persistent storage
- **Market Heatmap** - Visual sector performance overview
- **Clear Cache** - One-click data refresh with confirmation

#### Customization
- **Chart Settings** - Customize chart types, colors, and grid display
- **Notification Preferences** - Control alert types and frequency
- **Data Persistence** - Local storage for watchlist and preferences
- **Tabbed Interface** - Organized chart/indicators views

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd stock-price
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** The app works immediately with real-time stock data.

### Optional: Enable News Features

For financial news with automatic fallback:

```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys (both optional, free tiers available)
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

See [API_SETUP.md](./API_SETUP.md) for detailed setup instructions.

### Build for Production

```bash
npm run build
npm start
```

### Testing

Run comprehensive API tests:

```bash
# Test both news APIs
npm run test:news

# Test fallback mechanism
npm run test:fallback
```

See [NEWS_API_TEST_RESULTS.md](./NEWS_API_TEST_RESULTS.md) for test documentation.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router with Server Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand (with persistence middleware)
- **Charts**: Chart.js, React-Chartjs-2, Lightweight Charts, Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend & APIs
- **Stock Data**: Yahoo Finance API (real-time quotes, historical data, search)
- **News (Primary)**: Finnhub API (60 calls/min free tier)
- **News (Fallback)**: Alpha Vantage API (25 calls/day free tier)
- **HTTP Client**: Axios with timeout and retry logic

### Development
- **Testing**: TSX for TypeScript execution
- **Environment**: dotenv for configuration
- **Code Quality**: ESLint, TypeScript strict mode

---

## Real-Time Data Sources

### Stock Market Data
**Yahoo Finance API** - Powers all core functionality
- Real-time stock prices and quotes
- Historical OHLCV data (Open, High, Low, Close, Volume)
- Autocomplete search with fuzzy matching
- Trending stocks and market movers
- **No API key required** - Works out of the box!

### Financial News
**Dual-Source Architecture** with intelligent fallback

**Primary: Finnhub API**
- Company-specific news and analysis
- General market news
- Free tier: 60 API calls/minute
- Get your key: https://finnhub.io/

**Fallback: Alpha Vantage API**
- News with sentiment analysis
- Market trends and updates
- Free tier: 25 API calls/day
- Get your key: https://www.alphavantage.co/

**Fallback Flow:**
```
Request News → Finnhub API → Success? Return news
                          ↓
                        Empty/Error? → Alpha Vantage API → Return news
```

---

## 📁 Project Structure

```
stock-price/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes (Server-side)
│   │   ├── news/               # Dual-source news API
│   │   │   └── route.ts       # Finnhub + Alpha Vantage fallback
│   │   └── stock/             # Yahoo Finance endpoints
│   │       ├── quote/         # Real-time quotes
│   │       ├── historical/    # Historical data
│   │       ├── search/        # Autocomplete search
│   │       └── trending/      # Trending stocks
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main dashboard
│   └── globals.css             # Global styles & CSS variables
│
├── components/                  # React Components
│   ├── charts/                 # Charting Components
│   │   ├── StockChart.tsx     # Price chart with indicators
│   │   ├── VolumeChart.tsx    # Volume analysis
│   │   └── TechnicalIndicators.tsx  # Technical analysis display
│   ├── dashboard/              # Dashboard Components
│   │   └── MarketHeatmap.tsx  # Sector performance heatmap
│   ├── notifications/          # Notification System
│   │   └── NotificationsDropdown.tsx  # Smart notifications UI
│   ├── settings/               # Settings & Preferences
│   │   └── SettingsModal.tsx  # Settings modal with tabs
│   ├── stock/                  # Stock-specific Components
│   │   ├── StockInfo.tsx      # Stock details card
│   │   ├── StockSearch.tsx    # Search with autocomplete
│   │   ├── TrendingStocks.tsx # Trending stocks section
│   │   └── Watchlist.tsx      # Watchlist management
│   └── ui/                     # Base UI Components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
│
├── lib/                         # Core Logic & Utilities
│   ├── services/               # API Services
│   │   ├── stockApi.ts        # Stock API abstraction
│   │   ├── realStockApi.ts    # Yahoo Finance integration
│   │   └── newsNotificationService.ts  # Notification logic
│   ├── stores/                 # State Management
│   │   └── useStockStore.ts   # Zustand store with persistence
│   └── utils/                  # Helper Functions
│       ├── calculations.ts    # Technical indicator calculations
│       └── cn.ts              # Class name utility
│
├── types/                       # TypeScript Definitions
│   └── stock.ts                # Stock data types
│
├── test-news-api.ts            # News API test suite (9 tests)
├── test-fallback-scenario.ts   # Fallback mechanism tests
├── NEWS_API_TEST_RESULTS.md    # Test documentation
├── API_SETUP.md                # API setup guide
└── .env.example                # Environment variables template
```

---

## UI/UX Highlights

### Adaptive Theme System
- **Auto Mode** - Follows system preference with real-time sync
- **Manual Override** - Choose light or dark mode
- **Smooth Transitions** - Seamless theme switching
- **Persistent** - Saves preference across sessions

### Responsive Design
- **Desktop** - Multi-column layout with sidebar navigation
- **Tablet** - Optimized two-column layout
- **Mobile** - Single column with touch-friendly controls
- **Sticky Header** - Logo, search, and actions always accessible
- **Flexible Charts** - Two-line button layout on mobile

### Smart Notifications
- **Deduplication Logic**:
  - News: Same headline within 24 hours
  - Price alerts: Same symbol/type within 1 hour
  - System: Exact match prevention
- **Badge Counter** - Real-time unread count
- **Responsive Dropdown** - Smart positioning on mobile
- **Refresh Button** - Manual refresh with loading state

### Performance Optimizations
- **Debounced Search** - 300ms delay prevents excessive API calls
- **Memoized Calculations** - Technical indicators cached
- **Code Splitting** - Dynamic imports for heavy components
- **Lazy Loading** - Images and charts load on demand
- **Local Storage** - Persistent data reduces API calls

---

## Advanced Customization

### Adding Custom Indicators

1. **Add calculation** in `lib/utils/calculations.ts`:
```typescript
export function calculateCustomIndicator(data: StockHistoricalData[]) {
  // Your calculation logic
  return results;
}
```

2. **Update types** in `types/stock.ts`:
```typescript
export interface TechnicalIndicators {
  // ... existing indicators
  customIndicator?: number[];
}
```

3. **Add visualization** in `components/charts/TechnicalIndicators.tsx`

4. **Enable toggle** in chart settings modal

### Customizing Theme

Edit CSS variables in `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... customize colors */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode colors */
}
```

### API Rate Limiting

Customize API call frequencies in `app/page.tsx`:

```typescript
// News refresh interval (default: 5 minutes)
const interval = setInterval(() => {
  fetchNewsNotifications();
}, 5 * 60 * 1000);
```

---

## Features Deep Dive

### Technical Indicators Explained

#### RSI (Relative Strength Index)
- **Range**: 0-100
- **Overbought**: > 70 (potential sell signal)
- **Oversold**: < 30 (potential buy signal)
- **Use**: Identify momentum and reversal points

#### MACD (Moving Average Convergence Divergence)
- **Components**: MACD line, Signal line, Histogram
- **Signal**: MACD crosses above signal = bullish
- **Use**: Trend direction and momentum

#### Bollinger Bands
- **Bands**: Upper (mean + 2σ), Middle (20-day SMA), Lower (mean - 2σ)
- **Signal**: Price touching bands = potential reversal
- **Use**: Volatility and price extremes

#### Moving Averages
- **SMA**: Simple moving average (20, 50, 200 days)
- **EMA**: Exponential moving average (12, 26, 50 days)
- **Use**: Trend identification and support/resistance

### Chart Features
- **8 Timeframes**: 1D (5-min), 5D (15-min), 1M-1Y (daily), 5Y (weekly), MAX (monthly)
- **Interactive Tooltips**: Hover for detailed OHLCV data
- **Zoom & Pan**: Mouse wheel zoom, click-drag pan
- **Indicator Overlay**: Toggle indicators on main chart
- **Grid Customization**: Show/hide grid lines

---

## Completed Features

- Real-time Yahoo Finance integration (no API key required)
- Dual-source news with automatic fallback (Finnhub → Alpha Vantage)
- Auto theme following system preference
- Advanced search with Yahoo Finance autocomplete
- Smart notification deduplication
- Responsive sticky header (desktop & mobile layouts)
- Trending stocks dedicated section
- Clear cache functionality with confirmation
- Enhanced error handling with User-Agent headers
- Comprehensive test suite (9/9 tests passing)
- Mobile-optimized chart button layout
- Smart notification positioning on mobile
- Volume and price alert system
- 52-week high/low notifications
- Technical indicator calculations and visualizations
- Market sector heatmap
- Watchlist with real-time updates
- Data persistence (localStorage)

---

## Roadmap & Future Enhancements

### Short Term
- [ ] Portfolio tracking with P&L calculations
- [ ] Advanced alert system with custom thresholds
- [ ] Stock comparison overlays
- [ ] CSV/Excel data export
- [ ] News caching and archival

### Medium Term
- [ ] Social sharing features
- [ ] Multi-language support (i18n)
- [ ] Advanced filtering and screening tools
- [ ] Historical news archive with search
- [ ] Real-time WebSocket integration

### Long Term
- [ ] Mobile app (React Native)
- [ ] AI-powered market insights
- [ ] Predictive analytics with ML
- [ ] Community features (social trading)
- [ ] Advanced backtesting tools

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | Latest  | Fully Supported |
| Firefox | Latest  | Fully Supported |
| Safari  | Latest  | Fully Supported |
| Edge    | Latest  | Fully Supported |

**Note**: The app uses modern JavaScript features. IE11 is not supported.

---

## API Documentation

### Yahoo Finance Endpoints
- **Quote**: `/api/stock/quote?symbol=AAPL`
- **Historical**: `/api/stock/historical?symbol=AAPL&range=1mo&interval=1d`
- **Search**: `/api/stock/search?q=apple`
- **Trending**: `/api/stock/trending`

### News Endpoints
- **General**: `/api/news`
- **Stock-specific**: `/api/news?symbol=AAPL`

All endpoints include automatic error handling, timeout protection, and response validation.

---

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please ensure:
- Code follows TypeScript best practices
- All tests pass (`npm run build`)
- Commit messages are descriptive

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **[Chart.js](https://www.chartjs.org/)** - Powerful, flexible charting library
- **[Zustand](https://github.com/pmndrs/zustand)** - Simple, fast state management
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component design patterns
- **[Lucide](https://lucide.dev/)** - Elegant icon library
- **[Yahoo Finance](https://finance.yahoo.com/)** - Reliable market data API
- **[Finnhub](https://finnhub.io/)** - Comprehensive financial news
- **[Alpha Vantage](https://www.alphavantage.co/)** - News with sentiment analysis

---

## Contact & Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Report security issues via GitHub Security Advisories

---

<div align="center">

**Built by developers, for traders and investors**

[⭐ Star this repo](https://github.com/your-username/stock-price) if you find it useful!

</div>
