import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import testData from '../testdata/mock-search-result.json';

test.describe('Network Interception Test (HTML mocking)', () => {
  test.use({ storageState: process.env.STORAGE_STATE_PATH! });

  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    await test.step('Initialize test environment', async () => {
      searchPage = new SearchPage(page);
      await page.goto('/');
      await searchPage.acceptCookies();
    });
  });

  test('should display mocked listing data by intercepting HTML response', async ({ page }) => {
    const { count, listing, searchLocation, expectedHeader, selectors, timeouts } = testData;

    await test.step('Set up network interception', async () => {
      await page.route('**/*', async (route) => {
        const request = route.request();
        const url = request.url();

        if (url.endsWith('/apartments/amsterdam') || url.includes('search')) {
          const response = await route.fetch();
          const body = await response.text();

          const modifiedBody = body
            .replace(
              /<span class="search-list-header__count">\d+<\/span>/,
              `<span class="search-list-header__count">${count}</span>`
            )
            .replace(
              /<div class="listing-search-item__content">[\s\S]*?<div class="listing-search-item__price">[\s\S]*?<\/div>\s*<\/div>/,
              `<div class="listing-search-item__content">
                <h2 class="listing-search-item__title">
                  <a
                    class="listing-search-item__link listing-search-item__link--title"
                    href="${listing.url}"
                    data-action="click->listing-search-item#onClick"
                  >
                    ${listing.title}
                  </a>
                </h2>
                <div class="listing-search-item__sub-title">
                  ${listing.address}
                </div>
                <div class="listing-search-item__price">
                  ${listing.price}
                </div>
              </div>`
            );

          await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: modifiedBody,
          });
          return;
        }

        await route.continue();
      });
    });

    await test.step('Perform search and wait for results', async () => {
      await searchPage.searchLocation(searchLocation);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify search results count', async () => {
      const countSpan = page.locator(selectors.countSpan);
      await expect(countSpan).toHaveText(`${count}`, { timeout: timeouts.count });
    });

    await test.step('Verify header text', async () => {
      const header = page.locator(selectors.header);
      await expect(header).toHaveText(new RegExp(expectedHeader, 'i'));
    });

    await test.step('Verify listing details', async () => {
      const title = page.getByRole('heading', { name: listing.title });
      await title.scrollIntoViewIfNeeded();
      await title.hover();
      await expect(title).toBeVisible({ timeout: timeouts.title });

      const priceElement = page.locator(selectors.price).first();
      await expect(priceElement).toHaveText(new RegExp(listing.price));
    });
  });
});
