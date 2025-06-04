import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/LoggerUtil';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly contactLink: Locator;
  readonly profileIcon: Locator;
  readonly mainContent: Locator;
  readonly body: Locator;
  readonly logoutButton: Locator;
  readonly loginForm: Locator;
  readonly userTextbox: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    logger.info('Initializing HomePage');
    super(page);
    
    logger.info('Setting up page locators');
    this.homeLink = page.getByText('Home');
    this.productsLink = page.getByText('Products');
    this.contactLink = page.getByText('Contact');
    this.profileIcon = page.locator('i').nth(3); // 4th <i> icon as per .nth(3)
    this.mainContent = page.locator('div').filter({ hasText: 'Lorem ipsum egestas posuere' });
    this.body = page.locator('body');
    this.logoutButton = page.getByText('Sign Out');
    this.loginForm = page.locator('form');
    this.userTextbox = page.getByRole('textbox', { name: 'User' });
    this.heading = page.getByRole('heading', { name: "Automation doesn't stop at" });
    logger.info('HomePage initialization completed');
  }

  // This is a method that will be used to verify that the navigation elements are visible
  async verifyNavigationElements() {
    logger.info('Starting navigation elements verification');
    try {
      logger.info('Verifying home link visibility');
      await this.verifyElementVisible(this.homeLink);
      logger.info('Home link is visible');

      logger.info('Verifying products link visibility');
      await this.verifyElementVisible(this.productsLink);
      logger.info('Products link is visible');

      logger.info('Verifying contact link visibility');
      await this.verifyElementVisible(this.contactLink);
      logger.info('Contact link is visible');

      logger.info('Verifying profile icon visibility');
      await this.verifyElementVisible(this.profileIcon);
      logger.info('Profile icon is visible');

      logger.info('Navigation elements verification completed successfully');
    } catch (error) {
      logger.error('Failed to verify navigation elements:', error);
      throw error;
    }
  }

  // This is a method that will be used to verify that the main content is visible
  async verifyMainContent() {
    logger.info('Starting main content verification');
    try {
      logger.info('Verifying main content visibility');
      await this.verifyElementVisible(this.mainContent);
      logger.info('Main content is visible');

      logger.info('Verifying body text content');
      await expect(this.body).toContainText('Lorem ipsum');
      logger.info('Body contains text "Lorem ipsum"');

      logger.info('Main content verification completed successfully');
    } catch (error) {
      logger.error('Failed to verify main content:', error);
      throw error;
    }
  }

  // This is a method that will be used to logout
  async logout() {
    logger.info('Starting logout process');
    try {
      logger.info('Clicking profile icon');
      await this.profileIcon.click();
      logger.info('Profile icon clicked');

      logger.info('Clicking logout button');
      await this.logoutButton.click();
      logger.info('Logout button clicked');

      logger.info('Verifying redirect to login page');
      await this.verifyPageUrl('/');
      logger.info('Successfully redirected to login page');

      logger.info('Verifying login form visibility');
      await this.verifyElementVisible(this.loginForm);
      logger.info('Login form is visible');

      logger.info('Logout process completed successfully');
    } catch (error) {
      logger.error('Logout process failed:', error);
      throw error;
    }
  }

} 