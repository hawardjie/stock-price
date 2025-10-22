'use client';

import React, { useEffect, useState } from 'react';
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
  Filler,
  ChartOptions,
} from 'chart.js';
import { StockHistoricalData, TimeFrame } from '@/types/stock';
import { useStockStore } from '@/lib/stores/useStockStore';
import { Button } from '@/components/ui/button';
import { calculateTechnicalIndicators } from '@/lib/utils/calculations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface StockChartProps {
  data: StockHistoricalData[];
  symbol: string;
  onTimeFrameChange?: (timeFrame: TimeFrame) => void;
}

const timeFrames: TimeFrame[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

export default function StockChart({ data, symbol, onTimeFrameChange }: StockChartProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1M');
  const { chartSettings, theme } = useStockStore();

  const indicators = data.length > 0 ? calculateTechnicalIndicators(data) : null;

  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
    onTimeFrameChange?.(timeFrame);
  };

  const chartData = {
    labels: data.map((d) => {
      const date = new Date(d.date);
      if (selectedTimeFrame === '1D') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: symbol,
        data: data.map((d) => d.close),
        borderColor: data[data.length - 1]?.close >= data[0]?.close ? '#10b981' : '#ef4444',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(
            0,
            data[data.length - 1]?.close >= data[0]?.close
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)'
          );
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
        fill: chartSettings.chartType === 'area',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3b82f6',
        borderWidth: 2,
      },
      ...(chartSettings.indicators.sma && indicators
        ? [
            {
              label: 'SMA 20',
              data: indicators.sma.sma20,
              borderColor: '#f59e0b',
              borderWidth: 1.5,
              pointRadius: 0,
              borderDash: [5, 5],
            },
            {
              label: 'SMA 50',
              data: indicators.sma.sma50,
              borderColor: '#8b5cf6',
              borderWidth: 1.5,
              pointRadius: 0,
              borderDash: [5, 5],
            },
          ]
        : []),
      ...(chartSettings.indicators.ema && indicators
        ? [
            {
              label: 'EMA 12',
              data: indicators.ema.ema12,
              borderColor: '#06b6d4',
              borderWidth: 1.5,
              pointRadius: 0,
              borderDash: [2, 2],
            },
          ]
        : []),
      ...(chartSettings.indicators.bollingerBands && indicators
        ? [
            {
              label: 'BB Upper',
              data: indicators.bollingerBands.upper,
              borderColor: '#a78bfa',
              borderWidth: 1,
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'BB Lower',
              data: indicators.bollingerBands.lower,
              borderColor: '#a78bfa',
              borderWidth: 1,
              pointRadius: 0,
              fill: false,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: chartSettings.showGrid,
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          display: chartSettings.showGrid,
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          callback: function (value) {
            return '$' + Number(value).toFixed(2);
          },
        },
        position: 'right' as const,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex gap-1">
          {timeFrames.map((tf) => (
            <Button
              key={tf}
              size="sm"
              variant={selectedTimeFrame === tf ? 'default' : 'outline'}
              onClick={() => handleTimeFrameChange(tf)}
              className="min-w-[50px]"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
