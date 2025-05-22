# Technical Requirements

## Environment Setup
- Node.js (Latest LTS version recommended)
- npm package manager
- Playwright for end-to-end testing
- TypeScript
- Allure Command Line Tool

## Dependencies
```json
{
  "dependencies": {
    "@playwright/test": "latest",
    "dotenv": "latest",
    "typescript": "latest",
    "@playwright/test": "latest",
    "allure-playwright": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "allure-commandline": "latest"
  }
}
```

## Environment Variables
Required environment variables in `.env` file:
```
TEST_USER_EMAIL=your.email@example.com
TEST_USER_PASSWORD=your-password
STORAGE_STATE_PATH=playwright/.auth/user.json
SALT=your-encryption-salt
```

## Directory Structure
```
src/
├── config/
│   └── .env
├── fixtures/
│   └── downloadFixture.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── SearchPage.ts
│   └── downloadPage.ts
├── screenshots/
├── testdata/
│   ├── card-list-view.json
│   ├── map-search-data.json
│   └── mock-search-result.json
├── tests/
│   ├── tc-1-login.spec.ts
│   ├── tc-2-map-based-search.spec.ts
│   ├── tc-3-card-list-view.spec.ts
│   ├── tc-4-download-brochure.spec.ts
│   └── tc-6-intercept-mock.spec.ts
└── utils/
    ├── commands.ts
    ├── CryptojsUtil.ts
    ├── downloadUtil.ts
    └── LoggerUtils.ts
```

## Browser Support
- Chromium (Primary)
- Firefox (Optional)
- WebKit (Optional)

## Test Features
1. Authentication
   - Login functionality
   - Session state management
   - Cookie handling

2. Search Functionality
   - Location-based search
   - Map-based search
   - City/District search

3. Property Listing
   - Card list view
   - Map view
   - Property details
   - Search results verification

4. Download Features
   - PDF brochure download
   - Popup handling
   - File validation

5. Screenshot Capture
   - Timestamped screenshots
   - Search results verification
   - Error state capture

## Security Requirements
- Cookie consent management
- Popup handling

## Test Reporting
- Allure HTML reports
- Screenshot attachments
- Test execution video
- Test steps and descriptions
- Environment information
- Test duration and status
- One-click report generation script (`allure-report.sh`)

## Retry Mechanism
- Global retry configuration
- Retry on specific test failures
- Custom retry conditions
- Retry count configuration
- Retry timeout settings

## Performance Requirements
- Test timeout: 10000ms (default)
- Network idle state verification
- Element visibility checks
- Retry mechanisms for flaky operations
- Retry attempts: 2 (default)
- Retry timeout: 30000ms (default)

## Report Generation
- Automated report generation script
- Clean report generation (removes old reports)
- Automatic browser opening
- Server-based report viewing
- Interactive report navigation

## Test Features
1. Authentication
   - Login functionality
   - Session state management
   - Cookie handling

2. Search Functionality
   - Location-based search
   - Map-based search
   - City/District search

3. Property Listing
   - Card list view
   - Map view
   - Property details
   - Search results verification

4. Download Features
   - PDF brochure download
   - Popup handling
   - File validation

5. Screenshot Capture
   - Timestamped screenshots
   - Search results verification
   - Error state capture

## Security Requirements
- Cookie consent management
- Popup handling

## Test Reporting
- Allure HTML reports
- Screenshot attachments
- Test execution video
- Test steps and descriptions
- Environment information
- Test duration and status

## Retry Mechanism
- Global retry configuration
- Retry on specific test failures
- Custom retry conditions
- Retry count configuration
- Retry timeout settings

## Performance Requirements
- Test timeout: 10000ms (default)
- Network idle state verification
- Element visibility checks
- Retry mechanisms for flaky operations
- Retry attempts: 2 (default)
- Retry timeout: 30000ms (default) 