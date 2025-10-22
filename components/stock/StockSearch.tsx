'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, TrendingUp } from 'lucide-react';
import { stockApi } from '@/lib/services/stockApi';
import { cn } from '@/lib/utils/cn';

interface StockSearchProps {
  onSelectStock: (symbol: string, name: string) => void;
  showTrending?: boolean;
}

export default function StockSearch({ onSelectStock, showTrending = true }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ symbol: string; name: string }>>([]);
  const [trending, setTrending] = useState<Array<{ symbol: string; name: string; change: number }>>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadTrending = async () => {
      const trendingStocks = await stockApi.getTrendingStocks();
      setTrending(trendingStocks);
    };
    loadTrending();
  }, []);

  useEffect(() => {
    const searchStocks = async () => {
      if (query.length > 0) {
        const searchResults = await stockApi.searchStocks(query);
        setResults(searchResults);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (symbol: string, name: string) => {
    onSelectStock(symbol, name);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, MSFT)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length === 0 && setShowResults(false)}
          className="pl-10"
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-[300px] overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <div
                key={result.symbol}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors"
                onClick={() => handleSelect(result.symbol, result.name)}
              >
                <div className="font-semibold">{result.symbol}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{result.name}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showTrending && !showResults && trending.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm">Trending Stocks</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {trending.map((stock) => (
              <div
                key={stock.symbol}
                className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => handleSelect(stock.symbol, stock.name)}
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
      )}
    </div>
  );
}
