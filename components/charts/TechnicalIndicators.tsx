'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechnicalIndicator } from '@/types/stock';
import { Activity, TrendingUp, TrendingDown, LineChart } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator;
  historicalData?: Array<{ date: number }>;
  compact?: boolean;
}

export default function TechnicalIndicators({ indicators, historicalData, compact = false }: TechnicalIndicatorsProps) {
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

  // Compact view for sidebar
  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">RSI (14)</span>
              <Badge variant={rsiSignal.color} className="text-xs">{rsiSignal.text}</Badge>
            </div>
            <div className="text-xl font-bold">{currentRSI?.toFixed(2) || 'N/A'}</div>
            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(currentRSI, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">MACD</span>
              <Badge variant={macdSignal.color} className="text-xs">{macdSignal.text}</Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">MACD</span>
                <span className="font-semibold">{currentMACD?.toFixed(4) || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Signal</span>
                <span className="font-semibold">{currentSignal?.toFixed(4) || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm font-semibold mb-2">Moving Averages</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">SMA (20)</span>
                <span className="font-semibold">
                  ${indicators.sma.sma20[indicators.sma.sma20.length - 1]?.toFixed(2) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">SMA (50)</span>
                <span className="font-semibold">
                  ${indicators.sma.sma50[indicators.sma.sma50.length - 1]?.toFixed(2) || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate labels from historical data or indices
  const labels = historicalData
    ? historicalData.map((d, i) => {
        if (i % Math.floor(historicalData.length / 10) === 0) {
          return new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return '';
      })
    : indicators.rsi.map((_, i) => i);

  // RSI Chart Data
  const rsiChartData = {
    labels,
    datasets: [
      {
        label: 'RSI',
        data: indicators.rsi,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Overbought (70)',
        data: Array(indicators.rsi.length).fill(70),
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: 'Oversold (30)',
        data: Array(indicators.rsi.length).fill(30),
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  const rsiChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // MACD Chart Data
  const macdChartData = {
    labels,
    datasets: [
      {
        label: 'MACD',
        data: indicators.macd.macd,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        type: 'line' as const,
      },
      {
        label: 'Signal',
        data: indicators.macd.signal,
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        type: 'line' as const,
      },
      {
        label: 'Histogram',
        data: indicators.macd.histogram,
        backgroundColor: indicators.macd.histogram.map(val =>
          val >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
        ),
        type: 'bar' as const,
      },
    ],
  };

  const macdChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* RSI Card with Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              RSI (Relative Strength Index)
            </div>
            <Badge variant={rsiSignal.color}>{rsiSignal.text}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Value</div>
              <div className="text-3xl font-bold">{currentRSI?.toFixed(2) || 'N/A'}</div>
            </div>
            <div className="text-right text-sm text-gray-600 dark:text-gray-400">
              <div>Range: 0-100</div>
              <div>Period: 14 days</div>
            </div>
          </div>
          <div className="h-48">
            <Line data={rsiChartData} options={rsiChartOptions} />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <strong>Interpretation:</strong> RSI measures momentum. Above 70 suggests overbought conditions (potential reversal down),
            below 30 suggests oversold conditions (potential reversal up).
          </div>
        </CardContent>
      </Card>

      {/* MACD Card with Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              MACD (Moving Average Convergence Divergence)
            </div>
            <Badge variant={macdSignal.color}>{macdSignal.text}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">MACD Line</div>
              <div className="text-lg font-semibold">{currentMACD?.toFixed(4) || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Signal Line</div>
              <div className="text-lg font-semibold">{currentSignal?.toFixed(4) || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Histogram</div>
              <div className={`text-lg font-semibold ${currentHistogram >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentHistogram >= 0 ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
                {' '}{currentHistogram?.toFixed(4) || 'N/A'}
              </div>
            </div>
          </div>
          <div className="h-48">
            <Line data={macdChartData} options={macdChartOptions} />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <strong>Interpretation:</strong> MACD shows trend direction and momentum. When MACD crosses above signal line,
            it's bullish. When it crosses below, it's bearish. Histogram shows the difference between MACD and signal.
          </div>
        </CardContent>
      </Card>

      {/* Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Moving Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-semibold mb-2">Simple Moving Averages (SMA)</div>
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
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-semibold mb-2">Exponential Moving Averages (EMA)</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">EMA (12)</span>
                    <span className="font-semibold">
                      ${indicators.ema.ema12[indicators.ema.ema12.length - 1]?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">EMA (26)</span>
                    <span className="font-semibold">
                      ${indicators.ema.ema26[indicators.ema.ema26.length - 1]?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">EMA (50)</span>
                    <span className="font-semibold">
                      ${indicators.ema.ema50[indicators.ema.ema50.length - 1]?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>Interpretation:</strong> Moving averages smooth price data to identify trends. SMA gives equal weight to all prices,
              while EMA gives more weight to recent prices. When price is above MA, it suggests an uptrend; below suggests a downtrend.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bollinger Bands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Bollinger Bands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <div className="text-xs text-gray-600 dark:text-gray-400">Upper Band</div>
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  ${indicators.bollingerBands.upper[indicators.bollingerBands.upper.length - 1]?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="text-xs text-gray-600 dark:text-gray-400">Middle Band (SMA 20)</div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ${indicators.bollingerBands.middle[indicators.bollingerBands.middle.length - 1]?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <div className="text-xs text-gray-600 dark:text-gray-400">Lower Band</div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ${indicators.bollingerBands.lower[indicators.bollingerBands.lower.length - 1]?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>Interpretation:</strong> Bollinger Bands measure volatility. When bands are narrow, volatility is low;
              when bands are wide, volatility is high. Price touching upper band suggests overbought, touching lower band suggests oversold.
              The bands are typically set at 2 standard deviations from the 20-day SMA.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
