npx playwright test
rm -rf ./src/reporting/allure-results
mv ./allure-results ./src/reporting

npx allure generate ./src/reporting/allure-results --clean -o ./src/reporting/allure-report
npx allure open src/reporting/allure-report


