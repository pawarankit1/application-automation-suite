import path from 'path';
import { logger } from '../../utils/LoggerUtil';
import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// This is a type that will be used to define the user role
export type UserRole = 'admin' | 'dev' | 'user';

// This is a interface that will be used to define the user
interface User {
  role: UserRole;
  email: string;
  password: string;
  storageState: string;
}

// This is a constant that will be used to define the roles
const roles = (process.env.TEST_ROLES?.split(',').map(r => r.trim()).filter(r => r !== '') as UserRole[]) || [];

// This is a constant that will be used to define the storage path
const storagePath = process.env.STORAGE_STATE_PATH || 'src/auth';

// This is a constant that will be used to define the users list
export const usersList: User[] = [];

// This is a loop that will be used to load the users list
for (const role of roles) {
  let email = '';
  let password = '';
  let storageState = path.join(storagePath, `${role}-storage.json`);

  switch (role) {
    case 'admin':
      email = process.env.ADMIN_USER_EMAIL!;
      password = process.env.ADMIN_USER_PASSWORD!;
      break;
    case 'dev':
      email = process.env.DEV_USER_EMAIL!;
      password = process.env.DEV_USER_PASSWORD!;
      break;
    case 'user':
      email = process.env.NORMAL_USER_EMAIL!;
      password = process.env.NORMAL_USER_PASSWORD!;
      break;
    default:
      logger.info(`[GlobalSetup] Unknown role '${role}' found in TEST_ROLES. Skipping.`);
      continue;
  }

  if (email && password) {
    usersList.push({ role, email, password, storageState });
    logger.info(`[GlobalSetup] Loaded user for role: ${role}`);
  } else {
    logger.warn(`[GlobalSetup] Missing email or password for role '${role}'. Skipping.`);
  }
}

if (usersList.length === 0 && roles.length > 0) {
  logger.error('[GlobalSetup] TEST_ROLES specified but no valid user credentials found in .env');
} else {
  logger.info('[GlobalSetup] Final usersList loaded');
}

// This function will be called ONCE before all tests
async function globalSetup(config: FullConfig) {
  logger.info('[GlobalSetup] Running Playwright global setup...');
  
  // Create storage state for each user role
  for (const user of usersList) {
    logger.info(`[GlobalSetup] Creating storage state for ${user.role} user`);
    
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      const loginPage = new LoginPage(page);
      await page.goto(config.projects[0].use.baseURL || 'http://localhost:8081');
      await loginPage.login(user.email, user.password);
      
      const isLoggedIn = await loginPage.isLoggedIn();
      if (!isLoggedIn) {
        throw new Error(`Failed to login as ${user.role} user`);
      }
      
      // Save storage state
      await context.storageState({ path: user.storageState });
      logger.info(`[GlobalSetup] Successfully created storage state for ${user.role} user`);
    } catch (error) {
      logger.error(`[GlobalSetup] Failed to create storage state for ${user.role} user: ${error}`);
      throw error;
    } finally {
      await browser.close();
    }
  }
  
  logger.info('[GlobalSetup] Completed storage state creation for all users');
}

export default globalSetup; 