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
      'https://query2.finance.yahoo.com/v7/finance/quote',
      {
        params: {
          q: query,
          lang: 'en-US',
          region: 'US',
          quotesCount: 10,
          newsCount: 0,
          enableFuzzyQuery: false,
          quotesQueryId: 'tss_match_phrase_query',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
