import { test, expect } from '@playwright/test';
import { usersList } from '../setup/global-setup';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/LoggerUtil';

const user = usersList[0];
// This is a test that will be used to verify that the login page is displayed correctly for each user
test.describe('@smoke Login', () => {
  test('@smoke should login successfully and save state', async ({ page, context }) => {
    logger.info(`Starting login test for ${user.role} user`);
    const loginPage = new LoginPage(page);
    
    await test.step('Navigate to login page', async () => {
      logger.info('Navigating to login page');
      await loginPage.navigateToLogin();
    });

    await test.step('Perform login action', async () => {
      logger.info('Attempting login with user credentials');
      await loginPage.login(user.email, user.password);
    });

    await test.step('Verify successful login', async () => {
      logger.info('Verifying login status');
      const isLoggedIn = await loginPage.isLoggedIn();
      await expect(isLoggedIn).toBeTruthy();
    });

    await test.step('Save authentication state', async () => {
      logger.info('Saving authentication state');
      await context.storageState({ path: user.storageState });
      logger.info(`Authentication state saved for ${user.role} user`);
    });
  });
});
