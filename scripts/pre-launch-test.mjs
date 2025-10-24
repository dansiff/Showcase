// scripts/pre-launch-test.mjs
// Quick automated test of critical endpoints before launch

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    if (response.ok) {
      log(`✓ ${name} (${duration}ms)`, 'green');
      return true;
    } else {
      log(`✗ ${name} - Status: ${response.status} (${duration}ms)`, 'red');
      return false;
    }
  } catch (err) {
    log(`✗ ${name} - Error: ${err.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n🚀 Running Pre-Launch Tests...\n', 'yellow');

  const tests = [];

  // 1. Health check
  tests.push(
    await testEndpoint(
      'Health Check',
      `${BASE_URL}/api/health`
    )
  );

  // 2. Environment debug (development only)
  if (process.env.NODE_ENV !== 'production') {
    tests.push(
      await testEndpoint(
        'Environment Variables',
        `${BASE_URL}/api/debug/env`
      )
    );
  }

  // 3. Homepage
  tests.push(
    await testEndpoint(
      'Homepage',
      `${BASE_URL}/`
    )
  );

  // 4. Sign in page
  tests.push(
    await testEndpoint(
      'Sign In Page',
      `${BASE_URL}/signin`
    )
  );

  // 5. Portal page
  tests.push(
    await testEndpoint(
      'Portal Page',
      `${BASE_URL}/portal`
    )
  );

  // 6. API routes with authentication (expect 401 - means auth is working)
  try {
    const response = await fetch(`${BASE_URL}/api/profile`);
    if (response.status === 401) {
      log('✓ Profile API (auth required)', 'green');
      tests.push(true);
    } else {
      log(`⚠ Profile API - Expected 401, got ${response.status}`, 'yellow');
      tests.push(false);
    }
  } catch (err) {
    log(`✗ Profile API - Error: ${err.message}`, 'red');
    tests.push(false);
  }

  // Summary
  const passed = tests.filter(Boolean).length;
  const total = tests.length;
  const percentage = Math.round((passed / total) * 100);

  log(`\n${'='.repeat(50)}`, 'yellow');
  log(`\nTest Results: ${passed}/${total} passed (${percentage}%)`, 
    percentage === 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red'
  );

  if (percentage === 100) {
    log('\n🎉 All tests passed! Ready to deploy!\n', 'green');
  } else if (percentage >= 80) {
    log('\n⚠️  Most tests passed, but review failures before deploying.\n', 'yellow');
  } else {
    log('\n❌ Several tests failed. Fix issues before deploying.\n', 'red');
  }

  log(`${'='.repeat(50)}\n`, 'yellow');

  process.exit(percentage === 100 ? 0 : 1);
}

// Run tests
runTests().catch((err) => {
  log(`\n❌ Test runner failed: ${err.message}\n`, 'red');
  process.exit(1);
});
