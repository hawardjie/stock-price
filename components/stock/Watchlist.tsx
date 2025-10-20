'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStockStore } from '@/lib/stores/useStockStore';
import { stockApi } from '@/lib/services/stockApi';
import { StockQuote } from '@/types/stock';
import { Star, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent } from '@/lib/utils/calculations';

interface WatchlistProps {
  onSelectStock: (symbol: string) => void;
}

export default function Watchlist({ onSelectStock }: WatchlistProps) {
  const { watchlist, removeFromWatchlist } = useStockStore();
  const [stockData, setStockData] = useState<Record<string, StockQuote>>({});

  useEffect(() => {
    const fetchWatchlistData = async () => {
      const data: Record<string, StockQuote> = {};
      for (const item of watchlist) {
        try {
          const quote = await stockApi.getQuote(item.symbol);
          data[item.symbol] = quote;
        } catch (error) {
          console.error(`Error fetching ${item.symbol}:`, error);
        }
      }
      setStockData(data);
    };

    if (watchlist.length > 0) {
      fetchWatchlistData();
      const interval = setInterval(fetchWatchlistData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  if (watchlist.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Your watchlist is empty</p>
            <p className="text-sm mt-1">Search for stocks to add them to your watchlist</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          Watchlist ({watchlist.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {watchlist.map((item) => {
            const quote = stockData[item.symbol];
            const isPositive = quote ? quote.change >= 0 : false;

            return (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => onSelectStock(item.symbol)}
              >
                <div className="flex-1">
                  <div className="font-bold">{item.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.name}</div>
                </div>
                {quote && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">${quote.price.toFixed(2)}</div>
                      <div className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(quote.changePercent)}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.symbol);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
