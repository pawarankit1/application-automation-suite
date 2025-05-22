import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import logger, { maskSensitiveData } from '../utils/LoggerUtils';

export class LoginPage extends BasePage {
    // Locators
    private readonly languageSelectorLocator: Locator;
    private readonly languageEnglishLocator: Locator;
    private readonly loginButtonLocator: Locator;
    private readonly continueWithEmailButtonLocator: Locator;
    private readonly emailInputLocator: Locator;
    private readonly passwordInputLocator: Locator;
    private readonly signInButtonLocator: Locator;
    private readonly userProfileLocator: Locator;
    private readonly signInHeadingLocator: Locator;
    
    constructor(page: Page) {
        super(page);
        
        // Initialize locators
        this.languageSelectorLocator = page.getByRole('button', { name: 'Show/ hide language choice' });
        this.languageEnglishLocator = page.getByText('English');
        this.loginButtonLocator = page.getByRole('link', { name: 'Login' });
        this.continueWithEmailButtonLocator = page.getByRole('link', { name: 'Continue with Email' });
        this.signInHeadingLocator = page.getByRole('heading', { name: 'Sign in' });
        this.emailInputLocator = page.getByRole('textbox', { name: 'Email*' });
        this.passwordInputLocator = page.getByRole('textbox', { name: 'Password*' });
        this.signInButtonLocator = page.getByRole('button', { name: 'Sign in' });
        this.userProfileLocator = page.locator('nav  details');

    }

    /**
     * Navigate to login page and handle cookies
     */
    async navigateToLogin(): Promise<void> {
        await this.page.goto('/login');
        logger.info('Navigating to login page');
        await this.handleCookieConsent();
        await expect(this.page).toHaveURL(/.*login/);
        logger.info('Navigated to login page successfully');
    }

    /**
     * Select English language
     */
    async selectEnglish(): Promise<void> {
        await this.languageSelectorLocator.click();
        logger.info('Selecting English language');
        await this.languageEnglishLocator.click();
        logger.info('Selected English language successfully');
    }

    /**
     * Login with provided credentials
     */
    async login(useremail : string, password : string): Promise<void> {
        await this.selectEnglish();
        await this.continueWithEmailButtonLocator.click();
        await expect(this.signInHeadingLocator).toBeVisible();
        await this.emailInputLocator.fill(useremail);
        logger.info('Filled email input with :', useremail);
        await this.passwordInputLocator.fill(password);
        logger.info('Filled password input with :', maskSensitiveData(password));
        await this.signInButtonLocator.click();
        logger.info('Clicked sign in button');
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            await this.userProfileLocator.waitFor({ state: 'visible', timeout: 5000 });
            logger.info('User profile locator is visible');
            return true;
        } catch {
            logger.info('User profile locator is not visible');
            return false;
        }
    }
} 