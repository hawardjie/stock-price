'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { StockHistoricalData } from '@/types/stock';
import { useStockStore } from '@/lib/stores/useStockStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VolumeChartProps {
  data: StockHistoricalData[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  const { theme } = useStockStore();

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Volume',
        data: data.map((d) => d.volume),
        backgroundColor: data.map((d, i) =>
          i > 0 && d.close >= data[i - 1].close
            ? 'rgba(16, 185, 129, 0.5)'
            : 'rgba(239, 68, 68, 0.5)'
        ),
        borderColor: data.map((d, i) =>
          i > 0 && d.close >= data[i - 1].close ? '#10b981' : '#ef4444'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return 'Volume: ' + (value / 1000000).toFixed(2) + 'M';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          callback: function (value: any) {
            return (value / 1000000).toFixed(0) + 'M';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[150px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
