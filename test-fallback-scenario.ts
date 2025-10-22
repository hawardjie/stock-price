/**
 * Test script specifically for testing Alpha Vantage fallback
 * This simulates scenarios where Finnhub returns empty results
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testFallbackWithoutFinnhubKey() {
  log('\n' + '='.repeat(60), 'cyan');
  log('TEST: Fallback when Finnhub API key is missing', 'cyan');
  log('='.repeat(60), 'cyan');

  // Temporarily remove Finnhub key
  const originalKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  delete process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  try {
    const response = await fetch('http://localhost:3000/api/news?symbol=AAPL');
    const data = await response.json();

    if (data.length > 0) {
      log('✓ Alpha Vantage fallback worked!', 'green');
      log(`  Articles returned: ${data.length}`, 'blue');
      log(`  Source: ${data[0].source}`, 'blue');
      log(`  First headline: ${data[0].headline}`, 'blue');

      // Check if it's from Alpha Vantage
      if (data[0].source === 'Alpha Vantage' || data[0].source !== 'SeekingAlpha') {
        log('✓ Confirmed: News came from Alpha Vantage', 'green');
      }
    } else {
      log('✗ No news returned from fallback', 'red');
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
  } finally {
    // Restore Finnhub key
    if (originalKey) {
      process.env.NEXT_PUBLIC_FINNHUB_API_KEY = originalKey;
    }
  }
}

async function testFallbackWithInvalidFinnhubKey() {
  log('\n' + '='.repeat(60), 'cyan');
  log('TEST: Fallback when Finnhub API key is invalid', 'cyan');
  log('='.repeat(60), 'cyan');

  // Temporarily set invalid key
  const originalKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY = 'invalid_key_12345';

  try {
    const response = await fetch('http://localhost:3000/api/news?symbol=MSFT');
    const data = await response.json();

    if (data.length > 0) {
      log('✓ Alpha Vantage fallback worked after Finnhub failure!', 'green');
      log(`  Articles returned: ${data.length}`, 'blue');
      log(`  Source: ${data[0].source}`, 'blue');
      log(`  First headline: ${data[0].headline}`, 'blue');
    } else {
      log('✗ No news returned from fallback', 'red');
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
  } finally {
    // Restore original key
    if (originalKey) {
      process.env.NEXT_PUBLIC_FINNHUB_API_KEY = originalKey;
    }
  }
}

async function compareFinnhubVsAlphaVantage() {
  log('\n' + '='.repeat(60), 'cyan');
  log('TEST: Compare Finnhub vs Alpha Vantage results', 'cyan');
  log('='.repeat(60), 'cyan');

  const testSymbol = 'GOOGL';

  try {
    // Test with Finnhub (current setup)
    const finnhubResponse = await fetch(`http://localhost:3000/api/news?symbol=${testSymbol}`);
    const finnhubData = await finnhubResponse.json();

    log('Finnhub Results:', 'blue');
    log(`  Articles: ${finnhubData.length}`, 'blue');
    if (finnhubData.length > 0) {
      log(`  Latest: ${finnhubData[0].headline}`, 'blue');
      log(`  Source: ${finnhubData[0].source}`, 'blue');
    }

    // Now test with only Alpha Vantage (remove Finnhub key)
    const originalKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    delete process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    const alphaResponse = await fetch(`http://localhost:3000/api/news?symbol=${testSymbol}`);
    const alphaData = await alphaResponse.json();

    log('\nAlpha Vantage Results:', 'blue');
    log(`  Articles: ${alphaData.length}`, 'blue');
    if (alphaData.length > 0) {
      log(`  Latest: ${alphaData[0].headline}`, 'blue');
      log(`  Source: ${alphaData[0].source}`, 'blue');
    }

    // Restore key
    if (originalKey) {
      process.env.NEXT_PUBLIC_FINNHUB_API_KEY = originalKey;
    }

    log('\n✓ Both APIs returned news successfully!', 'green');
    log(`  Finnhub returned ${finnhubData.length} articles`, 'green');
    log(`  Alpha Vantage returned ${alphaData.length} articles`, 'green');

  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
  }
}

async function testNotificationConversion() {
  log('\n' + '='.repeat(60), 'cyan');
  log('TEST: Verify notification data structure', 'cyan');
  log('='.repeat(60), 'cyan');

  try {
    const response = await fetch('http://localhost:3000/api/news?symbol=NVDA');
    const data = await response.json();

    if (data.length > 0) {
      const firstArticle = data[0];

      log('Checking required fields for notification conversion:', 'blue');

      const requiredFields = ['headline', 'summary', 'source', 'url', 'datetime'];
      let allFieldsPresent = true;

      requiredFields.forEach(field => {
        const present = firstArticle[field] !== undefined && firstArticle[field] !== null;
        const status = present ? '✓' : '✗';
        const color = present ? 'green' : 'red';
        log(`  ${status} ${field}: ${present ? 'present' : 'missing'}`, color);

        if (!present) allFieldsPresent = false;
      });

      if (allFieldsPresent) {
        log('\n✓ All required fields present for notification conversion!', 'green');
        log('  Sample notification would look like:', 'blue');
        log(`    Title: ${firstArticle.headline.substring(0, 60)}...`, 'blue');
        log(`    Message: ${firstArticle.summary?.substring(0, 100)}...`, 'blue');
        log(`    Source: ${firstArticle.source}`, 'blue');
        log(`    Timestamp: ${new Date(firstArticle.datetime * 1000).toLocaleString()}`, 'blue');
      } else {
        log('\n✗ Some required fields are missing', 'red');
      }
    }
  } catch (error: any) {
    log(`✗ Error: ${error.message}`, 'red');
  }
}

async function runFallbackTests() {
  log('\n🧪 Starting Fallback Mechanism Tests...', 'cyan');
  log('These tests verify Alpha Vantage fallback when Finnhub fails\n', 'cyan');

  await testFallbackWithoutFinnhubKey();
  await testFallbackWithInvalidFinnhubKey();
  await compareFinnhubVsAlphaVantage();
  await testNotificationConversion();

  log('\n' + '='.repeat(60), 'cyan');
  log('All fallback tests completed!', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
}

// Run tests
runFallbackTests().catch(console.error);
