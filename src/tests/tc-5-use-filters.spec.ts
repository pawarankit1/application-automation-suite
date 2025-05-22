import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import testData from '../testdata/filter-search.json';

test.describe('Filter-Based Property Search Tests', () => {
    test.use({ storageState: process.env.STORAGE_STATE_PATH! });
    
    let searchPage: SearchPage;

    test.beforeEach(async ({ page }) => {
        await test.step('Initialize test environment', async () => {
            searchPage = new SearchPage(page);
            await page.goto('/');
            await searchPage.acceptCookies();
        });
    });

    test('should search properties using multiple filters', async ({ page }) => {
        const { searchData, filters } = testData;

        await test.step('Search for location', async () => {
            await searchPage.searchLocation(searchData.location);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Apply price range filter', async () => {
            await searchPage.setPriceRange(
                searchData.priceRange.min,
                searchData.priceRange.max
            );
        });

        if (filters.surfaceArea.enabled) {
            await test.step('Apply surface area filter', async () => {
                await searchPage.setMinimumSurfaceArea();
            });
        }

        await test.step('Verify search results', async () => {
            await searchPage.verifyAllListingsContainText(searchData.location);
        });
    });
}); 