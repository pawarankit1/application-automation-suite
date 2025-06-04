import * as fs from 'fs';
import * as path from 'path';

export class MockDataUtil {
  private static instance: MockDataUtil;
  private mockData: any;

  private constructor() {
    this.loadMockData();
  }
// This is a method that will be used to get the instance of the MockDataUtil class
  public static getInstance(): MockDataUtil {
    if (!MockDataUtil.instance) {
      MockDataUtil.instance = new MockDataUtil();
    }
    return MockDataUtil.instance;
  }

  // This is a method that will be used to load the mock data
  private loadMockData(): void {
    const mockDataPath = path.resolve(__dirname, '../testdata/login-error-messages.json');
    const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');
    this.mockData = JSON.parse(mockDataContent);
  }

  // This is a method that will be used to get the error message
  public getErrorMessage(type: string): { text: string; selector: string } {
    return this.mockData.errorMessages[type] || this.mockData.errorMessages.generic;
  }

  // This is a method that will be used to get all the error messages
  public getAllErrorMessages(): Record<string, { text: string; selector: string }> {
    return this.mockData.errorMessages;
  }
} 