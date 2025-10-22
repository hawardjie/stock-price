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
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending stocks' },
      { status: 500 }
    );
  }
}
