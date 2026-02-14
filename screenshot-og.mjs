import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file:///Users/theodore/.openclaw/workspace/bluego-landing/og-generator.html');
await page.screenshot({ path: 'public/og-image.png', type: 'png' });
await browser.close();
console.log('Done: public/og-image.png');
