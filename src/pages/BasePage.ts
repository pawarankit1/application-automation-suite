import { expect, Locator, Page } from "@playwright/test";

// This is a base class for all pages
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}
  
  // This is a method that will be used to wait for the page to load
  protected async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  
  // This is a method that will be used to verify that an element is visible
  protected async verifyElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  // This is a method that will be used to verify that the page URL is correct
  protected async verifyPageUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }
}

