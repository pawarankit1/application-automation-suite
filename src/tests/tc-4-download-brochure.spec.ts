import { test, expect } from '../fixtures/downloadFixture';

test('Download sample PDF and handle popups', async ({ 
  downloadPage, 
  downloadUtil, 
  initiateDownload 
}) => {
  await test.step('Navigate to download page', async () => {
    await downloadPage.navigate();
  });

  await test.step('Handle consent popup', async () => {
    await downloadPage.handleConsentPopup();
  });

  await test.step('Initiate download process', async () => {
    const download = await initiateDownload();
    
    await test.step('Handle vignette popup', async () => {
      await downloadPage.closeVignette();
    });

    await test.step('Save and validate downloaded file', async () => {
      const filePath = await downloadUtil.saveAndValidateDownload(download);
    });
  });
});

