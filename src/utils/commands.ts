import { Locator, Page, expect } from '@playwright/test';

export class Commands {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Custom wait for element to be visible
     */
    async waitForElementVisible(locator: Locator, timeout = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
      }

    async waitForElementNotToBeVisible(locator: Locator, timeout = 10000): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
      }

    /**
     * Custom click with retry logic
     */
    async clickWithRetry(Locator: Locator, maxAttempts = 3): Promise<void> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await Locator.click();
                return;
            } catch (error) {
                if (attempt === maxAttempts) throw error;
                await this.page.waitForTimeout(1000);
            }
        }
    }

    /**
     * Custom type with clear
     */
    async typeWithClear(selector: string, text: string): Promise<void> {
        await this.page.click(selector);
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Delete');
        await this.page.fill(selector, text);
    }

    /**
     * Custom assertion for element text
     */
    async assertElementText(selector: string, expectedText: string): Promise<void> {
        const element = await this.page.waitForSelector(selector);
        const actualText = await element.textContent();
        expect(actualText?.trim()).toBe(expectedText);
    }
} 