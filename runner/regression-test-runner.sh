#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

echo "Running regression tests..."
npx playwright test --project=regression

echo "Generating Allure report..."
npx allure generate ./src/reporting/allure-results --clean -o ./src/reporting/allure-report

echo "Opening Allure report..."
if [ -z "$CI" ]; then
  npx allure open src/reporting/allure-report
else
  echo "CI detected, skipping opening Allure report in browser."
fi


