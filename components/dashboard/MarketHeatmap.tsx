'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stockApi } from '@/lib/services/stockApi';
import { MarketSector } from '@/types/stock';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function MarketHeatmap() {
  const [sectors, setSectors] = useState<MarketSector[]>([]);

  useEffect(() => {
    const loadSectors = async () => {
      const data = await stockApi.getMarketSectors();
      setSectors(data);
    };
    loadSectors();
  }, []);

  const getColorClass = (change: number) => {
    if (change > 2) return 'bg-green-600 text-white';
    if (change > 0) return 'bg-green-400 text-gray-900';
    if (change > -2) return 'bg-red-400 text-gray-900';
    return 'bg-red-600 text-white';
  };

  const getSize = (marketCap: number) => {
    const maxCap = Math.max(...sectors.map((s) => s.marketCap));
    const ratio = marketCap / maxCap;
    if (ratio > 0.7) return 'col-span-2 row-span-2';
    if (ratio > 0.4) return 'col-span-2';
    return 'col-span-1';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Market Sectors Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 auto-rows-[100px]">
          {sectors.map((sector) => (
            <div
              key={sector.symbol}
              className={cn(
                'rounded-lg p-4 flex flex-col justify-between transition-all hover:scale-105 cursor-pointer',
                getColorClass(sector.change),
                getSize(sector.marketCap)
              )}
            >
              <div>
                <div className="font-bold text-sm">{sector.name}</div>
                <div className="text-xs opacity-90">{sector.symbol}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {sector.change >= 0 ? '+' : ''}
                  {sector.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span>Strong Gain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded" />
            <span>Gain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded" />
            <span>Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span>Strong Loss</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
