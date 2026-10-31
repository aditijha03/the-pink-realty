import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [320, 375, 768, 1280];
const themes = ['light', 'dark'];

test.describe('Refer & Earn Page & Features', () => {


  test('Page /refer-and-earn accessibility (axe) and responsiveness', async ({ page }) => {
    test.setTimeout(60000);
    for (const theme of themes) {
      for (const width of viewports) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/refer-and-earn');
        await page.evaluate((t) => {
          localStorage.setItem('theme', t);
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }, theme);

        await page.waitForTimeout(200);

        // Check horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasOverflow, `Overflow detected at ${width}px (${theme})`).toBe(false);

        // Check single H1 exists
        const h1Count = await page.locator('h1').count();
        expect(h1Count, 'Page must have exactly one H1').toBe(1);

        // Run axe accessibility scan
        const axeResults = await new AxeBuilder({ page })
          .disableRules(['color-contrast']) // Unsplash images overlay can vary in static screenshot
          .analyze();
        
        // Filter critical / serious violations if any
        const seriousViolations = axeResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
        expect(seriousViolations, `Axe serious violations at ${width}px (${theme}): ${JSON.stringify(seriousViolations.map(v => v.id))}`).toEqual([]);
      }
    }
  });

  test('Homepage referral banner placement and responsive layout', async ({ page }) => {
    for (const theme of themes) {
      for (const width of viewports) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        await page.evaluate((t) => {
          localStorage.setItem('theme', t);
          if (t === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }, theme);

        // Check banner exists with button linking to /refer-and-earn
        const bannerLink = page.locator('a[href="/refer-and-earn"]').first();
        await expect(bannerLink).toBeVisible();

        // Check no horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasOverflow, `Homepage overflow at ${width}px (${theme})`).toBe(false);
      }
    }
  });

  test('Placements elsewhere: Footer, Services, About, Navbar check', async ({ page }) => {
    // 1. Footer quick link
    await page.goto('/');
    const footerLink = page.locator('footer a[href="/refer-and-earn"]').first();
    await expect(footerLink).toBeAttached();

    // 2. Services page card
    await page.goto('/services');
    const serviceCard = page.locator('a[href="/refer-and-earn"]');
    await expect(serviceCard.first()).toBeVisible();

    // 3. About page link
    await page.goto('/about-us');
    const aboutLink = page.locator('a[href="/refer-and-earn"]:has-text("Partner with us")');
    await expect(aboutLink).toBeVisible();

    // 4. Main navbar check: must NOT have refer-and-earn in header nav
    const headerNavLink = page.locator('header nav a[href="/refer-and-earn"]');
    expect(await headerNavLink.count()).toBe(0);
  });

  test('Interactive Form UI: Tab switching, inline validation, and submission mocking', async ({ page }) => {
    await page.goto('/refer-and-earn');

    // Mock the backend API response
    await page.route('**/api/referrals', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      if (!postData.referrerName || postData.referrerName.length < 2) {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Validation failed' })
        });
      }
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { _id: 'mock-123', ...postData } })
      });
    });

    // 1. Submit invalid inputs in Referral mode
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter your full name')).toBeVisible();

    // 2. Fill valid referral form
    await page.fill('#referrerName', 'Meera Kapoor');
    await page.fill('#referrerPhone', '9876543210');
    await page.fill('#referrerEmail', 'meera@example.com');
    await page.fill('#referrerCity', 'Navi Mumbai');
    await page.fill('#clientName', 'Karan Johar');
    await page.fill('#clientPhone', '9820098200');
    await page.fill('#location', 'Kharghar');
    await page.click('button[type="submit"]');

    // Verify success message with checkmark
    await expect(page.locator('text=Thank You for Your Submission!')).toBeVisible();

    // Reset and switch to Partner mode
    await page.click('text=Submit another referral');
    await page.click('button[role="tab"]:has-text("Become a partner")');

    // 3. Fill partner form
    await page.fill('#referrerName', 'Vikram Seth');
    await page.fill('#referrerPhone', '9819988776');
    await page.fill('#referrerEmail', 'vikram@architects.com');
    await page.fill('#referrerCity', 'Mumbai');
    await page.fill('#message', 'We would love to collaborate on luxury architectural design for new residential mandates.');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Thank You for Your Submission!')).toBeVisible();
  });

});
