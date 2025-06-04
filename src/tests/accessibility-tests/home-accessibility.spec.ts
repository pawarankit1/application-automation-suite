import { test, expect } from '../../fixtures/accessbilityFixture';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/LoggerUtil';

// This is a test that will be used to verify that the home page has no accessibility violations
test('@accessibility Home page should have no accessibility violations', async ({ page, accessibilityBuilder }) => {
  const loginPage = new LoginPage(page);
  
  await test.step('Navigate to login page', async () => {
    await loginPage.navigateToLogin();
    logger.info('Navigated to login page');
  });

  await test.step('Login with admin credentials', async () => {
    await loginPage.login(process.env.ADMIN_USER_EMAIL!, process.env.ADMIN_USER_PASSWORD!);
    logger.info('Logged in successfully with admin credentials');
  });
  
  await test.step('Configure accessibility rules', async () => {
    logger.info('Setting up accessibility rules and tags');
    const { violations } = await accessibilityBuilder
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a', 
        'wcag21aa',  
        'best-practice'
      ])
      .withRules([
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent',
        'aria-roles',
        'aria-valid-attr-value',
        'aria-valid-attr',
        'button-name',
        'color-contrast',
        'document-title',
        'duplicate-id',
        'form-field-multiple-labels',
        'frame-title',
        'html-has-lang',
        'html-lang-valid',
        'image-alt',
        'input-button-name',
        'input-image-alt',
        'label',
        'link-name',
        'list',
        'listitem',
        'meta-viewport',
        'object-alt',
        'role-img-alt',
        'scrollable-region-focusable',
        'select-name',
        'svg-img-alt',
        'td-headers-attr',
        'th-has-data-cells',
        'valid-lang'
      ])
      .analyze();

    // Log violations with details
    if (violations.length > 0) {
      logger.info('Accessibility Violations:');
      violations.forEach((violation, index) => {
        logger.info(`\nViolation ${index + 1}:`);
        logger.info(`Rule: ${violation.id}`);
        logger.info(`Impact: ${violation.impact}`);
        logger.info(`Description: ${violation.description}`);
        logger.info(`Help: ${violation.help}`);
        logger.info(`Tags: ${violation.tags.join(', ')}`);
        logger.info(`Affected Elements: ${violation.nodes.length}`);
      });
    }

    expect(violations).toHaveLength(1);
  });
});
