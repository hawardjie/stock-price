import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockQuote, WatchlistItem, Alert, ChartSettings, PortfolioHolding } from '@/types/stock';

interface StockStore {
  // Current selected stock
  selectedSymbol: string | null;
  selectedStock: StockQuote | null;
  setSelectedStock: (symbol: string, stock: StockQuote) => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;

  // Portfolio
  portfolio: PortfolioHolding[];
  addToPortfolio: (holding: PortfolioHolding) => void;
  removeFromPortfolio: (symbol: string) => void;
  updatePortfolioHolding: (symbol: string, updates: Partial<PortfolioHolding>) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggered'>) => void;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;

  // Chart settings
  chartSettings: ChartSettings;
  updateChartSettings: (settings: Partial<ChartSettings>) => void;

  // Comparison stocks
  comparisonSymbols: string[];
  addComparisonSymbol: (symbol: string) => void;
  removeComparisonSymbol: (symbol: string) => void;
  clearComparisonSymbols: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStockStore = create<StockStore>()(
  persist(
    (set) => ({
      // Selected stock
      selectedSymbol: null,
      selectedStock: null,
      setSelectedStock: (symbol, stock) =>
        set({ selectedSymbol: symbol, selectedStock: stock }),

      // Watchlist
      watchlist: [],
      addToWatchlist: (item) =>
        set((state) => ({
          watchlist: [...state.watchlist.filter(w => w.symbol !== item.symbol), item],
        })),
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((item) => item.symbol !== symbol),
        })),

      // Portfolio
      portfolio: [],
      addToPortfolio: (holding) =>
        set((state) => ({
          portfolio: [...state.portfolio.filter(p => p.symbol !== holding.symbol), holding],
        })),
      removeFromPortfolio: (symbol) =>
        set((state) => ({
          portfolio: state.portfolio.filter((item) => item.symbol !== symbol),
        })),
      updatePortfolioHolding: (symbol, updates) =>
        set((state) => ({
          portfolio: state.portfolio.map((item) =>
            item.symbol === symbol ? { ...item, ...updates } : item
          ),
        })),

      // Alerts
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...alert,
              id: `alert-${Date.now()}-${Math.random()}`,
              createdAt: Date.now(),
              triggered: false,
            },
          ],
        })),
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
      updateAlert: (id, updates) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        })),

      // Chart settings
      chartSettings: {
        chartType: 'line',
        showVolume: true,
        showGrid: true,
        indicators: {
          rsi: false,
          macd: false,
          bollingerBands: false,
          ema: false,
          sma: false,
        },
        colors: {
          upColor: '#10b981',
          downColor: '#ef4444',
          backgroundColor: '#ffffff',
        },
      },
      updateChartSettings: (settings) =>
        set((state) => ({
          chartSettings: { ...state.chartSettings, ...settings },
        })),

      // Comparison
      comparisonSymbols: [],
      addComparisonSymbol: (symbol) =>
        set((state) => ({
          comparisonSymbols: Array.from(new Set([...state.comparisonSymbols, symbol])).slice(0, 5),
        })),
      removeComparisonSymbol: (symbol) =>
        set((state) => ({
          comparisonSymbols: state.comparisonSymbols.filter((s) => s !== symbol),
        })),
      clearComparisonSymbols: () => set({ comparisonSymbols: [] }),

      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'stock-tracker-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        portfolio: state.portfolio,
        alerts: state.alerts,
        chartSettings: state.chartSettings,
        theme: state.theme,
      }),
    }
  )
);
