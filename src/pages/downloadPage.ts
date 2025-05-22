import { Page, Locator } from '@playwright/test';
import logger from '../utils/LoggerUtils';

export class DownloadPage {
    readonly page: Page;
    readonly downloadLink: Locator;
    readonly consentPopup: Locator;
    readonly doNotConsentButton: Locator;
    readonly closeButton: Locator;
    readonly vignetteSelector: string;

    constructor(page: Page) {
        this.page = page;
        this.downloadLink = page.locator('a[data-downloadurl*="sample-pdf-file-for-testing"]').first();
        this.consentPopup = page.locator('text=asks for your consent to use your personal data');
        this.doNotConsentButton = page.locator('button:has-text("Do not consent")');
        this.closeButton = page.locator('button[aria-label="Close"], .close, [id*="close"]');
        this.vignetteSelector = 'iframe[id*="google_vignette"], div[id*="google_vignette"], div[class*="google_vignette"]';
    }

    /**
     * Navigates to the download page
     */
    async navigate() {
        await this.page.goto(process.env.DOWNLOAD_PAGE_URL!, { 
            waitUntil: 'domcontentloaded' 
        });
        logger.info('Navigated to download page');
    }

    /**
     * Closes google_vignette popup if it appears
     */
    async closeVignette(): Promise<void> {
        try {
            await this.page.waitForSelector(this.vignetteSelector, { timeout: 5000 });
            if (await this.closeButton.isVisible()) {
                await this.closeButton.click();
                logger.info('Closed google_vignette');
            }
        } catch (e) {
            logger.error('Vignette did not appear, continue');
        }
    }

    /**
     * Handles consent popup if it appears
     */
    async handleConsentPopup(): Promise<void> {
        try {
            if (await this.consentPopup.isVisible({ timeout: 10000 })) {
                if (await this.doNotConsentButton.isVisible()) {
                    await this.doNotConsentButton.click();
                    logger.info('Dismissed consent popup');
                } else if (await this.closeButton.isVisible()) {
                    await this.closeButton.click();
                    logger.info('Closed consent popup');
                }
            }
        } catch (e) {
            logger.error('Consent popup did not appear, continue');
        }
    }

    /**
     * Initiates the download process
     */
    async initiateDownload() {
        await this.downloadLink.waitFor({ state: 'visible' });
        logger.info('Download link is visible');
        return Promise.all([
            this.page.waitForEvent('download'),
            this.downloadLink.click(),
        ]);
        logger.info('Download initiated');
    }
} 