import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import mapSearchData from '../testdata/map-search-data.json';

test.describe('Map-Based Search Tests', () => {
  test.use({ storageState: process.env.STORAGE_STATE_PATH! });

  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    await test.step('Set up test environment', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      searchPage = new SearchPage(page);
      await page.goto('/');
      await searchPage.acceptCookies();
    });
  });

  test('should search using map coordinates from test data', async ({ page }) => {
    const city = mapSearchData.cities[0]; // Amsterdam data
    
    await test.step('Navigate to map with city coordinates', async () => {
      const mapUrl = `/apartments/${city.name.toLowerCase()}/map?zoom=${city.coordinates.zoom}&center=${city.coordinates.longitude},${city.coordinates.latitude}`;
      await searchPage.searchLocation(city.name);
      await searchPage.clickSearchOnMap();
      await searchPage.navigateToMapCoordinates(mapUrl);
    });

    await test.step('Test different map click points', async () => {
      for (const point of mapSearchData.mapPoints) {
        await test.step(`Clicking map at ${point.description}`, async () => {
          await searchPage.hoverAndClickPopupOnCanvasNearCenter();
          await searchPage.verifySearchResults();
        });
      }
    });
  });

  test('should directly click specific coordinates on the map', async ({ page }) => {
    const city = mapSearchData.cities[0];

    await test.step('Search and navigate to city map', async () => {
      await searchPage.searchLocation(city.name);
      await searchPage.clickSearchOnMap();
      await searchPage.searchByCity(city.name);
    });

    await test.step('Interact with map and verify results', async () => {
      await searchPage.hoverAndClickPopupOnCanvasNearCenter();
      await searchPage.verifySearchResults();
    });
  });

  test('should search listing by District', async ({ page }) => {
    const districtQuery = mapSearchData.searchQueries.find(q => q.type === 'district');

    if (!districtQuery) {
      test.skip(true, 'No district query found in test data');
      return;
    }

    await test.step('Search by district location', async () => {
      await searchPage.searchLocation(districtQuery.query);
      await searchPage.openMap();
    });

    await test.step('Interact with district map and verify results', async () => {
      await searchPage.searchByDistrict(districtQuery.query);
      await searchPage.hoverAndClickPopupOnCanvasNearCenter();
      await searchPage.verifySearchResults();
    });
  });
});
