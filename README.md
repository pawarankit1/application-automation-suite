# Pararius Automation Suite

An end-to-end test automation suite for Pararius.com using Playwright and TypeScript.

## Features

- Authentication testing
- Map-based property search
- Automated screenshot capture
- PDF download handling
- Advanced search functionality
- Cookie consent management
- Comprehensive test reporting
- Automatic retry mechanism
- Allure reporting integration
- One-click report generation

## Prerequisites

- Node.js (Latest version)
- npm
- Git
- Allure Command Line Tool

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pawarankit1/prarius-automation-suite.git
cd prarius-automation-suite
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

# Install specific browsers (optional)
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
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
TEST_USER_EMAIL=your.email@example.com
TEST_USER_PASSWORD=your-password
STORAGE_STATE_PATH=playwright/.auth/user.json
SALT=your-encryption-salt
```

7. Make the report generation script executable:
```bash
chmod +x allure-report.sh
```

8. Verify the setup:
```bash
# Run a test to verify everything is working
npx playwright test src/tests/tc-1-login.spec.ts

# Generate a test report
./allure-report.sh
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test src/tests/tc-1-login.spec.ts
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

## Test Reports

### HTML Report
After test execution, view the HTML report:
```bash
npx playwright show-report
```

### Allure Report
Generate and view Allure report using the provided script:
```bash
./allure-report.sh
```

The script will:
1. Generate a clean Allure report from test results
2. Open the report in your default browser
3. Start a local server for interactive report viewing
4. Keep the server running until you press Ctrl+C

## Retry Mechanism

The test suite includes an automatic retry mechanism:
- Default retry attempts: 1 (2 in CI)
- Retry timeout: 30 seconds
- Screenshots on failure
- Video recording for failed tests
- Trace viewer for debugging

## Test Structure

- `tc-1-login.spec.ts`: Authentication tests
- `tc-2-map-based-search.spec.ts`: Map search functionality
- `tc-3-card-list-view.spec.ts`: Property listing tests
- `tc-4-download-brochure.spec.ts`: PDF download tests
- `tc-6-intercept-mock.spec.ts`: Network interception tests

## Screenshots

Screenshots are automatically captured during test execution and stored in:
```
src/screenshots/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Best Practices

- Use TypeScript for type safety
- Follow Page Object Model pattern
- Implement proper error handling
- Use environment variables for sensitive data
- Add meaningful test descriptions
- Keep tests independent and atomic
- Use Allure annotations for better reporting
- Implement retry mechanisms for flaky tests

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Ensure Playwright browsers are installed
   - Check system requirements

2. **Authentication Issues**
   - Verify environment variables
   - Check network connectivity

3. **Screenshot Failures**
   - Ensure screenshots directory exists
   - Check write permissions

4. **Allure Report Issues**
   - Verify Allure command line tool installation
   - Check allure-results directory exists
   - Ensure proper permissions for report generation
   - Make sure allure-report.sh is executable
