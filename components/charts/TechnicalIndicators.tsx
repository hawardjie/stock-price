'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechnicalIndicator } from '@/types/stock';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator;
}

export default function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  const currentRSI = indicators.rsi[indicators.rsi.length - 1];
  const currentMACD = indicators.macd.macd[indicators.macd.macd.length - 1];
  const currentSignal = indicators.macd.signal[indicators.macd.signal.length - 1];
  const currentHistogram = indicators.macd.histogram[indicators.macd.histogram.length - 1];

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'danger' as const };
    if (rsi < 30) return { text: 'Oversold', color: 'success' as const };
    return { text: 'Neutral', color: 'default' as const };
  };

  const getMACDSignal = () => {
    if (currentMACD > currentSignal) return { text: 'Bullish', color: 'success' as const };
    if (currentMACD < currentSignal) return { text: 'Bearish', color: 'danger' as const };
    return { text: 'Neutral', color: 'default' as const };
  };

  const rsiSignal = getRSISignal(currentRSI);
  const macdSignal = getMACDSignal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Technical Indicators
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">RSI (14)</span>
            <Badge variant={rsiSignal.color}>{rsiSignal.text}</Badge>
          </div>
          <div className="text-2xl font-bold">{currentRSI?.toFixed(2) || 'N/A'}</div>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${Math.min(currentRSI, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Oversold (30)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">MACD</span>
            <Badge variant={macdSignal.color}>{macdSignal.text}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">MACD Line</span>
              <span className="font-semibold">{currentMACD?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Signal Line</span>
              <span className="font-semibold">{currentSignal?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Histogram</span>
              <span
                className={`font-semibold ${
                  currentHistogram >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {currentHistogram >= 0 ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
                {' '}{currentHistogram?.toFixed(4) || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="font-semibold mb-3">Moving Averages</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">SMA (20)</span>
              <span className="font-semibold">
                ${indicators.sma.sma20[indicators.sma.sma20.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">SMA (50)</span>
              <span className="font-semibold">
                ${indicators.sma.sma50[indicators.sma.sma50.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">SMA (200)</span>
              <span className="font-semibold">
                ${indicators.sma.sma200[indicators.sma.sma200.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="font-semibold mb-3">Bollinger Bands</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Upper Band</span>
              <span className="font-semibold">
                ${indicators.bollingerBands.upper[indicators.bollingerBands.upper.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Middle Band</span>
              <span className="font-semibold">
                ${indicators.bollingerBands.middle[indicators.bollingerBands.middle.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Lower Band</span>
              <span className="font-semibold">
                ${indicators.bollingerBands.lower[indicators.bollingerBands.lower.length - 1]?.toFixed(2) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
