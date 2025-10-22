import axios from 'axios';
import { StockQuote, StockHistoricalData, StockNews, TimeFrame } from '@/types/stock';
import { realStockApi } from './realStockApi';

/**
 * Stock API Service - Wrapper that uses real-time data
 * Falls back to mock data only if real API fails
 */
class StockApiService {
  private useRealApi = true; // Toggle to use real API vs mock data

  /**
   * Get stock quote - uses real-time API
   */
  async getQuote(symbol: string): Promise<StockQuote> {
    if (this.useRealApi) {
      try {
        return await realStockApi.getQuote(symbol);
      } catch (error) {
        console.warn('Real API failed, using fallback data:', error);
        return this.getMockQuote(symbol);
      }
    }
    return this.getMockQuote(symbol);
  }

  /**
   * Mock quote data (fallback only)
   */
  private getMockQuote(symbol: string): StockQuote {
    const basePrice = this.getBasePriceForSymbol(symbol);
    const randomChange = (Math.random() - 0.5) * basePrice * 0.05;
    const price = basePrice + randomChange;
    const changePercent = (randomChange / basePrice) * 100;

    return {
      symbol: symbol.toUpperCase(),
      name: this.getCompanyName(symbol),
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(randomChange.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000,
      peRatio: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      eps: parseFloat((Math.random() * 20 + 1).toFixed(2)),
      high52Week: parseFloat((price * 1.3).toFixed(2)),
      low52Week: parseFloat((price * 0.7).toFixed(2)),
      avgVolume: Math.floor(Math.random() * 40000000) + 10000000,
      open: parseFloat((price - (Math.random() - 0.5) * 5).toFixed(2)),
      previousClose: parseFloat((price - randomChange).toFixed(2)),
      dayHigh: parseFloat((price + Math.random() * 3).toFixed(2)),
      dayLow: parseFloat((price - Math.random() * 3).toFixed(2)),
      timestamp: Date.now(),
    };
  }

  /**
   * Get historical data - uses real-time API
   */
  async getHistoricalData(symbol: string, timeFrame: TimeFrame): Promise<StockHistoricalData[]> {
    if (this.useRealApi) {
      try {
        return await realStockApi.getHistoricalData(symbol, timeFrame);
      } catch (error) {
        console.warn('Real API failed for historical data, using fallback:', error);
        return this.getMockHistoricalData(symbol, timeFrame);
      }
    }
    return this.getMockHistoricalData(symbol, timeFrame);
  }

  /**
   * Mock historical data (fallback only)
   */
  private getMockHistoricalData(symbol: string, timeFrame: TimeFrame): StockHistoricalData[] {
    const days = this.getTimeFrameDays(timeFrame);
    const data: StockHistoricalData[] = [];
    const basePrice = this.getBasePriceForSymbol(symbol);
    const now = Date.now();

    let currentPrice = basePrice * 0.9;
    const volatility = 0.02;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const randomChange = (Math.random() - 0.5) * currentPrice * volatility;
      currentPrice += randomChange;

      const open = currentPrice + (Math.random() - 0.5) * currentPrice * 0.01;
      const close = currentPrice;
      const high = Math.max(open, close) + Math.random() * currentPrice * 0.01;
      const low = Math.min(open, close) - Math.random() * currentPrice * 0.01;

      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 10000000,
      });
    }

    return data;
  }

  /**
   * Search stocks - uses real-time API
   */
  async searchStocks(query: string): Promise<Array<{ symbol: string; name: string }>> {
    if (this.useRealApi) {
      try {
        return await realStockApi.searchStocks(query);
      } catch (error) {
        console.warn('Real API failed for search, using fallback:', error);
        return this.getMockSearchResults(query);
      }
    }
    return this.getMockSearchResults(query);
  }

  /**
   * Mock search results (fallback only)
   */
  private getMockSearchResults(query: string): Array<{ symbol: string; name: string }> {
    const mockStocks = this.getAllMockStocks();
    return mockStocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  }

  /**
   * Get trending stocks - uses real-time API
   */
  async getTrendingStocks(): Promise<Array<{ symbol: string; name: string; change: number }>> {
    if (this.useRealApi) {
      try {
        return await realStockApi.getTrendingStocks();
      } catch (error) {
        console.warn('Real API failed for trending stocks, using fallback:', error);
        return this.getMockTrendingStocks();
      }
    }
    return this.getMockTrendingStocks();
  }

  /**
   * Mock trending stocks (fallback only)
   */
  private getMockTrendingStocks(): Array<{ symbol: string; name: string; change: number }> {
    const trending = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    return trending.map(symbol => ({
      symbol,
      name: this.getCompanyName(symbol),
      change: parseFloat(((Math.random() - 0.4) * 5).toFixed(2)),
    }));
  }

  /**
   * Get market sectors - uses real-time API
   */
  async getMarketSectors() {
    if (this.useRealApi) {
      try {
        return await realStockApi.getMarketSectors();
      } catch (error) {
        console.warn('Real API failed for sectors, using fallback:', error);
        return this.getMockMarketSectors();
      }
    }
    return this.getMockMarketSectors();
  }

  /**
   * Mock market sectors (fallback only)
   */
  private getMockMarketSectors() {
    const sectors = [
      { name: 'Technology', symbol: 'XLK', change: Math.random() * 4 - 2 },
      { name: 'Healthcare', symbol: 'XLV', change: Math.random() * 4 - 2 },
      { name: 'Financials', symbol: 'XLF', change: Math.random() * 4 - 2 },
      { name: 'Energy', symbol: 'XLE', change: Math.random() * 4 - 2 },
      { name: 'Consumer', symbol: 'XLY', change: Math.random() * 4 - 2 },
      { name: 'Industrials', symbol: 'XLI', change: Math.random() * 4 - 2 },
      { name: 'Materials', symbol: 'XLB', change: Math.random() * 4 - 2 },
      { name: 'Real Estate', symbol: 'XLRE', change: Math.random() * 4 - 2 },
    ];

    return sectors.map(s => ({
      ...s,
      change: parseFloat(s.change.toFixed(2)),
      changePercent: parseFloat(s.change.toFixed(2)),
      marketCap: Math.floor(Math.random() * 500000000000) + 50000000000,
    }));
  }

  /**
   * Get stock news - uses real-time API
   */
  async getStockNews(symbol?: string): Promise<StockNews[]> {
    if (this.useRealApi) {
      try {
        return await realStockApi.getStockNews(symbol);
      } catch (error) {
        console.warn('Real API failed for news, API key may not be configured:', error);
        // Don't return mock news - just return empty array or API key message
        return [];
      }
    }
    return [];
  }

  // Helper methods
  private getBasePriceForSymbol(symbol: string): number {
    const prices: Record<string, number> = {
      'AAPL': 178.50,
      'MSFT': 380.00,
      'GOOGL': 140.00,
      'AMZN': 155.00,
      'TSLA': 245.00,
      'NVDA': 495.00,
      'META': 350.00,
      'NFLX': 450.00,
      'JPM': 150.00,
      'V': 250.00,
      'WMT': 160.00,
      'DIS': 95.00,
      'BA': 210.00,
      'GE': 110.00,
      'F': 12.50,
    };
    return prices[symbol.toUpperCase()] || 100 + Math.random() * 200;
  }

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
    return names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Company`;
  }

  private getAllMockStocks() {
    return [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
      { symbol: 'V', name: 'Visa Inc.' },
      { symbol: 'WMT', name: 'Walmart Inc.' },
      { symbol: 'DIS', name: 'The Walt Disney Company' },
      { symbol: 'BA', name: 'Boeing Company' },
      { symbol: 'GE', name: 'General Electric' },
      { symbol: 'F', name: 'Ford Motor Company' },
    ];
  }

  private getTimeFrameDays(timeFrame: TimeFrame): number {
    const mapping: Record<TimeFrame, number> = {
      '1D': 1,
      '5D': 5,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825,
      'MAX': 3650,
    };
    return mapping[timeFrame];
  }
}

export const stockApi = new StockApiService();
