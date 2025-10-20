'use client';

import React, { useEffect, useState } from 'react';
import { useStockStore } from '@/lib/stores/useStockStore';
import { stockApi } from '@/lib/services/stockApi';
import { StockQuote, StockHistoricalData, TimeFrame } from '@/types/stock';
import StockSearch from '@/components/stock/StockSearch';
import StockInfo from '@/components/stock/StockInfo';
import StockChart from '@/components/charts/StockChart';
import VolumeChart from '@/components/charts/VolumeChart';
import Watchlist from '@/components/stock/Watchlist';
import TechnicalIndicators from '@/components/charts/TechnicalIndicators';
import MarketHeatmap from '@/components/dashboard/MarketHeatmap';
import NewsPanel from '@/components/dashboard/NewsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTechnicalIndicators } from '@/lib/utils/calculations';
import {
  Moon,
  Sun,
  Star,
  Settings,
  Bell,
  TrendingUp,
  BarChart3,
  Newspaper,
  Activity,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const { theme, toggleTheme, addToWatchlist, watchlist } = useStockStore();
  const [currentStock, setCurrentStock] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1M');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'indicators' | 'news'>('chart');

  useEffect(() => {
    // Set dark mode on initial load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Load default stock on mount
    loadStock('AAPL');
  }, []);

  const loadStock = async (symbol: string) => {
    setLoading(true);
    try {
      const [quote, historical] = await Promise.all([
        stockApi.getQuote(symbol),
        stockApi.getHistoricalData(symbol, selectedTimeFrame),
      ]);
      setCurrentStock(quote);
      setHistoricalData(historical);
      toast.success(`Loaded ${symbol}`);
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
    <div className={theme}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-bold">Stock Price Watch</h1>
              </div>

              <div className="flex-1 max-w-2xl">
                <StockSearch onSelectStock={handleSelectStock} />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

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
                    <button
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'news'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('news')}
                    >
                      <Newspaper className="w-4 h-4 inline mr-2" />
                      News
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
                    <TechnicalIndicators indicators={indicators} />
                  )}

                  {activeTab === 'news' && <NewsPanel symbol={currentStock.symbol} />}
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
              {indicators && <TechnicalIndicators indicators={indicators} />}
            </div>
          </div>

          {/* Market Heatmap */}
          <div className="mt-6">
            <MarketHeatmap />
          </div>
        </main>
      </div>
    </div>
  );
}
