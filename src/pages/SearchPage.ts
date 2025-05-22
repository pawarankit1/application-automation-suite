import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import logger from '../utils/LoggerUtils';
import path from 'path';

export class SearchPage extends BasePage {
    // Locators
    private readonly searchInputLocator: Locator;
    private readonly mapLinkLocator: Locator;
    private readonly mapRegionLocator: Locator;
    private readonly closeButtonLocator: Locator;
    private readonly firstResultLocator: Locator;
    private readonly searchSuggestionLocator: Locator;
    private readonly searchButtonLocator: Locator;
    private readonly houseMarkersLocator: Locator;
    private readonly propertyTitleLocator: Locator;
    private readonly streetNameLocator: Locator;
    private readonly priceButtonLocator: Locator;
    private readonly minPriceSelectLocator: Locator;
    private readonly maxPriceSelectLocator: Locator;
    private readonly surfaceAreaButtonLocator: Locator;
    private readonly surfaceAreaOptionLocator: Locator;
    private readonly searchResultsCountLocator: Locator;
    private readonly apartmentListLocator: Locator;
    private readonly searchOnMapInputLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInputLocator = page.getByRole('textbox', { name: 'Search a city, neighbourhood' });
        this.mapLinkLocator = page.getByRole('link', { name: 'Map' });
        this.mapRegionLocator = page.getByRole('region', { name: 'Map' });
        this.firstResultLocator = page.locator('section').getByRole('link').first();
        this.searchButtonLocator = page.locator('button[name="search"]');
        this.searchSuggestionLocator = page.locator('.autocomplete__item.autocomplete__item--recent-search');
        this.houseMarkersLocator = page.locator('.leaflet-marker-icon');
        this.propertyTitleLocator = page.getByRole('heading', { name: /For rent:/ });
        this.streetNameLocator = page.locator('.listing-search-item__link.listing-search-item__link--title');
        this.priceButtonLocator = page.getByRole('button', { name: 'Price' });
        this.minPriceSelectLocator = page.locator('.search-controls__quick-access-filters select.select-control__control[name="filters[price][min]"]');
        this.maxPriceSelectLocator = page.locator('.search-controls__quick-access-filters select.select-control__control[name="filters[price][max]"]');
        this.surfaceAreaButtonLocator = page.getByRole('button', { name: 'Surface area' });
        this.surfaceAreaOptionLocator = page.getByText('25+ m2').first();
        this.searchResultsCountLocator = page.getByText(/\d+ Rental Apartments/);
        this.apartmentListLocator = page.locator('.listing-search-item__sub-title');
        this.searchOnMapInputLocator = page.getByRole('textbox', { name: 'City, district, or' });
        
    }


    /**
     * Accept cookies if the consent button is visible
     */
    async acceptCookies(): Promise<void> {
        await this.handleCookieConsent();
    }

    /**
     * Search for a location or postcode
     */
    async searchLocation(searchText: string): Promise<void> {
        await this.searchInputLocator.click();
        await this.searchInputLocator.fill(searchText);
        logger.info('Filled search input with :', searchText);
        const optionToSelect = this.page.locator('.autocomplete__item-label', {
            hasText: new RegExp(`^${searchText}$`)
          }).first();
        await optionToSelect.waitFor({ state: 'visible' });
        await optionToSelect.click({ force: true });
        logger.info('Selected search option with :', searchText);
       // await this.commands.clickWithRetry(this.searchButtonLocator);
       // await this.searchButtonLocator.click();
    }

    /**
     * Open map view
     */
    async openMap(): Promise<void> {
        await this.mapLinkLocator.click();
        await expect(this.page).toHaveURL(/\/map(\?.*)?$/);
        logger.info('Navigated to map view');
    }

    /**
     * Click on map at specific coordinates
     */
    async clickOnMap(x: number, y: number): Promise<void> {
        await this.mapRegionLocator.click({
            position: {
                x,
                y
            },
            force: true
        });
        logger.info('Clicked on map at coordinates :', x, y);
    }

    /**
     * Click first search result
     */
    async clickFirstResult(): Promise<void> {
        await this.firstResultLocator.click();
        logger.info('Clicked on first search result');
    }

    /**
     * Verify property title is visible
     */
    async verifyPropertyTitleVisible(): Promise<string | null> {
        await expect(this.propertyTitleLocator).toBeVisible();
        const propertyTitle = await this.propertyTitleLocator.textContent();
        logger.info(`Property title: ${propertyTitle}`);
        return propertyTitle; // Return the propertyTitle value
    }

    /**
     * Verify street name is visible and click it
     */
    async verifyAndClickStreetName(): Promise<string | null> {
        await this.commands.waitForElementVisible(this.streetNameLocator);
        //this.streetNameLocator.click();
        const streetName = await this.streetNameLocator.textContent();
        logger.info("****THIS IS STREET", streetName);
        await this.streetNameLocator.click();
        return streetName; // Return the streetName value
    }

    

    /**
     * Navigate to map with specific coordinates
     */
    async navigateToMapCoordinates(mapUrl: string): Promise<void> {
        await this.page.goto(mapUrl);
        await this.page.waitForLoadState('networkidle');
        await expect(this.mapRegionLocator).toBeVisible();
    }

 


    /**
     * Click on 'Search on map' option
     */
    async clickSearchOnMap(): Promise<void> {
        await this.mapLinkLocator.click();
        await expect(this.mapRegionLocator).toBeVisible();
    }

    /**
     * Search by postcode
     */
    async searchByPostcode(postcode: string): Promise<void> {
        await this.searchInputLocator.click();
        await this.searchInputLocator.fill(postcode);
        await this.searchButtonLocator.click();
        await this.page.waitForLoadState('networkidle');
    }
    async searchByCity(city: string): Promise<void> {
        await this.searchOnMapInputLocator.click();
        await this.searchOnMapInputLocator.fill(city);
        const firstExactOption = this.page.locator('.autocomplete__item-label', {
            hasText: new RegExp(`^${city}$`)
          }).first();
          
          await firstExactOption.waitFor({ state: 'visible' });
          await firstExactOption.click({ force: true });
    }
    async searchByDistrict(district: string): Promise<void> {
        await this.searchOnMapInputLocator.click();
        await this.searchOnMapInputLocator.fill(district);
        const firstExactOption = this.page.locator('.autocomplete__item-label', {
            hasText: new RegExp(`^${district}$`)
          }).first();
          
          await firstExactOption.waitFor({ state: 'visible' });
          await firstExactOption.click({ force: true });
    }


    

    /**
     * Verify search results are displayed by checking the result count text
     */
    async verifySearchResults(): Promise<void> {
        await this.page.locator('canvas').first().waitFor({ state: 'visible', timeout: 10000 });
        const resultCountLocator = this.streetNameLocator;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(__dirname, '../screenshots', `search-results-${timestamp}.png`);
        await this.page.screenshot({ path: screenshotPath });
        await resultCountLocator.waitFor({ state: 'visible', timeout: 10000 });
        const countText = await resultCountLocator.textContent();
        logger.info("****THIS IS COUNT OF RESULTS :", countText);
        expect(countText).not.toBeNull();
    }
   

    /**
     * Set price range filter
     */
    async setPriceRange(minPrice: string, maxPrice: string): Promise<void> {
        await this.commands.waitForElementVisible(this.priceButtonLocator);
        await this.priceButtonLocator.click();
        await this.commands.waitForElementVisible(this.minPriceSelectLocator);
        await this.minPriceSelectLocator.selectOption(minPrice);
        logger.info("Miniump price selected :", minPrice);
        this.commands.waitForElementVisible(this.maxPriceSelectLocator);
        await this.maxPriceSelectLocator.selectOption(maxPrice);
        logger.info("Maximum price selected :", maxPrice);
       
    }

    /**
     * Set minimum surface area filter
     */
    async setMinimumSurfaceArea(): Promise<void> {
        await this.commands.clickWithRetry(this.surfaceAreaButtonLocator);
        await this.commands.waitForElementVisible(this.surfaceAreaOptionLocator);
        await this.commands.clickWithRetry(this.surfaceAreaOptionLocator);
        logger.info("Minimum surface area selected");
        await this.page.waitForLoadState('networkidle');
    }
    

   


    /**
     * Verify if all apartment listings contain specific text
     * @returns Promise<boolean> - True if all listings contain the text, false otherwise
     */
    async verifyAllListingsContainText(expectedText: string): Promise<boolean> {
        // Wait for listings to be visible
        await this.apartmentListLocator.first().waitFor({ state: 'visible' });
        
        // Get all listing texts
        const allListings = await this.apartmentListLocator.all();
        logger.info(`Found ${allListings.length} listings to check`);

        // Check each listing
        for (const listing of allListings) {
            const text = await listing.textContent();
            if (!text || !text.toLowerCase().includes(expectedText.toLowerCase())) {
                logger.info(`Found listing without expected text: ${text}`);
                return false;
            }
        }

        return true;
    }


    /**
     * Move mouse over the map canvas starting at the center and expanding outward until a popup appears, then click the canvas at that coordinate
     */
    async hoverAndClickPopupOnCanvasNearCenter(previous?: { x: number, y: number }): Promise<void> {
        const canvas = this.page.locator('canvas.maplibregl-canvas');
        await canvas.waitFor({ state: 'visible', timeout: 10000 });
        logger.info('Canvas found and visible');
        const { width, height } = await canvas.first().evaluate(el => {
            const r = el.getBoundingClientRect();
            return { width: r.width, height: r.height };
        });
        logger.info('Canvas width and height:', width, height);
        const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
        logger.info('Canvas center:', center);
        const steps = 5, points = [center];
        const stepX = Math.floor(width / (steps + 1)), stepY = Math.floor(height / (steps + 1));
        logger.info('Step size:', stepX, stepY);
        for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++)
        if (dx || dy) points.push({ x: center.x + dx * stepX, y: center.y + dy * stepY });
        logger.info('Points:', points);
        if (previous) points.sort((a, b) => Math.hypot(a.x - previous.x, a.y - previous.y) - Math.hypot(b.x - previous.x, b.y - previous.y));
        for (const { x, y } of points) {
            if (x < 0 || y < 0 || x > width || y > height) continue;
            await canvas.hover({ position: { x, y } });
            await this.page.waitForTimeout(300);
            const popup = this.page.locator('.maplibregl-popup.maplibregl-popup-anchor-top, .maplibregl-popup.maplibregl-popup-anchor-bottom');
            if (await popup.isVisible()) {
                await canvas.click({ position: { x, y } });
                logger.info('Clicked on canvas at:', x, y);
                return;
            }
        }
        logger.error('No popup appeared after scanning the canvas.');
    }
} 