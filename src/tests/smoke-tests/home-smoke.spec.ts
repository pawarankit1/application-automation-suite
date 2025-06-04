import { test, expect } from '@playwright/test';
import { usersList } from '../setup/global-setup';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/LoggerUtil';

const user = usersList[0];
// This is a test that will be used to verify that the home page is displayed correctly for each user
test.describe('@smoke Home Page (Authenticated)', () => {
  test.use({ storageState: user.storageState });

  // This is a test that will be used to verify that the navigation links and profile icon are displayed correctly
  test('@smoke should display navigation links and profile icon', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await test.step('Navigate to login page', async () => {
      logger.info('Navigating to login page');
      await loginPage.navigateToLogin();
    });

    await test.step('Verify navigation elements', async () => {
      logger.info('Checking navigation elements');
      const homePage = new HomePage(page);
      await homePage.verifyNavigationElements();
    });
  });
});
