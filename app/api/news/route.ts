import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Fetch news from Alpha Vantage as fallback
 */
async function fetchAlphaVantageNews(symbol?: string) {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.warn('Alpha Vantage API key not configured');
    return [];
  }

  try {
    const params: any = {
      function: 'NEWS_SENTIMENT',
      apikey: apiKey,
      limit: 50,
    };

    if (symbol) {
      params.tickers = symbol;
    }

    const response = await axios.get('https://www.alphavantage.co/query', { params });

    // Alpha Vantage returns feed items
    const feed = response.data.feed || [];

    // Format to match Finnhub structure
    return feed.map((item: any) => {
      // Extract time published (format: YYYYMMDDTHHMMSS)
      const timePublished = item.time_published || '';
      const datetime = timePublished
        ? Math.floor(new Date(
            `${timePublished.slice(0, 4)}-${timePublished.slice(4, 6)}-${timePublished.slice(6, 8)}T${timePublished.slice(9, 11)}:${timePublished.slice(11, 13)}:${timePublished.slice(13, 15)}Z`
          ).getTime() / 1000)
        : Math.floor(Date.now() / 1000);

      return {
        category: 'general',
        datetime: datetime,
        headline: item.title || '',
        id: item.url ? btoa(item.url).slice(0, 20) : Math.random().toString(36),
        image: item.banner_image || '',
        related: symbol || '',
        source: item.source || 'Alpha Vantage',
        summary: item.summary || item.title || '',
        url: item.url || '#',
      };
    });
  } catch (error) {
    console.error('Error fetching news from Alpha Vantage:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  const finnhubApiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  try {
    let finnhubData: any[] = [];

    // Try Finnhub first (if API key is configured)
    if (finnhubApiKey) {
      try {
        let endpoint = '';
        const headers = { 'X-Finnhub-Token': finnhubApiKey };

        if (symbol) {
          // Company-specific news
          endpoint = 'https://finnhub.io/api/v1/company-news';
          const toDate = new Date();
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - 7);

          const response = await axios.get(endpoint, {
            params: {
              symbol: symbol,
              from: fromDate.toISOString().split('T')[0],
              to: toDate.toISOString().split('T')[0],
            },
            headers,
          });

          finnhubData = response.data || [];
        } else {
          // General market news
          endpoint = 'https://finnhub.io/api/v1/news';
          const response = await axios.get(endpoint, {
            params: {
              category: 'general',
            },
            headers,
          });

          finnhubData = response.data || [];
        }
      } catch (error) {
        console.error('Error fetching news from Finnhub:', error);
        finnhubData = [];
      }
    }

    // If Finnhub returns empty results, fallback to Alpha Vantage
    if (!finnhubData || finnhubData.length === 0) {
      const alphaVantageNews = await fetchAlphaVantageNews(symbol || undefined);
      return NextResponse.json(alphaVantageNews);
    }

    return NextResponse.json(finnhubData);
  } catch (error) {
    console.error('Error in news API route:', error);

    // Try Alpha Vantage as final fallback
    const alphaVantageNews = await fetchAlphaVantageNews(symbol || undefined);
    if (alphaVantageNews.length > 0) {
      return NextResponse.json(alphaVantageNews);
    }

    return NextResponse.json(
      { error: 'Failed to fetch news from all sources' },
      { status: 500 }
    );
  }
}
