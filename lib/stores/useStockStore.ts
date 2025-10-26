import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockQuote, WatchlistItem, Alert, ChartSettings, PortfolioHolding } from '@/types/stock';

export interface Notification {
  id: string;
  type: 'price_alert' | 'news' | 'system' | 'watchlist';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  symbol?: string;
  url?: string;
  source?: string;
}

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
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Cache management
  clearCache: () => void;
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
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => {
          // If auto, toggle between light and dark (not back to auto)
          if (state.theme === 'auto') {
            // Check system preference and toggle to opposite
            const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return { theme: prefersDark ? 'light' : 'dark' };
          }
          return { theme: state.theme === 'light' ? 'dark' : 'light' };
        }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => {
          // Helper function to normalize text
          const normalizeText = (text: string): string => {
            return text
              .toLowerCase()
              .replace(/[^\w\s]/g, '')
              .replace(/\s+/g, ' ')
              .trim();
          };

          // Helper function to check title similarity
          const areTitlesSimilar = (title1: string, title2: string): boolean => {
            const normalized1 = normalizeText(title1);
            const normalized2 = normalizeText(title2);

            if (normalized1 === normalized2) return true;

            const words1 = normalized1.split(' ').filter(w => w.length > 3);
            const words2 = normalized2.split(' ').filter(w => w.length > 3);

            if (words1.length === 0 || words2.length === 0) return false;

            const matchingWords = words1.filter(word => words2.includes(word)).length;
            const similarity1 = matchingWords / words1.length;
            const similarity2 = matchingWords / words2.length;

            return similarity1 >= 0.8 || similarity2 >= 0.8;
          };

          // Enhanced deduplication logic
          const exists = state.notifications.some((n) => {
            // For news notifications, check URL, title similarity, and content similarity
            if (notification.type === 'news' && n.type === 'news') {
              // Check if within 24 hours (don't deduplicate old news)
              const timeDiff = Date.now() - n.timestamp;
              if (timeDiff >= 24 * 60 * 60 * 1000) return false;

              // If both have URLs, compare URLs for exact match
              if (notification.url && n.url && n.url === notification.url) {
                return true;
              }

              // Check title similarity
              if (areTitlesSimilar(n.title, notification.title)) {
                return true;
              }

              // Check message/summary similarity
              if (notification.message && n.message) {
                const normalizedMsg1 = normalizeText(notification.message.substring(0, 200));
                const normalizedMsg2 = normalizeText(n.message.substring(0, 200));
                if (normalizedMsg1 === normalizedMsg2) {
                  return true;
                }
              }

              return false;
            }

            // For price/volume alerts, check if same symbol and type within last hour
            if ((notification.type === 'price_alert' || notification.type === 'watchlist') &&
                (n.type === 'price_alert' || n.type === 'watchlist')) {
              const timeDiff = Date.now() - n.timestamp;
              const sameSymbol = n.symbol === notification.symbol;
              const sameType = n.type === notification.type;
              return sameSymbol && sameType && timeDiff < 60 * 60 * 1000; // 1 hour
            }

            // For system notifications, check exact match
            if (notification.type === 'system' && n.type === 'system') {
              return n.title === notification.title;
            }

            return false;
          });

          if (exists) return state;

          return {
            notifications: [
              {
                ...notification,
                id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              },
              ...state.notifications,
            ].slice(0, 50), // Keep only last 50 notifications
          };
        }),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearAllNotifications: () => set({ notifications: [] }),

      // Cache management - clears temporary session data
      clearCache: () =>
        set({
          notifications: [],
          selectedSymbol: null,
          selectedStock: null,
          comparisonSymbols: [],
        }),
    }),
    {
      name: 'stock-tracker-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        portfolio: state.portfolio,
        alerts: state.alerts,
        chartSettings: state.chartSettings,
        theme: state.theme,
        notifications: state.notifications,
      }),
    }
  )
);
