'use client';

import React from 'react';
import { StockQuote } from '@/types/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatPercent } from '@/lib/utils/calculations';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Calendar } from 'lucide-react';

interface StockInfoProps {
  stock: StockQuote;
}

export default function StockInfo({ stock }: StockInfoProps) {
  const isPositive = stock.change >= 0;

  const infoItems = [
    { label: 'Open', value: `$${stock.open.toFixed(2)}`, icon: DollarSign },
    { label: 'Previous Close', value: `$${stock.previousClose.toFixed(2)}`, icon: Calendar },
    { label: 'Day High', value: `$${stock.dayHigh.toFixed(2)}`, icon: TrendingUp },
    { label: 'Day Low', value: `$${stock.dayLow.toFixed(2)}`, icon: TrendingDown },
    { label: 'Volume', value: formatNumber(stock.volume), icon: BarChart3 },
    { label: 'Avg Volume', value: formatNumber(stock.avgVolume), icon: Activity },
    { label: 'Market Cap', value: formatNumber(stock.marketCap), icon: DollarSign },
    { label: 'P/E Ratio', value: stock.peRatio.toFixed(2), icon: Activity },
    { label: 'EPS', value: `$${stock.eps.toFixed(2)}`, icon: DollarSign },
    { label: '52W High', value: `$${stock.high52Week.toFixed(2)}`, icon: TrendingUp },
    { label: '52W Low', value: `$${stock.low52Week.toFixed(2)}`, icon: TrendingDown },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">{stock.symbol}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stock.name}</p>
          </div>
          <Badge variant={isPositive ? 'success' : 'danger'}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {formatPercent(stock.changePercent)}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${stock.price.toFixed(2)}</span>
            <span
              className={`text-lg font-semibold ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}${stock.change.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Icon className="w-3 h-3" />
                  {item.label}
                </div>
                <div className="font-semibold text-sm">{item.value}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
