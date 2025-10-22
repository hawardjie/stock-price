'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStockStore } from '@/lib/stores/useStockStore';
import { stockApi } from '@/lib/services/stockApi';
import { StockQuote, StockHistoricalData, TimeFrame } from '@/types/stock';
import StockSearch from '@/components/stock/StockSearch';
import TrendingStocks from '@/components/stock/TrendingStocks';
import StockInfo from '@/components/stock/StockInfo';
import StockChart from '@/components/charts/StockChart';
import VolumeChart from '@/components/charts/VolumeChart';
import Watchlist from '@/components/stock/Watchlist';
import TechnicalIndicators from '@/components/charts/TechnicalIndicators';
import MarketHeatmap from '@/components/dashboard/MarketHeatmap';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';
import SettingsModal from '@/components/settings/SettingsModal';
import { newsNotificationService } from '@/lib/services/newsNotificationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateTechnicalIndicators } from '@/lib/utils/calculations';
import {
  Moon,
  Sun,
  Star,
  Settings,
  Bell,
  TrendingUp,
  BarChart3,
  Activity,
  Laptop,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const {
    theme,
    toggleTheme,
    addToWatchlist,
    watchlist,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useStockStore();
  const [currentStock, setCurrentStock] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1M');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'indicators'>('chart');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRefMobile = useRef<HTMLButtonElement>(null);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('dark');

  const notificationCount = notifications.filter(n => !n.read).length;

  // Handle auto theme based on system preference
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        setAppliedTheme(e.matches ? 'dark' : 'light');
      };

      // Set initial theme
      updateTheme(mediaQuery);

      // Listen for changes
      mediaQuery.addEventListener('change', updateTheme);

      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      setAppliedTheme(theme);
    }
  }, [theme]);

  // Fetch news and notifications
  const fetchNewsNotifications = async () => {
    if (fetchingNews) return;

    setFetchingNews(true);
    try {
      const newNotifications = await newsNotificationService.fetchAllNotifications(watchlist);

      // Add each notification to the store (duplicates are handled by the store)
      newNotifications.forEach((notification) => {
        addNotification(notification);
      });
    } catch (error) {
      console.error('Error fetching news notifications:', error);
    } finally {
      setFetchingNews(false);
    }
  };

  useEffect(() => {
    // Set dark mode on initial load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Load default stock on mount
    loadStock('AAPL');

    // Fetch latest news notifications immediately on load
    fetchNewsNotifications();
  }, []);

  // Periodic news refresh (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewsNotifications();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [watchlist]); // Re-setup interval when watchlist changes

  const loadStock = async (symbol: string) => {
    setLoading(true);
    try {
      const [quote, historical] = await Promise.all([
        stockApi.getQuote(symbol),
        stockApi.getHistoricalData(symbol, selectedTimeFrame),
      ]);
      setCurrentStock(quote);
      setHistoricalData(historical);
      // Removed redundant success toast - UI already shows the loaded stock
    } catch (error) {
      toast.error('Error loading stock data');
      console.error(error);
    }
    setLoading(false);
  };

  const handleSelectStock = async (symbol: string, name: string) => {
    loadStock(symbol);
  };

  const handleTimeFrameChange = async (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
    if (currentStock) {
      try {
        const historical = await stockApi.getHistoricalData(currentStock.symbol, timeFrame);
        setHistoricalData(historical);
      } catch (error) {
        toast.error('Error loading historical data');
        console.error(error);
      }
    }
  };

  const handleAddToWatchlist = () => {
    if (currentStock) {
      const isAlreadyInWatchlist = watchlist.some((item) => item.symbol === currentStock.symbol);
      if (isAlreadyInWatchlist) {
        toast.error('Already in watchlist');
      } else {
        addToWatchlist({
          symbol: currentStock.symbol,
          name: currentStock.name,
          addedAt: Date.now(),
        });
        toast.success('Added to watchlist');
      }
    }
  };

  const indicators = historicalData.length > 0 ? calculateTechnicalIndicators(historicalData) : null;

  return (
    <div className={appliedTheme}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm overflow-visible">
          <div className="container mx-auto px-4 py-4 overflow-visible">
            {/* Desktop Layout - Single Row */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <h1 className="text-2xl font-bold">Stock Price Watch</h1>
                </div>

                <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === 'auto' ? (
                    <Laptop className="w-5 h-5" />
                  ) : theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
                <div className="relative">
                  <Button
                    ref={notificationButtonRef}
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  {notificationCount > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-white dark:border-gray-900 shadow-lg"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                  <NotificationsDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    buttonRef={notificationButtonRef}
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                    onMarkAllAsRead={markAllNotificationsAsRead}
                    onDelete={deleteNotification}
                    onClearAll={clearAllNotifications}
                    onRefresh={fetchNewsNotifications}
                    isRefreshing={fetchingNews}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                </div>
              </div>

              <div className="flex-1 max-w-2xl">
                <StockSearch onSelectStock={handleSelectStock} showTrending={false} />
              </div>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="lg:hidden space-y-4">
              {/* Row 1: Logo + Icons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <h1 className="text-xl font-bold">Stock Price Watch</h1>
                </div>

                <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === 'auto' ? (
                    <Laptop className="w-5 h-5" />
                  ) : theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
                <div className="relative">
                  <Button
                    ref={notificationButtonRefMobile}
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  {notificationCount > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-white dark:border-gray-900 shadow-lg"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                  <NotificationsDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    buttonRef={notificationButtonRefMobile}
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                    onMarkAllAsRead={markAllNotificationsAsRead}
                    onDelete={deleteNotification}
                    onClearAll={clearAllNotifications}
                    onRefresh={fetchNewsNotifications}
                    isRefreshing={fetchingNews}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                </div>
              </div>

              {/* Row 2: Search */}
              <div className="w-full">
                <StockSearch onSelectStock={handleSelectStock} showTrending={false} />
              </div>
            </div>
          </div>
        </header>

        {/* Trending Stocks - Not Sticky */}
        <TrendingStocks onSelectStock={handleSelectStock} />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Watchlist */}
            <div className="lg:col-span-3">
              <Watchlist onSelectStock={(symbol) => loadStock(symbol)} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-6 space-y-6">
              {loading ? (
                <Card>
                  <CardContent className="p-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              ) : currentStock ? (
                <>
                  {/* Stock Info */}
                  <div className="relative">
                    <StockInfo stock={currentStock} />
                    <Button
                      className="absolute bottom-6 right-6"
                      size="sm"
                      variant="outline"
                      onClick={handleAddToWatchlist}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Add to Watchlist
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
                    <button
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'chart'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('chart')}
                    >
                      <BarChart3 className="w-4 h-4 inline mr-2" />
                      Chart
                    </button>
                    <button
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'indicators'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('indicators')}
                    >
                      <Activity className="w-4 h-4 inline mr-2" />
                      Indicators
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'chart' && (
                    <Card>
                      <CardContent className="p-6">
                        <StockChart
                          data={historicalData}
                          symbol={currentStock.symbol}
                          onTimeFrameChange={handleTimeFrameChange}
                        />
                        <div className="mt-6">
                          <h3 className="font-semibold mb-4">Volume</h3>
                          <VolumeChart data={historicalData} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'indicators' && indicators && (
                    <TechnicalIndicators indicators={indicators} historicalData={historicalData} />
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold mb-2">Welcome to </h2>
                    <p className="text-gray-500">Search for a stock to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {indicators && <TechnicalIndicators indicators={indicators} historicalData={historicalData} compact={true} />}
            </div>
          </div>

          {/* Market Heatmap */}
          <div className="mt-6">
            <MarketHeatmap />
          </div>
        </main>

        {/* Settings Modal */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </div>
  );
}
