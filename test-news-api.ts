/**
 * Test script for News API (Finnhub + Alpha Vantage fallback)
 *
 * This script tests:
 * 1. Finnhub API for general market news
 * 2. Finnhub API for specific stock news
 * 3. Alpha Vantage API for general market news
 * 4. Alpha Vantage API for specific stock news
 * 5. Fallback mechanism when Finnhub returns empty results
 */

import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  data?: any;
}

const results: TestResult[] = [];

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name: string) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Testing: ${name}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

async function testFinnhubGeneralNews() {
  logTest('Finnhub - General Market News');

  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!apiKey) {
    log('⚠️  NEXT_PUBLIC_FINNHUB_API_KEY not configured', 'yellow');
    results.push({
      test: 'Finnhub General News',
      passed: false,
      message: 'API key not configured',
    });
    return;
  }

  try {
    const response = await axios.get('https://finnhub.io/api/v1/news', {
      params: { category: 'general' },
      headers: { 'X-Finnhub-Token': apiKey },
    });

    const newsData = response.data;
    log(`✓ API call successful`, 'green');
    log(`  Articles returned: ${newsData.length}`, 'blue');

    if (newsData.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Headline: ${newsData[0].headline}`, 'blue');
      log(`    - Source: ${newsData[0].source}`, 'blue');
      log(`    - URL: ${newsData[0].url}`, 'blue');

      results.push({
        test: 'Finnhub General News',
        passed: true,
        message: `Successfully fetched ${newsData.length} articles`,
        data: newsData.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: 'Finnhub General News',
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    results.push({
      test: 'Finnhub General News',
      passed: false,
      message: error.message,
    });
  }
}

async function testFinnhubStockNews(symbol: string = 'AAPL') {
  logTest(`Finnhub - Stock-Specific News (${symbol})`);

  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!apiKey) {
    log('⚠️  NEXT_PUBLIC_FINNHUB_API_KEY not configured', 'yellow');
    results.push({
      test: `Finnhub Stock News (${symbol})`,
      passed: false,
      message: 'API key not configured',
    });
    return;
  }

  try {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const response = await axios.get('https://finnhub.io/api/v1/company-news', {
      params: {
        symbol: symbol,
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
      },
      headers: { 'X-Finnhub-Token': apiKey },
    });

    const newsData = response.data;
    log(`✓ API call successful`, 'green');
    log(`  Articles returned: ${newsData.length}`, 'blue');

    if (newsData.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Headline: ${newsData[0].headline}`, 'blue');
      log(`    - Source: ${newsData[0].source}`, 'blue');
      log(`    - URL: ${newsData[0].url}`, 'blue');

      results.push({
        test: `Finnhub Stock News (${symbol})`,
        passed: true,
        message: `Successfully fetched ${newsData.length} articles`,
        data: newsData.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: `Finnhub Stock News (${symbol})`,
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    results.push({
      test: `Finnhub Stock News (${symbol})`,
      passed: false,
      message: error.message,
    });
  }
}

async function testAlphaVantageGeneralNews() {
  logTest('Alpha Vantage - General Market News');

  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    log('⚠️  NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY not configured', 'yellow');
    results.push({
      test: 'Alpha Vantage General News',
      passed: false,
      message: 'API key not configured',
    });
    return;
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        apikey: apiKey,
        limit: 50,
      },
    });

    const feed = response.data.feed || [];
    log(`✓ API call successful`, 'green');
    log(`  Articles returned: ${feed.length}`, 'blue');

    if (feed.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Title: ${feed[0].title}`, 'blue');
      log(`    - Source: ${feed[0].source}`, 'blue');
      log(`    - URL: ${feed[0].url}`, 'blue');
      log(`    - Time: ${feed[0].time_published}`, 'blue');

      results.push({
        test: 'Alpha Vantage General News',
        passed: true,
        message: `Successfully fetched ${feed.length} articles`,
        data: feed.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: 'Alpha Vantage General News',
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    if (error.response?.data) {
      log(`  Response: ${JSON.stringify(error.response.data)}`, 'red');
    }
    results.push({
      test: 'Alpha Vantage General News',
      passed: false,
      message: error.message,
    });
  }
}

async function testAlphaVantageStockNews(symbol: string = 'AAPL') {
  logTest(`Alpha Vantage - Stock-Specific News (${symbol})`);

  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    log('⚠️  NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY not configured', 'yellow');
    results.push({
      test: `Alpha Vantage Stock News (${symbol})`,
      passed: false,
      message: 'API key not configured',
    });
    return;
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        apikey: apiKey,
        limit: 50,
      },
    });

    const feed = response.data.feed || [];
    log(`✓ API call successful`, 'green');
    log(`  Articles returned: ${feed.length}`, 'blue');

    if (feed.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Title: ${feed[0].title}`, 'blue');
      log(`    - Source: ${feed[0].source}`, 'blue');
      log(`    - URL: ${feed[0].url}`, 'blue');
      log(`    - Time: ${feed[0].time_published}`, 'blue');

      // Check ticker relevance
      const relevantTickers = feed[0].ticker_sentiment?.filter((t: any) => t.ticker === symbol);
      if (relevantTickers && relevantTickers.length > 0) {
        log(`    - Sentiment Score: ${relevantTickers[0].ticker_sentiment_score}`, 'blue');
      }

      results.push({
        test: `Alpha Vantage Stock News (${symbol})`,
        passed: true,
        message: `Successfully fetched ${feed.length} articles`,
        data: feed.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: `Alpha Vantage Stock News (${symbol})`,
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    if (error.response?.data) {
      log(`  Response: ${JSON.stringify(error.response.data)}`, 'red');
    }
    results.push({
      test: `Alpha Vantage Stock News (${symbol})`,
      passed: false,
      message: error.message,
    });
  }
}

async function testAPIRouteGeneralNews() {
  logTest('API Route - General News (via /api/news)');

  try {
    const response = await axios.get('http://localhost:3000/api/news');
    const newsData = response.data;

    log(`✓ API route call successful`, 'green');
    log(`  Articles returned: ${newsData.length}`, 'blue');

    if (newsData.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Headline: ${newsData[0].headline}`, 'blue');
      log(`    - Source: ${newsData[0].source}`, 'blue');

      results.push({
        test: 'API Route General News',
        passed: true,
        message: `Successfully fetched ${newsData.length} articles`,
        data: newsData.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: 'API Route General News',
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    log(`  Make sure the dev server is running on http://localhost:3000`, 'yellow');
    results.push({
      test: 'API Route General News',
      passed: false,
      message: error.message,
    });
  }
}

async function testAPIRouteStockNews(symbol: string = 'AAPL') {
  logTest(`API Route - Stock News (via /api/news?symbol=${symbol})`);

  try {
    const response = await axios.get(`http://localhost:3000/api/news?symbol=${symbol}`);
    const newsData = response.data;

    log(`✓ API route call successful`, 'green');
    log(`  Articles returned: ${newsData.length}`, 'blue');

    if (newsData.length > 0) {
      log(`  Sample article:`, 'blue');
      log(`    - Headline: ${newsData[0].headline}`, 'blue');
      log(`    - Source: ${newsData[0].source}`, 'blue');

      results.push({
        test: `API Route Stock News (${symbol})`,
        passed: true,
        message: `Successfully fetched ${newsData.length} articles`,
        data: newsData.slice(0, 2),
      });
    } else {
      log('⚠️  No articles returned', 'yellow');
      results.push({
        test: `API Route Stock News (${symbol})`,
        passed: false,
        message: 'No articles returned',
      });
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
    log(`  Make sure the dev server is running on http://localhost:3000`, 'yellow');
    results.push({
      test: `API Route Stock News (${symbol})`,
      passed: false,
      message: error.message,
    });
  }
}

function printSummary() {
  log('\n\n' + '='.repeat(60), 'cyan');
  log('TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    log(`${icon} ${result.test}: ${result.message}`, color);
  });

  log('\n' + '='.repeat(60), 'cyan');
  log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`,
    passed === results.length ? 'green' : 'yellow');
  log('='.repeat(60) + '\n', 'cyan');
}

async function runAllTests() {
  log('\n🧪 Starting News API Tests...', 'cyan');
  log('This will test both Finnhub and Alpha Vantage APIs\n', 'cyan');

  // Test direct API calls
  await testFinnhubGeneralNews();
  await testFinnhubStockNews('AAPL');
  await testFinnhubStockNews('TSLA');

  await testAlphaVantageGeneralNews();
  await testAlphaVantageStockNews('AAPL');
  await testAlphaVantageStockNews('TSLA');

  // Test via API routes (requires dev server)
  await testAPIRouteGeneralNews();
  await testAPIRouteStockNews('AAPL');
  await testAPIRouteStockNews('NVDA');

  printSummary();
}

// Run tests
runAllTests().catch(console.error);
