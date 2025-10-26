import { stockApi } from './stockApi';
import { Notification } from '../stores/useStockStore';
import { StockNews } from '@/types/stock';

class NewsNotificationService {
  /**
   * Fetch general market news and convert to notifications
   */
  async fetchMarketNews(): Promise<Omit<Notification, 'id'>[]> {
    try {
      const news = await stockApi.getStockNews();
      if (!news || news.length === 0) {
        return [];
      }
      return this.convertNewsToNotifications(news);
    } catch (error) {
      console.error('Error fetching market news:', error);
      return [];
    }
  }

  /**
   * Fetch news for specific stocks (watchlist)
   */
  async fetchStockNews(symbols: string[]): Promise<Omit<Notification, 'id'>[]> {
    try {
      const allNotifications: Omit<Notification, 'id'>[] = [];

      for (const symbol of symbols.slice(0, 5)) { // Limit to first 5 stocks
        const news = await stockApi.getStockNews(symbol);
        if (news && news.length > 0) {
          const notifications = this.convertNewsToNotifications(news.slice(0, 2), symbol); // Top 2 news per stock
          allNotifications.push(...notifications);
        }
      }

      return allNotifications;
    } catch (error) {
      console.error('Error fetching stock news:', error);
      return [];
    }
  }

  /**
   * Fetch price alerts based on watchlist and current prices
   */
  async checkPriceAlerts(watchlist: Array<{ symbol: string; name: string }>): Promise<Omit<Notification, 'id'>[]> {
    try {
      const notifications: Omit<Notification, 'id'>[] = [];

      for (const item of watchlist.slice(0, 3)) { // Check first 3 stocks
        const quote = await stockApi.getQuote(item.symbol);

        // Generate alert if significant price movement (> 3%)
        if (Math.abs(quote.changePercent) > 3) {
          const direction = quote.changePercent > 0 ? 'up' : 'down';
          const priceChange = Math.abs(quote.change).toFixed(2);
          const percentChange = Math.abs(quote.changePercent).toFixed(2);

          // Generate contextual message based on magnitude
          let context = '';
          if (Math.abs(quote.changePercent) > 10) {
            context = 'This represents a significant market movement. Consider reviewing your position.';
          } else if (Math.abs(quote.changePercent) > 5) {
            context = 'Notable price movement detected. Volume is tracking above average.';
          } else {
            context = 'Moderate price movement observed in today\'s trading session.';
          }

          notifications.push({
            type: 'price_alert',
            title: `${item.symbol} Price ${quote.changePercent > 0 ? 'Surge' : 'Drop'}`,
            message: `${item.name} is ${direction} ${percentChange}% ($${priceChange}) trading at $${quote.price.toFixed(2)}. ${context}`,
            timestamp: Date.now(),
            read: false,
            symbol: item.symbol,
          });
        }

        // Check for high volume (50% above average)
        if (quote.volume > quote.avgVolume * 1.5) {
          const volumeRatio = (quote.volume / quote.avgVolume).toFixed(1);
          const formattedVolume = this.formatVolume(quote.volume);
          const formattedAvgVolume = this.formatVolume(quote.avgVolume);

          notifications.push({
            type: 'watchlist',
            title: `${item.symbol} High Volume Alert`,
            message: `${item.name} is experiencing ${volumeRatio}x normal trading volume (${formattedVolume} vs avg ${formattedAvgVolume}). This may indicate increased investor interest or upcoming news.`,
            timestamp: Date.now(),
            read: false,
            symbol: item.symbol,
          });
        }

        // Check for 52-week high/low
        if (quote.price >= quote.high52Week * 0.98) {
          notifications.push({
            type: 'price_alert',
            title: `${item.symbol} Near 52-Week High`,
            message: `${item.name} is trading near its 52-week high of $${quote.high52Week.toFixed(2)}. Current price: $${quote.price.toFixed(2)}. The stock has strong momentum.`,
            timestamp: Date.now(),
            read: false,
            symbol: item.symbol,
          });
        } else if (quote.price <= quote.low52Week * 1.02) {
          notifications.push({
            type: 'price_alert',
            title: `${item.symbol} Near 52-Week Low`,
            message: `${item.name} is trading near its 52-week low of $${quote.low52Week.toFixed(2)}. Current price: $${quote.price.toFixed(2)}. This could present a buying opportunity.`,
            timestamp: Date.now(),
            read: false,
            symbol: item.symbol,
          });
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error checking price alerts:', error);
      return [];
    }
  }

  /**
   * Format volume numbers for readability
   */
  private formatVolume(volume: number): string {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  }

  /**
   * Convert StockNews to Notification format
   */
  private convertNewsToNotifications(news: StockNews[], symbol?: string): Omit<Notification, 'id'>[] {
    return news.map((item) => ({
      type: 'news' as const,
      title: this.truncateTitle(item.headline),
      message: item.summary,
      timestamp: item.datetime,
      read: false,
      symbol: symbol,
      url: item.url,
      source: item.source,
    }));
  }

  /**
   * Truncate long titles to fit notification UI
   */
  private truncateTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  }

  /**
   * Create welcome notification for new users
   */
  createWelcomeNotification(): Omit<Notification, 'id'> {
    const hour = new Date().getHours();
    let greeting = 'Welcome';

    if (hour < 12) {
      greeting = 'Good morning! Welcome';
    } else if (hour < 18) {
      greeting = 'Good afternoon! Welcome';
    } else {
      greeting = 'Good evening! Welcome';
    }

    const tips = [
      'Add stocks to your watchlist to receive personalized alerts and updates.',
      'Use the Indicators tab to analyze technical signals like RSI and MACD.',
      'Click the refresh icon in notifications to get the latest market news.',
      'Track multiple stocks side-by-side and compare their performance.',
      'Set up your chart preferences in Settings to customize your experience.',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return {
      type: 'system',
      title: `${greeting} to Stock Price Watch`,
      message: `Start exploring real-time stock prices, financial news, and technical analysis. Pro tip: ${randomTip}`,
      timestamp: Date.now(),
      read: false,
    };
  }

  /**
   * Normalize text for comparison (remove punctuation, extra spaces, convert to lowercase)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')     // Normalize spaces
      .trim();
  }

  /**
   * Check if two titles are similar enough to be considered duplicates
   */
  private areTitlesSimilar(title1: string, title2: string): boolean {
    const normalized1 = this.normalizeText(title1);
    const normalized2 = this.normalizeText(title2);

    // Exact match after normalization
    if (normalized1 === normalized2) {
      return true;
    }

    // Check if one title contains most of the other (at least 80% overlap)
    const words1 = normalized1.split(' ').filter(w => w.length > 3); // Ignore short words
    const words2 = normalized2.split(' ').filter(w => w.length > 3);

    if (words1.length === 0 || words2.length === 0) {
      return false;
    }

    // Count matching words
    const matchingWords = words1.filter(word => words2.includes(word)).length;
    const similarity1 = matchingWords / words1.length;
    const similarity2 = matchingWords / words2.length;

    // If either direction has 80% similarity, consider them similar
    return similarity1 >= 0.8 || similarity2 >= 0.8;
  }

  /**
   * Check if two news notifications are duplicates based on content similarity
   */
  private areNewsDuplicates(notif1: Omit<Notification, 'id'>, notif2: Omit<Notification, 'id'>): boolean {
    // Both must be news type
    if (notif1.type !== 'news' || notif2.type !== 'news') {
      return false;
    }

    // Check URL first - if same URL, definitely duplicate
    if (notif1.url && notif2.url && notif1.url === notif2.url) {
      return true;
    }

    // Check title similarity
    if (this.areTitlesSimilar(notif1.title, notif2.title)) {
      return true;
    }

    // Check message/summary similarity
    if (notif1.message && notif2.message) {
      const normalizedMsg1 = this.normalizeText(notif1.message.substring(0, 200)); // First 200 chars
      const normalizedMsg2 = this.normalizeText(notif2.message.substring(0, 200));

      if (normalizedMsg1 === normalizedMsg2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Deduplicate notifications based on URL, title similarity, and content for news
   */
  private deduplicateNotifications(notifications: Omit<Notification, 'id'>[]): Omit<Notification, 'id'>[] {
    const uniqueNotifications: Omit<Notification, 'id'>[] = [];

    for (const notification of notifications) {
      let isDuplicate = false;

      // For news notifications, use comprehensive similarity check
      if (notification.type === 'news') {
        isDuplicate = uniqueNotifications.some(existing =>
          this.areNewsDuplicates(notification, existing)
        );

        // If it's a duplicate but current has a symbol and existing doesn't, replace it
        if (isDuplicate && notification.symbol) {
          const duplicateIndex = uniqueNotifications.findIndex(existing =>
            this.areNewsDuplicates(notification, existing)
          );
          if (duplicateIndex !== -1 && !uniqueNotifications[duplicateIndex].symbol) {
            uniqueNotifications[duplicateIndex] = notification;
          }
        }
      }
      // For price/watchlist alerts, use exact matching
      else if (notification.type === 'price_alert' || notification.type === 'watchlist') {
        isDuplicate = uniqueNotifications.some(existing =>
          existing.type === notification.type &&
          existing.symbol === notification.symbol &&
          existing.title === notification.title
        );
      }
      // For system notifications, use exact title match
      else {
        isDuplicate = uniqueNotifications.some(existing =>
          existing.type === notification.type &&
          existing.title === notification.title
        );
      }

      // Add if not duplicate
      if (!isDuplicate) {
        uniqueNotifications.push(notification);
      }
    }

    return uniqueNotifications;
  }

  /**
   * Fetch all notifications (news + price alerts)
   */
  async fetchAllNotifications(watchlist: Array<{ symbol: string; name: string }>): Promise<Omit<Notification, 'id'>[]> {
    try {
      // If watchlist is empty, fetch news for popular stocks
      const defaultStocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];
      const stockSymbols = watchlist.length > 0
        ? watchlist.map(w => w.symbol)
        : defaultStocks;

      const [marketNews, stockNews, priceAlerts] = await Promise.all([
        this.fetchMarketNews(),
        this.fetchStockNews(stockSymbols),
        watchlist.length > 0 ? this.checkPriceAlerts(watchlist) : Promise.resolve([]),
      ]);

      // Combine all notifications
      const allNotifications = [...priceAlerts, ...stockNews, ...marketNews];

      // Deduplicate notifications (remove duplicates within the same fetch)
      const uniqueNotifications = this.deduplicateNotifications(allNotifications);

      // Sort by timestamp (newest first)
      return uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return [];
    }
  }
}

export const newsNotificationService = new NewsNotificationService();
