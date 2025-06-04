import { faker } from '@faker-js/faker';

export interface TestCredentials {
  email: string;
  password: string;
}

export class FakerUtils {
  private static instance: FakerUtils;

  private constructor() {}

  public static getInstance(): FakerUtils {
    if (!FakerUtils.instance) {
      FakerUtils.instance = new FakerUtils();
    }
    return FakerUtils.instance;
  }

 



  // This is a method that will be used to generate invalid credentials
  public generateInvalidCredentials(count: number): TestCredentials[] {
    return Array.from({ length: count }, () => ({
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    }));
  }

 
} 