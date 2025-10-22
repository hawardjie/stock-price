import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      'https://query2.finance.yahoo.com/v6/finance/autocomplete',
      {
        params: {
          query: query,
          lang: 'en-US',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Validate response structure
    if (!response.data || !response.data.ResultSet || !response.data.ResultSet.Result) {
      console.error('Invalid response structure:', response.data);
      return NextResponse.json(
        { error: 'Invalid response from Yahoo Finance' },
        { status: 500 }
      );
    }

    // Filter to only include stocks (type 'S') and ETFs (type 'E'), exclude options
    const results = response.data.ResultSet.Result
      .filter((item: any) => item.type === 'S' || item.type === 'E')
      .slice(0, 10)
      .map((item: any) => ({
        symbol: item.symbol,
        longName: item.name,
        shortName: item.name,
      }));

    // Format response to match expected structure
    return NextResponse.json({
      quoteResponse: {
        result: results
      }
    });
  } catch (error: any) {
    console.error('Error searching stocks:', error);

    // Enhanced error handling
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || 'Failed to search stocks';

      console.error(`Yahoo Finance API error (${status}):`, error.response.data);

      return NextResponse.json(
        { error: errorMessage },
        { status: status === 404 ? 404 : 500 }
      );
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timeout - Yahoo Finance is taking too long to respond' },
        { status: 504 }
      );
    } else if (error.request) {
      console.error('No response received from Yahoo Finance');
      return NextResponse.json(
        { error: 'Unable to reach Yahoo Finance service' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
