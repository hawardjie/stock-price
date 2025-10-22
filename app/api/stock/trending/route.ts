import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      'https://query2.finance.yahoo.com/v1/finance/trending/US',
      {
        params: {
          count: 8,
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
    if (!response.data || !response.data.finance || !response.data.finance.result) {
      console.error('Invalid response structure:', response.data);
      return NextResponse.json(
        { error: 'Invalid response from Yahoo Finance' },
        { status: 500 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: any) {

    // Enhanced error handling
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || 'Failed to fetch trending stocks';

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
      { error: 'Failed to fetch trending stocks' },
      { status: 500 }
    );
  }
}
