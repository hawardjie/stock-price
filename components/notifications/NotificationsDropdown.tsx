'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Check, TrendingUp, TrendingDown, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStockStore, Notification } from '@/lib/stores/useStockStore';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function NotificationsDropdown({
  isOpen,
  onClose,
  buttonRef,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onRefresh,
  isRefreshing = false,
}: NotificationsDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; right?: number; left?: number }>({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640); // sm breakpoint

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (isOpen && buttonRef?.current) {
        // Recalculate position on resize
        const rect = buttonRef.current.getBoundingClientRect();
        const isMobileView = window.innerWidth < 640;
        const dropdownWidth = 384;
        const viewportWidth = window.innerWidth;
        const spacing = 16;

        if (isMobileView) {
          setPosition({
            top: rect.bottom + 8,
            left: spacing,
          });
        } else {
          const rightPosition = viewportWidth - rect.right;
          const leftPosition = rect.right - dropdownWidth;

          if (leftPosition < spacing) {
            setPosition({
              top: rect.bottom + 8,
              left: spacing,
            });
          } else {
            setPosition({
              top: rect.bottom + 8,
              right: rightPosition,
            });
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, buttonRef]);

  useEffect(() => {
    if (isOpen) {
      const isMobileView = window.innerWidth < 640;
      setIsMobile(isMobileView);

      if (buttonRef?.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 384; // w-96 = 384px
        const viewportWidth = window.innerWidth;
        const spacing = 16; // 1rem padding

        if (isMobileView) {
          // On mobile, center the dropdown with spacing on both sides
          setPosition({
            top: rect.bottom + 8,
            left: spacing,
          });
        } else {
          // On desktop, position from right but ensure it doesn't overflow
          const rightPosition = viewportWidth - rect.right;
          const leftPosition = rect.right - dropdownWidth;

          // Check if dropdown would overflow on the left
          if (leftPosition < spacing) {
            // If it would overflow, position from left with spacing
            setPosition({
              top: rect.bottom + 8,
              left: spacing,
            });
          } else {
            // Normal right-aligned positioning
            setPosition({
              top: rect.bottom + 8,
              right: rightPosition,
            });
          }
        }
      } else {
        // Fallback position if ref is not available
        setPosition({
          top: 60,
          right: 16,
        });
      }
    }
  }, [isOpen, buttonRef]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'news':
        return <Info className="w-4 h-4 text-purple-500" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'watchlist':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen || !mounted) return null;

  const dropdownContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
      />

      {/* Dropdown */}
      <Card
        className={`fixed z-[70] shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
          isMobile ? 'left-4 right-4 w-auto' : 'w-96'
        }`}
        style={{
          top: `${position.top}px`,
          ...(position.right !== undefined && { right: `${position.right}px` }),
          ...(position.left !== undefined && !isMobile && { left: `${position.left}px` }),
        }}
      >
        {/* Header */}
        <div className={`border-b border-gray-200 dark:border-gray-800 ${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-blue-500">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className={isMobile ? 'h-9 w-9' : 'h-8 w-8'}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className={isMobile ? 'h-9 w-9' : 'h-8 w-8'}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {notifications.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${isMobile ? 'mt-2' : 'mt-3'}`}>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className={`overflow-y-auto ${isMobile ? 'max-h-[60vh]' : 'max-h-[500px]'}`}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs mt-1">Price alerts and updates will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  } ${isMobile ? 'p-3' : 'p-4'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          {notification.symbol && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {notification.symbol}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1"
                          onClick={() => onDelete(notification.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-xs h-6 px-2"
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View all notifications
            </button>
          </div>
        )}
      </Card>
    </>
  );

  return createPortal(dropdownContent, document.body);
}
