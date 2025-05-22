import { test as base, Page, Download } from '@playwright/test';
import { DownloadPage } from '../pages/downloadPage';
import { DownloadUtil } from '../utils/downloadUtil';

// Declare the types of your fixtures
type DownloadFixtures = {
  downloadPage: DownloadPage;
  downloadUtil: DownloadUtil;
  initiateDownload: () => Promise<Download>;
};

// Extend the base test type with your fixtures
export const test = base.extend<DownloadFixtures>({
  // Define the downloadPage fixture
  downloadPage: async ({ page }, use) => {
    const downloadPage = new DownloadPage(page);
    await use(downloadPage);
  },

  // Define the downloadUtil fixture
  downloadUtil: async ({}, use) => {
    const downloadUtil = new DownloadUtil();
    await use(downloadUtil);
  },

  // Define the initiateDownload fixture
  initiateDownload: async ({ downloadPage }, use) => {
    await use(async () => {
      const [download] = await downloadPage.initiateDownload();
      return download;
    });
  }
});

export { expect } from '@playwright/test'; 