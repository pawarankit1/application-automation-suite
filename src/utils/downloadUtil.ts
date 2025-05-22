import { Page, expect, Locator, Download } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

export class DownloadUtil {
    private readonly downloadDir: string;

    constructor() {
        this.downloadDir = path.resolve(__dirname, '../download');
        this.ensureDownloadDirectory();
    }

    /**
     * Ensures the download directory exists
     */
    private ensureDownloadDirectory(): void {
        if (!fs.existsSync(this.downloadDir)) {
            fs.mkdirSync(this.downloadDir, { recursive: true });
        }
    }

    /**
     * Saves the downloaded file and validates it
     * @param download The download object from Playwright
     * @returns The path where the file was saved
     */
    async saveAndValidateDownload(download: Download): Promise<string> {
        const filePath = path.join(this.downloadDir, await download.suggestedFilename());
        await download.saveAs(filePath);

        // Validate the file exists and is not empty
        if (!fs.existsSync(filePath)) {
            throw new Error(`Downloaded file not found at: ${filePath}`);
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error(`Downloaded file is empty: ${filePath}`);
        }

        console.log(`File successfully downloaded to: ${filePath}`);
        return filePath;
    }

    /**
     * Gets the download directory path
     */
    getDownloadDirectory(): string {
        return this.downloadDir;
    }
}
