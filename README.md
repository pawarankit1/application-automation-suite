# Application Automation Suite

An end-to-end test automation suite using Playwright and TypeScript with a focus on smoke, regression, and accessibility testing.

## Features

- Role-based authentication testing (admin, dev, user)
- Comprehensive smoke testing
- Regression test suite
- Accessibility testing (WCAG compliance)
- Automated screenshot capture
- Advanced test reporting
- Automatic retry mechanism
- Allure reporting integration
- One-click report generation
- Environment-based configuration
- Secure credential management

## Prerequisites

- Node.js (Latest version)
- npm
- Git
- Allure Command Line Tool

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd application-automation-suite
```

2. Install project dependencies:
```bash
# Install all required packages
npm install @playwright/test allure-playwright allure-commandline dotenv typescript @types/node --save-dev
```

3. Install Playwright and its browsers:
```bash
# Install Playwright
npx playwright install
```

4. Install Allure command line tool globally:
```bash
# Install Allure command line tool
npm install -g allure-commandline

# Verify installation
allure --version
```

5. Create and configure environment file:
```bash
# Create config directory if it doesn't exist
mkdir -p src/config

# Create .env file
cp src/config/.env.example src/config/.env
```

6. Update the `.env` file with your credentials:
```env
TEST_ROLES=admin,dev,user
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=admin-password
DEV_USER_EMAIL=dev@example.com
DEV_USER_PASSWORD=dev-password
NORMAL_USER_EMAIL=user@example.com
NORMAL_USER_PASSWORD=user-password
STORAGE_STATE_PATH=src/auth
```

## Running Tests

### Using Runner Scripts

The project includes shell scripts in the `runner/` directory for executing different test suites:

```bash
# Run complete test suite
./runner/complete-test-runner.sh

# Run smoke tests
./runner/smoke-test-runner.sh

# Run regression tests
./runner/regression-test-runner.sh

# Run accessibility tests
./runner/accessibility-test-runner.sh
```

Each script will:
1. Execute the respective test suite
2. Generate Allure reports
3. Open the report in your default browser

### Manual Test Execution

You can also run tests manually using Playwright commands:

```bash
# Run all tests
npx playwright test

# Run smoke tests
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression

# Run accessibility tests
npx playwright test --grep @accessibility

# Run tests in debug mode
npx playwright test --debug

# Run tests with UI mode
npx playwright test --ui
```

## Project Structure

```
src/
├── auth/                    # Authentication state storage
├── config/                  # Configuration files
├── fixtures/               # Test fixtures and test data
├── logging/                # Logging utilities
├── pages/                  # Page Object Models
├── reporting/              # Test reporting utilities
├── testdata/              # Test data files
├── tests/                 # Test suites
│   ├── accessibility-tests/  # Accessibility test suite
│   ├── regression/          # Regression test suite
│   ├── setup/              # Test setup and configuration
│   └── smoke/              # Smoke test suite
└── utils/                 # Utility functions
```

## Test Reports

### HTML Report
After test execution, view the HTML report:
```bash
npx playwright show-report
```

### Allure Report
The Allure reports are automatically generated by the runner scripts. However, you can also generate them manually:

```bash
# Generate and open Allure report
npx allure generate allure-results --clean && allure open
```

The runner scripts handle:
- Test execution
- Report generation
- Browser opening
- Server management
- Clean report generation

## Best Practices

- Use TypeScript for type safety
- Follow Page Object Model pattern
- Implement proper error handling
- Use environment variables for sensitive data
- Add meaningful test descriptions
- Keep tests independent and atomic
- Use Allure annotations for better reporting
- Implement retry mechanisms for flaky tests
- Follow WCAG guidelines for accessibility testing
- Maintain separate test suites for different test types

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Ensure Playwright browsers are installed
   - Check system requirements

2. **Authentication Issues**
   - Verify environment variables
   - Check network connectivity
   - Ensure correct user roles are configured

3. **Test Failures**
   - Check Allure reports for detailed failure information
   - Verify test data and environment setup
   - Ensure proper user credentials are configured

4. **Accessibility Issues**
   - Verify WCAG compliance
   - Check accessibility test configurations
   - Review accessibility test reports
