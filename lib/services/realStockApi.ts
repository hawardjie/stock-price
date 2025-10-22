import axios from 'axios';
import { StockQuote, StockHistoricalData, StockNews, TimeFrame } from '@/types/stock';

/**
 * Real-time Stock API Service
 * Fetches actual market data from Yahoo Finance and financial news from Finnhub
 */
class RealStockApiService {
  private yahooBaseUrl = 'https://query1.finance.yahoo.com/v8/finance';
  private yahooV7Url = 'https://query2.finance.yahoo.com/v7/finance';
  private finnhubBaseUrl = 'https://finnhub.io/api/v1';
  private finnhubApiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

  constructor() {
    // API key is loaded from environment variables
  }

  /**
   * Get real-time stock quote from Yahoo Finance via API route
   */
  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await axios.get(`/api/stock/quote`, {
        params: {
          symbol: symbol,
        },
      });

      const result = response.data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];

      // Get the latest values
      const latestIndex = quote.close.length - 1;
      const currentPrice = meta.regularMarketPrice || quote.close[latestIndex];
      const previousClose = meta.previousClose || meta.chartPreviousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol: meta.symbol,
        name: this.getCompanyName(meta.symbol),
        price: parseFloat(currentPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: quote.volume[latestIndex] || meta.regularMarketVolume || 0,
        marketCap: meta.marketCap || 0,
        peRatio: meta.trailingPE || 0,
        eps: meta.epsTrailingTwelveMonths || 0,
        high52Week: meta.fiftyTwoWeekHigh || currentPrice * 1.2,
        low52Week: meta.fiftyTwoWeekLow || currentPrice * 0.8,
        avgVolume: meta.averageDailyVolume10Day || quote.volume[latestIndex] || 0,
        open: quote.open[0] || currentPrice,
        previousClose: previousClose,
        dayHigh: meta.regularMarketDayHigh || Math.max(...quote.high.filter(Boolean)),
        dayLow: meta.regularMarketDayLow || Math.min(...quote.low.filter(Boolean)),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching real-time quote from Yahoo Finance:', error);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  /**
   * Get historical stock data from Yahoo Finance via API route
   */
  async getHistoricalData(symbol: string, timeFrame: TimeFrame): Promise<StockHistoricalData[]> {
    try {
      const range = this.getYahooRange(timeFrame);
      const interval = this.getYahooInterval(timeFrame);

      const response = await axios.get(`/api/stock/historical`, {
        params: {
          symbol: symbol,
          interval,
          range,
        },
      });

      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];

      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        timestamp: timestamp * 1000,
        open: quote.open[index] || 0,
        high: quote.high[index] || 0,
        low: quote.low[index] || 0,
        close: quote.close[index] || 0,
        volume: quote.volume[index] || 0,
      }));
    } catch (error) {
      console.error('Error fetching historical data from Yahoo Finance:', error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  /**
   * Get real financial news from Finnhub via API route
   */
  async getStockNews(symbol?: string): Promise<StockNews[]> {
    try {
      const response = await axios.get('/api/news', {
        params: symbol ? { symbol } : {},
      });

      return this.formatFinnhubNews(response.data);
    } catch (error) {
      console.error('Error fetching news from Finnhub:', error);
      return [];
    }
  }

  /**
   * Search stocks using Yahoo Finance via API route
   */
  async searchStocks(query: string): Promise<Array<{ symbol: string; name: string }>> {
    try {
      const response = await axios.get('/api/stock/search', {
        params: {
          q: query,
        },
      });

      const quotes = response.data.quoteResponse.result || [];
      return quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || quote.symbol,
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  /**
   * Get trending stocks from Yahoo Finance via API route
   */
  async getTrendingStocks(): Promise<Array<{ symbol: string; name: string; change: number }>> {
    try {
      const response = await axios.get('/api/stock/trending');

      const quotes = response.data.finance.result[0].quotes || [];

      return await Promise.all(
        quotes.slice(0, 8).map(async (item: any) => {
          try {
            const quote = await this.getQuote(item.symbol);
            return {
              symbol: item.symbol,
              name: quote.name,
              change: quote.changePercent,
            };
          } catch {
            return {
              symbol: item.symbol,
              name: item.shortName || item.symbol,
              change: 0,
            };
          }
        })
      );
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      // Fallback to popular stocks
      return [
        { symbol: 'AAPL', name: 'Apple Inc.', change: 0 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', change: 0 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', change: 0 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', change: 0 },
        { symbol: 'TSLA', name: 'Tesla Inc.', change: 0 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', change: 0 },
        { symbol: 'META', name: 'Meta Platforms Inc.', change: 0 },
        { symbol: 'NFLX', name: 'Netflix Inc.', change: 0 },
      ];
    }
  }

  /**
   * Get market sectors data
   */
  async getMarketSectors() {
    const sectors = [
      { name: 'Technology', symbol: 'XLK' },
      { name: 'Healthcare', symbol: 'XLV' },
      { name: 'Financials', symbol: 'XLF' },
      { name: 'Energy', symbol: 'XLE' },
      { name: 'Consumer', symbol: 'XLY' },
      { name: 'Industrials', symbol: 'XLI' },
      { name: 'Materials', symbol: 'XLB' },
      { name: 'Real Estate', symbol: 'XLRE' },
    ];

    return await Promise.all(
      sectors.map(async (sector) => {
        try {
          const quote = await this.getQuote(sector.symbol);
          return {
            ...sector,
            change: quote.change,
            changePercent: quote.changePercent,
            marketCap: quote.marketCap,
          };
        } catch {
          return {
            ...sector,
            change: 0,
            changePercent: 0,
            marketCap: 0,
          };
        }
      })
    );
  }

  /**
   * Format Finnhub news data to our StockNews interface
   */
  private formatFinnhubNews(newsData: any[]): StockNews[] {
    return newsData.slice(0, 8).map((item, index) => ({
      id: `news-${item.id || index}-${Date.now()}`,
      headline: item.headline,
      summary: item.summary || item.headline,
      source: item.source || 'Financial News',
      url: item.url || '#',
      datetime: item.datetime ? item.datetime * 1000 : Date.now() - index * 3600000,
      image: item.image,
      sentiment: this.analyzeSentiment(item.headline + ' ' + (item.summary || '')),
    }));
  }

  /**
   * Simple sentiment analysis based on keywords
   */
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();

    const positiveWords = ['beat', 'surge', 'growth', 'profit', 'gain', 'upgrade', 'high', 'strong', 'success', 'record'];
    const negativeWords = ['fall', 'drop', 'loss', 'decline', 'cut', 'downgrade', 'low', 'weak', 'miss', 'concern'];

    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Convert TimeFrame to Yahoo Finance range parameter
   */
  private getYahooRange(timeFrame: TimeFrame): string {
    const mapping: Record<TimeFrame, string> = {
      '1D': '1d',
      '5D': '5d',
      '1M': '1mo',
      '3M': '3mo',
      '6M': '6mo',
      '1Y': '1y',
      '5Y': '5y',
      'MAX': 'max',
    };
    return mapping[timeFrame];
  }

  /**
   * Convert TimeFrame to Yahoo Finance interval parameter
   */
  private getYahooInterval(timeFrame: TimeFrame): string {
    const mapping: Record<TimeFrame, string> = {
      '1D': '5m',
      '5D': '15m',
      '1M': '1d',
      '3M': '1d',
      '6M': '1d',
      '1Y': '1d',
      '5Y': '1wk',
      'MAX': '1mo',
    };
    return mapping[timeFrame];
  }

  /**
   * Get company name from symbol (fallback for display)
   */
  private getCompanyName(symbol: string): string {
    const names: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'META': 'Meta Platforms Inc.',
      'NFLX': 'Netflix Inc.',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'WMT': 'Walmart Inc.',
      'DIS': 'The Walt Disney Company',
      'BA': 'Boeing Company',
      'GE': 'General Electric',
      'F': 'Ford Motor Company',
    };
    return names[symbol.toUpperCase()] || symbol.toUpperCase();
  }
}

export const realStockApi = new RealStockApiService();
