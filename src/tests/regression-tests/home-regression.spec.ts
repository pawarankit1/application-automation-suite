import { test } from '@playwright/test';
import { usersList } from '../setup/global-setup';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/LoggerUtil';

// This is a test that will be used to verify that the home page is displayed correctly for each user
for (const user of usersList) {
  test.describe(`@regression ${user.role.toUpperCase()} Home Page (Authenticated)`, () => {
    test.use({ storageState: user.storageState });
  
    test.beforeEach(async ({ page }) => {
      logger.info(`Starting tests for ${user.role.toUpperCase()} user (authenticated)`);
      const loginpage = new LoginPage(page);
      await loginpage.navigateToLogin();
    });

    // This is a test that will be used to verify that the navigation links and profile icon are displayed correctly
    test('@regression should display navigation links and profile icon', async ({ page }) => {
      const homePage = new HomePage(page);
      
      await test.step('Verify navigation elements', async () => {
        logger.info('Checking navigation elements');
        await homePage.verifyNavigationElements();
      });
    });

    // This is a test that will be used to verify that the main content is displayed correctly
    test('@regression should display the main content', async ({ page }) => {
      const homePage = new HomePage(page);
      
      await test.step('Verify main content elements', async () => {
        logger.info('Checking main content elements');
        await homePage.verifyMainContent();
      });
    });

    // This is a test that will be used to verify that the user can sign out and redirect to the login page
    test('@regression should sign out and redirect to login page', async ({ page }) => {
      const homePage = new HomePage(page);
      
      await test.step('Perform logout action', async () => {
        logger.info('Initiating logout process');
        await homePage.logout();
      });

      await test.step('Verify redirect to login page', async () => {
        logger.info('Verifying redirect to login page');
        const loginPage = new LoginPage(page);
        await loginPage.expectToBeOnLoginPage();
      });
    });
  });
}