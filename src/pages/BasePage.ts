import { Page, expect, Locator } from '@playwright/test';
import { Commands } from '../utils/commands';
import logger from '../utils/LoggerUtils';
export class BasePage {
    protected readonly page: Page;
    protected commands: Commands;

    // Common locators
    protected readonly cookieAcceptButtonLocator: Locator;
    private readonly cookieBannerLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.commands = new Commands(page);
        
        // Initialize locators
        this.cookieAcceptButtonLocator = page.getByRole('button', { name: 'Agree' });
        this.cookieBannerLocator = page.getByText('Agree Reject non-essential');
    }

    
     // Handle cookie consent if present
     
    async handleCookieConsent(): Promise<void> {
        try {
            
            logger.info('Waiting for cookie banner to be visible');
            await this.cookieBannerLocator.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.cookieBannerLocator.isVisible()) {
                await this.cookieAcceptButtonLocator.click();
                //await this.cookieBannerLocator.waitFor({ state: 'hidden', timeout: 5000 });
                await this.commands.waitForElementNotToBeVisible(this.cookieBannerLocator);
                logger.info('Cookie banner accepted');
            }
        } catch (error) {
            // Cookie banner might not appear (already accepted or not shown)
            logger.error('Cookie banner not found or already handled :', error);
        
        }
    }

    async acceptCookies(): Promise<void> {
        if (await this.cookieAcceptButtonLocator.isVisible()) {
            await this.cookieAcceptButtonLocator.click();
            logger.info('Cookie banner accepted');
        }
    }
} 