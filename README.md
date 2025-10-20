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
- **Stock Search** - Autocomplete search with trending stocks
- **Market Heatmap** - Visual representation of sector performance
- **News Integration** - Latest market news with sentiment analysis
- **Technical Analysis** - Comprehensive indicator calculations and visualizations
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### Customization
- **Chart Settings** - Customize chart types, colors, and indicators
- **Data Persistence** - Watchlist and preferences saved locally
- **Multiple Layouts** - Flexible dashboard with tabbed interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, React-Chartjs-2, Lightweight Charts
- **State Management**: Zustand
- **UI Components**: Custom components with shadcn/ui patterns
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Icons**: Lucide React

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
stock-price/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── charts/           # Chart components
│   │   ├── StockChart.tsx
│   │   ├── VolumeChart.tsx
│   │   └── TechnicalIndicators.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── MarketHeatmap.tsx
│   │   └── NewsPanel.tsx
│   ├── stock/            # Stock-specific components
│   │   ├── StockInfo.tsx
│   │   ├── StockSearch.tsx
│   │   └── Watchlist.tsx
│   └── ui/               # Base UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
├── lib/                  # Utilities and services
│   ├── services/        # API services
│   │   └── stockApi.ts
│   ├── stores/          # State management
│   │   └── useStockStore.ts
│   └── utils/           # Helper functions
│       ├── calculations.ts
│       └── cn.ts
└── types/               # TypeScript definitions
    └── stock.ts
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

### Market Data

Currently uses simulated data for demonstration. To integrate with real APIs:

1. **Alpha Vantage**: Free tier available, good for historical data
2. **Finnhub**: Real-time data with free tier
3. **Yahoo Finance API**: Unofficial but widely used
4. **IEX Cloud**: Professional-grade financial data

Replace the mock data in \`lib/services/stockApi.ts\` with real API calls.

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

## Future Enhancements

- [ ] Real API integration
- [ ] Portfolio tracking with P&L
- [ ] Advanced alerts system
- [ ] Stock comparison overlays
- [ ] Export data to CSV/Excel
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced filtering and screening
- [ ] AI-powered insights

## Contact

For questions or support, please open an issue on GitHub.
