'use client';

import React, { useState } from 'react';
import {
  Settings,
  X,
  Palette,
  Bell,
  BarChart3,
  Monitor,
  Clock,
  RefreshCw,
  Save,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStockStore } from '@/lib/stores/useStockStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme, chartSettings, updateChartSettings } = useStockStore();
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'chart' | 'data'>('appearance');
  const [localSettings, setLocalSettings] = useState(chartSettings);
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [notificationSettings, setNotificationSettings] = useState({
    priceAlerts: true,
    newsUpdates: true,
    volumeAlerts: true,
    marketUpdates: false,
    emailNotifications: false,
  });

  const handleSave = () => {
    updateChartSettings(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'chart' as const, label: 'Chart', icon: BarChart3 },
    { id: 'data' as const, label: 'Data', icon: RefreshCw },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <div className="flex h-[600px]">
            {/* Sidebar Tabs */}
            <div className="w-48 border-r border-gray-200 dark:border-gray-800 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Customize the look and feel of your dashboard
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={theme === 'light' ? undefined : toggleTheme}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Light</div>
                      </button>
                      <button
                        onClick={theme === 'dark' ? undefined : toggleTheme}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Dark</div>
                      </button>
                      <button
                        className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <Laptop className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Auto</div>
                        <Badge className="mt-1 text-xs">Soon</Badge>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Chart Colors</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm">Up/Gain Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={localSettings.colors.upColor}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                colors: { ...localSettings.colors, upColor: e.target.value },
                              })
                            }
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <span className="text-xs text-gray-500 font-mono">
                            {localSettings.colors.upColor}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm">Down/Loss Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={localSettings.colors.downColor}
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                colors: { ...localSettings.colors, downColor: e.target.value },
                              })
                            }
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <span className="text-xs text-gray-500 font-mono">
                            {localSettings.colors.downColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Choose what notifications you want to receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when stocks reach your target prices' },
                      { key: 'newsUpdates', label: 'News Updates', description: 'Breaking news about stocks in your watchlist' },
                      { key: 'volumeAlerts', label: 'Volume Alerts', description: 'Unusual trading volume notifications' },
                      { key: 'marketUpdates', label: 'Market Updates', description: 'Daily market summaries and trends' },
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    ].map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{setting.label}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {setting.description}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chart Tab */}
              {activeTab === 'chart' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Chart Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Customize your chart display preferences
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Chart Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, chartType: 'line' })}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          localSettings.chartType === 'line'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">Line Chart</div>
                        <div className="text-xs text-gray-500 mt-1">Clean and simple</div>
                      </button>
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, chartType: 'candlestick' })}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          localSettings.chartType === 'candlestick'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">Candlestick</div>
                        <div className="text-xs text-gray-500 mt-1">Detailed OHLC</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Display Options</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Show Volume</div>
                          <div className="text-xs text-gray-500">Display volume bars below chart</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localSettings.showVolume}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, showVolume: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Show Grid</div>
                          <div className="text-xs text-gray-500">Display grid lines on chart</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localSettings.showGrid}
                            onChange={(e) =>
                              setLocalSettings({ ...localSettings, showGrid: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Technical Indicators (Overlay)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'sma', label: 'SMA' },
                        { key: 'ema', label: 'EMA' },
                        { key: 'bollingerBands', label: 'Bollinger Bands' },
                        { key: 'macd', label: 'MACD' },
                        { key: 'rsi', label: 'RSI' },
                      ].map((indicator) => (
                        <div
                          key={indicator.key}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            localSettings.indicators[indicator.key as keyof typeof localSettings.indicators]
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() =>
                            setLocalSettings({
                              ...localSettings,
                              indicators: {
                                ...localSettings.indicators,
                                [indicator.key]: !localSettings.indicators[indicator.key as keyof typeof localSettings.indicators],
                              },
                            })
                          }
                        >
                          <div className="text-sm font-medium">{indicator.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Data Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Configure data refresh and update preferences
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Auto Refresh Interval</label>
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                    >
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-blue-900 dark:text-blue-100">
                          Real-time Data
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Market data is delayed by 15 minutes. Upgrade to premium for real-time quotes.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Data Management</label>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Monitor className="w-4 h-4 mr-2" />
                        Export Watchlist
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
