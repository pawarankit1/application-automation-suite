import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import testData from '../testdata/card-list-view.json';

test.describe('Dynamic Property Search Tests', () => {
    test.use({ storageState: process.env.STORAGE_STATE_PATH! });
    
    let searchPage: SearchPage;

    test.beforeEach(async ({ page }) => {
        await test.step('Initialize test environment', async () => {
            searchPage = new SearchPage(page);
            await page.goto('/');
            await searchPage.acceptCookies();
        });
    });

    test('should search property in Almere with dynamic coordinates', async ({ page }) => {
        const { cityName, coordinates } = testData.citySearch;

        await test.step('Search for city and open map', async () => {
            await searchPage.searchLocation(cityName);
            await searchPage.openMap();
        });

        await test.step('Navigate to map with coordinates', async () => {
            const mapUrl = `/apartments/${cityName.toLowerCase()}/map?zoom=${coordinates.zoom}&center=${coordinates.center.longitude},${coordinates.center.latitude}`;
            await searchPage.navigateToMapCoordinates(mapUrl);
        });

        await test.step('Click on different map locations', async () => {
            for (const click of testData.mapClicks) {
                await test.step(`Clicking at coordinates (${click.x}, ${click.y})`, async () => {
                    await searchPage.clickOnMap(click.x, click.y);
                });
            }
        });

        await test.step('Verify property details', async () => {
            const streetName = await searchPage.verifyAndClickStreetName();
            let cleanedStreetName = streetName?.replace(/··+ */g, '').trim();
            const streetNameText = await searchPage.verifyPropertyTitleVisible();
            await expect(streetNameText).toContain(cleanedStreetName);
        });
    });
}); 