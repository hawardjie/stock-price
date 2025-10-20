# Quick Start Guide - Stock Tracker Pro

## Getting Started in 3 Steps

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000) (or http://localhost:3001 if port 3000 is in use)

## First Time Use

### Exploring the Dashboard

1. **Default View**: The app loads with Apple (AAPL) stock by default
2. **Search for Stocks**: Use the search bar in the header to find other stocks
3. **View Trending**: Check out the trending stocks displayed below the search bar
4. **Add to Watchlist**: Click the "Add to Watchlist" button to save stocks

### Key Features to Try

#### 1. Stock Search
- Type a stock symbol (e.g., MSFT, GOOGL, TSLA)
- Select from autocomplete results
- View comprehensive stock information

#### 2. Chart Analysis
- Click different timeframe buttons (1D, 1M, 1Y, etc.)
- Hover over the chart to see detailed price points
- Switch between Chart, Indicators, and News tabs

#### 3. Technical Indicators
- View RSI to identify overbought/oversold conditions
- Check MACD for trend signals
- Analyze moving averages for support/resistance levels

#### 4. Watchlist Management
- Add multiple stocks to your watchlist
- See real-time price updates
- Click any watchlist item to view its details
- Remove stocks with the trash icon

#### 5. Market Overview
- Scroll to the bottom to see the sector heatmap
- Green = gaining sectors, Red = losing sectors
- Click sectors to explore further

#### 6. Dark Mode
- Toggle between light and dark themes using the moon/sun icon
- Your preference is saved automatically

## Common Use Cases

### For Day Traders
1. Add frequently traded stocks to watchlist
2. Monitor 1D and 5D timeframes
3. Use RSI and MACD for entry/exit signals
4. Check volume for confirmation

### For Long-Term Investors
1. Use 1Y and 5Y timeframes
2. Focus on fundamental metrics (P/E, EPS, Market Cap)
3. Read latest news for company updates
4. Compare with sector performance

### For Market Researchers
1. Use the sector heatmap for market overview
2. Track multiple stocks in watchlist
3. Analyze technical indicators for patterns
4. Monitor news sentiment

## Tips and Tricks

### Keyboard Shortcuts
- Press `/` to focus search bar
- `Esc` to close modals or dropdowns
- Arrow keys to navigate search results

### Best Practices
- Keep your watchlist focused (5-10 stocks)
- Check multiple timeframes before making decisions
- Use technical indicators as confirmation, not sole signals
- Read news for context on price movements

### Customization
- Your watchlist is saved in browser storage
- Theme preference persists across sessions
- Chart settings are remembered

## Troubleshooting

### App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port Already in Use
```bash
# Use a different port
PORT=3002 npm run dev
```

### Changes Not Showing
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Data Not Loading
- Check browser console for errors
- Ensure JavaScript is enabled
- Try clearing browser cache
- Use a modern browser (Chrome, Firefox, Safari, Edge)

## Building for Production

### Build Command
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

### Deploy
The app is optimized for deployment on:
- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Follow Amplify setup
- **Docker**: Use included Dockerfile (if added)

## API Integration (Optional)

To connect real stock data APIs:

### 1. Alpha Vantage (Free)
```bash
npm install axios
```

Update `lib/services/stockApi.ts`:
```typescript
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

async getQuote(symbol: string) {
  const response = await axios.get(BASE_URL, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: API_KEY,
    },
  });
  return response.data;
}
```

### 2. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_api_key_here
NEXT_PUBLIC_FINNHUB_KEY=your_api_key_here
```

## Project Structure Overview

```
├── app/                 # Next.js pages
│   ├── page.tsx        # Main dashboard
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── charts/        # Chart components
│   ├── stock/         # Stock-related components
│   ├── dashboard/     # Dashboard widgets
│   └── ui/            # Base UI components
├── lib/               # Utilities
│   ├── services/      # API services
│   ├── stores/        # State management
│   └── utils/         # Helper functions
└── types/             # TypeScript types
```

## What's Next?

### Explore More Features
- Try different stocks and timeframes
- Build your personalized watchlist
- Analyze sector performance
- Read stock-specific news

### Customize
- Modify chart colors in `app/globals.css`
- Add new indicators in `lib/utils/calculations.ts`
- Create custom dashboard layouts

### Contribute
- Found a bug? Open an issue
- Have ideas? Submit a feature request
- Want to help? Submit a pull request

## Support

- **Documentation**: See README.md and FEATURES.md
- **Issues**: GitHub Issues page
- **Questions**: Open a discussion

## Learning Resources

### Stock Trading Basics
- Investopedia: Learn about technical indicators
- TradingView: See real examples
- Yahoo Finance: Follow market news

### Development
- Next.js Documentation
- React Documentation
- TypeScript Handbook
- Tailwind CSS Guides

## License
MIT License - feel free to use for personal or commercial projects

---

**Ready to start?** Run `npm run dev` and happy trading! 📈
