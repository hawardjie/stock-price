export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  high52Week: number;
  low52Week: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  timestamp: number;
}

export interface StockHistoricalData {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  rsi: number[];
  macd: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
  bollingerBands: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  ema: {
    ema12: number[];
    ema26: number[];
    ema50: number[];
  };
  sma: {
    sma20: number[];
    sma50: number[];
    sma200: number[];
  };
}

export interface StockNews {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'percent' | 'volume';
  condition: 'above' | 'below';
  value: number;
  triggered: boolean;
  createdAt: number;
}

export type TimeFrame = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

export interface ChartSettings {
  chartType: 'line' | 'candlestick' | 'area';
  showVolume: boolean;
  showGrid: boolean;
  indicators: {
    rsi: boolean;
    macd: boolean;
    bollingerBands: boolean;
    ema: boolean;
    sma: boolean;
  };
  colors: {
    upColor: string;
    downColor: string;
    backgroundColor: string;
  };
}

export interface MarketSector {
  name: string;
  symbol: string;
  change: number;
  changePercent: number;
  marketCap: number;
}

export interface ComparisonStock {
  symbol: string;
  name: string;
  color: string;
  data: StockHistoricalData[];
}
