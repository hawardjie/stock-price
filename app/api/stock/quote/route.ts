import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        params: {
          interval: '1d',
          range: '1d',
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Check if response has valid data
    if (!response.data || !response.data.chart || !response.data.chart.result || response.data.chart.result.length === 0) {
      console.error('Invalid response structure from Yahoo Finance:', response.data);
      return NextResponse.json(
        { error: 'Invalid data received from Yahoo Finance' },
        { status: 500 }
      );
    }

    // Check for errors in Yahoo Finance response
    if (response.data.chart.error) {
      console.error('Yahoo Finance API error:', response.data.chart.error);
      return NextResponse.json(
        { error: `Yahoo Finance error: ${response.data.chart.error.description || 'Unknown error'}` },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching quote for symbol', symbol, ':', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      return NextResponse.json(
        {
          error: 'Failed to fetch quote from Yahoo Finance',
          details: error.response.data,
          status: error.response.status
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      console.error('No response received from Yahoo Finance');
      return NextResponse.json(
        { error: 'No response from Yahoo Finance. Service may be unavailable.' },
        { status: 503 }
      );
    } else {
      console.error('Error setting up request:', error.message);
      return NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      );
    }
  }
}
