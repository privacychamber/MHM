const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type()}]`, msg.text());
  });
  
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err);
  });
  
  try {
    console.log('Navigating to https://privacychamber.github.io/MHM/...');
    const response = await page.goto('https://privacychamber.github.io/MHM/', { waitUntil: 'load', timeout: 30000 });
    console.log('Response status:', response.status());
    
    // Wait for a few seconds to let three.js and react load and log any errors
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Check complete.');
  } catch (e) {
    console.error('Navigation failed:', e);
  } finally {
    await browser.close();
  }
})();
