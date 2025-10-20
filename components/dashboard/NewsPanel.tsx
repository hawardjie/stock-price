'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { stockApi } from '@/lib/services/stockApi';
import { StockNews } from '@/types/stock';
import { Newspaper, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsPanelProps {
  symbol?: string;
}

export default function NewsPanel({ symbol }: NewsPanelProps) {
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const newsData = await stockApi.getStockNews(symbol);
        setNews(newsData);
      } catch (error) {
        console.error('Error loading news:', error);
      }
      setLoading(false);
    };
    loadNews();
  }, [symbol]);

  const getSentimentColor = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card className="max-h-[700px] flex flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          {symbol ? `${symbol} News` : 'Market News'}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{item.headline}</h3>
                  {item.sentiment && (
                    <Badge variant={getSentimentColor(item.sentiment)} className="shrink-0">
                      {item.sentiment}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(item.datetime, { addSuffix: true })}</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    Read more
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
