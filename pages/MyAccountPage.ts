import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;
    // Locators 
    private readonly headingMyAccount: Locator;
    private readonly linkLogout: Locator;

    // Constructor 
    constructor(page: Page) {
        this.page = page;
        this.headingMyAccount = page.locator('h2:has-text("My Account")');
        this.linkLogout = page.locator("//a[@class='list-group-item'][normalize-space()='Logout']");
    }

    // Action Methods

    /**
     * Verify whether the My Account page is displayed.
     * @returns {Promise<boolean>} True if My Account heading is visible.
     */
    async isMyAccountPageExist(): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Click logout link and navigate to Logout page.
     * @returns {Promise<LogoutPage>} Logout page object.
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.linkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Get current page title.
     * @returns {Promise<string>} Page title.
     */
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

}