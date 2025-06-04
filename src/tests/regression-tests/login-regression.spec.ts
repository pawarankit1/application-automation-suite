import { test, expect } from '@playwright/test';
import { usersList } from '../setup/global-setup';
import { LoginPage } from '../../pages/LoginPage';
import { FakerUtils } from '../../utils/FakerUtil';
import { logger } from '../../utils/LoggerUtil';

const user = usersList[0];
// This is a test that will be used to verify that the login page is displayed correctly
test.describe('@regression Login', () => {
  test('@regression should login successfully and save state', async ({ page, context }) => {
    logger.info(`Starting login test for ${user.role} user`);
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.login(user.email, user.password);
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    //await context.storageState({ path: user.storageState });
    logger.info(`Authentication state saved for ${user.role} user`);
  });
// This is a test that will be used to verify that the login page shows an error when the username is blank
  test('@regression should show error with blank username', async ({ page }) => {
    logger.info('Starting test: blank username error');
    const loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    await test.step('Attempt login with blank username', async () => {
      await loginPage.login('', process.env.ADMIN_USER_PASSWORD!);
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectErrorMessageToBeVisible('username');
      await loginPage.expectToBeOnLoginPage();
    });
  });
// This is a test that will be used to verify that the login page shows an error when the password is blank
  test('@regression should show error with blank password', async ({ page }) => {
    logger.info('Starting test: blank password error');
    const loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    await test.step('Attempt login with blank password', async () => {
      await loginPage.login(process.env.ADMIN_USER_EMAIL!, '');
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectErrorMessageToBeVisible('password');
      await loginPage.expectToBeOnLoginPage();
    });
  });
// This is a test that will be used to verify that the login page shows an error when both fields are blank
  test('@regression should show error with both fields blank', async ({ page }) => {
    logger.info('Starting test: both fields blank error');
    const loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    await test.step('Attempt login with both fields blank', async () => {
      await loginPage.login('', '');
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectErrorMessageToBeVisible('form');
      await loginPage.expectToBeOnLoginPage();
    });
  });
// This is a test that will be used to verify that the login page shows an error when the username is not case sensitive
  test('@regression should show error for case sensitivity in username', async ({ page }) => {
    logger.info('Starting test: case sensitivity error');
    const loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    await test.step('Attempt login with uppercase username', async () => {
      await loginPage.login(process.env.ADMIN_USER_EMAIL!.toUpperCase(), process.env.ADMIN_USER_PASSWORD!);
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectErrorMessageToBeVisible('caseSensitive');
      await loginPage.expectToBeOnLoginPage();
    });
  });
// This is a test that will be used to verify that the login page shows an error when the username has leading/trailing spaces
  test('@regression should show error for leading/trailing spaces in username', async ({ page }) => {
    logger.info('Starting test: spaces in username error');
    const loginPage = new LoginPage(page);
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });
    await test.step('Attempt login with spaces in username', async () => {
      await loginPage.login(`  ${process.env.ADMIN_USER_EMAIL!}  `, process.env.ADMIN_USER_PASSWORD!);
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectErrorMessageToBeVisible('spaces');
      await loginPage.expectToBeOnLoginPage();
    });
  });
// This is a test that will be used to verify that the login page shows an error when the credentials are invalid
  test('@regression should show error for multiple invalid credentials', async ({ page }) => {
    logger.info('Starting test: multiple invalid credentials');
    const loginPage = new LoginPage(page);
    const fakerUtils = FakerUtils.getInstance();
    const invalidCredentials = fakerUtils.generateInvalidCredentials(5);

    for (const credentials of invalidCredentials) {
      await test.step(`Testing invalid credentials: ${credentials.email}`, async () => {
        await loginPage.navigateToLogin();
        await loginPage.login(credentials.email, credentials.password);
        await loginPage.expectErrorMessageToBeVisible('invalidCredentials');
        await loginPage.expectToBeOnLoginPage();
      });
    }
  });
});

// This is a test that will be used to verify that the login page is displayed correctly for each user
for (const user of usersList) {
  test.describe(`@regression ${user.role.toUpperCase()} Login and save the storage state`, () => {
    test(`@regression ${user.role.toUpperCase()} Login successfully and save state`, async ({ page, context }) => {
      logger.info(`Starting login test for ${user.role} user`);
      const loginPage = new LoginPage(page);
      
      await test.step('Navigate to login page', async () => {
        await loginPage.navigateToLogin();
      });

      await test.step('Login with valid credentials', async () => {
        await loginPage.login(user.email, user.password);
      });

      await test.step('Verify login status', async () => {
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
      });

      await test.step('Save authentication state', async () => {
        await context.storageState({ path: user.storageState });
        logger.info(`Authentication state saved for ${user.role} user`);
      });
    });
  });
}

