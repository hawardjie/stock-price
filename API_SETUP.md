# API Setup Guide - Stock Price Watch

This application uses **real-time financial data** from Yahoo Finance and Finnhub. Here's how to configure the APIs:

## 🚀 Quick Start (No API Key Required)

The app works **out of the box** without any API keys! It uses:
- ✅ **Yahoo Finance API** for real-time stock prices (no key required)
- ✅ **Yahoo Finance API** for historical data (no key required)
- ✅ **Yahoo Finance API** for stock search (no key required)
- ✅ **Yahoo Finance API** for trending stocks (no key required)
- ✅ **Yahoo Finance API** for market sectors (no key required)

## 📰 Enable Real-Time Financial News

To get **real financial news** in notifications, add your Finnhub API key:

### Configure Your API Key

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Finnhub API key to `.env.local`:
   ```env
   NEXT_PUBLIC_FINNHUB_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 📊 What Data is Real-Time?

### ✅ Always Real-Time (No API Key Needed)
- Stock prices and quotes
- Historical price charts
- Trading volume
- Market cap, P/E ratio, EPS
- 52-week high/low
- Day high/low, open/close
- Stock search
- Trending stocks
- Market sector performance

### 📰 Requires Finnhub API Key
- Financial news articles
- Company-specific news
- Market news with summaries
- News sentiment analysis

### 🔄 Auto-Generated (If News API Not Configured)
- Price alerts (calculated from real stock prices)
- Volume alerts (calculated from real trading data)
- 52-week high/low alerts (from real data)
- Welcome notifications

## 🆓 Finnhub Free Tier Limits

- ✅ 60 API calls per minute
- ✅ Real-time company news
- ✅ Market news
- ✅ Sentiment analysis
- ✅ No credit card required

**This is more than enough for personal use!**

## 🔧 API Configuration Options

### Using Real APIs (Default)
```typescript
// lib/services/stockApi.ts
private useRealApi = true;  // ✅ Uses real Yahoo Finance + Finnhub
```

### Fallback Behavior
The app automatically falls back to mock data if:
- Yahoo Finance API is temporarily unavailable
- Network connection issues occur
- API rate limits are exceeded

## 📝 API Sources

| Data Type | Source | API Key Required | Cost |
|-----------|--------|------------------|------|
| Stock Quotes | Yahoo Finance | ❌ No | Free |
| Historical Data | Yahoo Finance | ❌ No | Free |
| Search | Yahoo Finance | ❌ No | Free |
| Trending Stocks | Yahoo Finance | ❌ No | Free |
| Market Sectors | Yahoo Finance | ❌ No | Free |
| Financial News | Finnhub | ✅ Yes (Optional) | Free Tier Available |

## 🐛 Troubleshooting

### Stock Prices Not Loading
- Check your internet connection
- Yahoo Finance API may be experiencing downtime
- Check browser console for error messages

### News Not Showing
1. Verify your Finnhub API key is correct
2. Check `.env.local` file exists and is properly formatted
3. Restart your development server after adding the key
4. Check Finnhub dashboard for API usage/limits

### API Rate Limits
If you hit rate limits:
- **Yahoo Finance**: Wait a few minutes before retrying
- **Finnhub Free Tier**: You get 60 calls/minute (plenty for normal use)

## 🔒 Security Note

**Never commit your `.env.local` file to git!**

The `.gitignore` file already excludes it, but double-check:
```bash
# Make sure .env.local is in .gitignore
cat .gitignore | grep .env.local
```

## 📚 Additional Resources

- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [Yahoo Finance API (Unofficial)](https://github.com/ranaroussi/yfinance)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## ✨ What's Next?

With the APIs configured, you'll get:
- ✅ Real-time stock prices updating every refresh
- ✅ Actual market data from NYSE, NASDAQ, etc.
- ✅ Live financial news from Reuters, Bloomberg, CNBC
- ✅ Accurate technical indicators based on real data
- ✅ Real trading volumes and price movements

**Start tracking real stocks now!** 🚀
