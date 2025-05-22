import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';


// First test to perform login
test('1. should login and save state', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate to login page', async () => {
        await loginPage.navigateToLogin();
        
    }); 

    await test.step('Login with credentials', async () => {
        await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
    });

    await test.step('Verify login status', async () => {
        const isLoggedIn = await loginPage.isLoggedIn();
        await expect(isLoggedIn).toBeTruthy();
    });

    await test.step('Save authentication state', async () => {
        await context.storageState({ path: process.env.STORAGE_STATE_PATH! });
    });
});

// Subsequent tests using the saved state
test.describe('Authenticated tests', () => {
    test.use({ storageState: process.env.STORAGE_STATE_PATH! });

    test('2. should maintain login state', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await test.step('Navigate to homepage', async () => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');
        });

        await test.step('Verify login state is maintained', async () => {
            const isLoggedIn = await loginPage.isLoggedIn();
            await expect(isLoggedIn).toBeTruthy();
        });
    });
}); 