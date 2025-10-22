'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { stockApi } from '@/lib/services/stockApi';
import { cn } from '@/lib/utils/cn';

interface TrendingStocksProps {
  onSelectStock: (symbol: string, name: string) => void;
}

export default function TrendingStocks({ onSelectStock }: TrendingStocksProps) {
  const [trending, setTrending] = useState<Array<{ symbol: string; name: string; change: number }>>([]);

  useEffect(() => {
    const loadTrending = async () => {
      const trendingStocks = await stockApi.getTrendingStocks();
      setTrending(trendingStocks);
    };
    loadTrending();
  }, []);

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h3 className="font-semibold text-sm">Trending Stocks</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {trending.map((stock) => (
          <div
            key={stock.symbol}
            className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onSelectStock(stock.symbol, stock.name)}
          >
            <div className="font-bold text-sm">{stock.symbol}</div>
            <div
              className={cn(
                'text-xs font-semibold',
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
