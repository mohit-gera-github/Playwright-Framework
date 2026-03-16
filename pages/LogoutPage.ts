import { Page, Locator } from "@playwright/test";
import { HomePage } from "./HomePage";

export class LogoutPage {
    private readonly page: Page;
    // Locators
    private readonly logoutMessage: Locator;
    private readonly linkContinue: Locator;

    // Constructor
    constructor(page: Page) {
        this.page = page;
        this.logoutMessage = page.locator("//h1[normalize-space()='Account Logout']");
        this.linkContinue = page.getByRole('link', { name: 'Continue' });
    }

    // Action Methods

    /**
     * Get logout confirmation message text.
     * @returns {Promise<string>} Logout message text.
     */
    async getLogoutMessage(): Promise<string> {
        return await this.logoutMessage.textContent() || '';
    }

    /**
     * Click continue link and navigate back to HomePage.
     * @returns {Promise<HomePage>} HomePage object.
     */
    async clickContinue(): Promise<HomePage> {
        await this.linkContinue.click();
        return new HomePage(this.page);
    }

    /** 
     * Wait for the logout page to load.
     * @returns {Promise<void>}
     */
    async waitForLogoutPage(): Promise<void> {
        await this.logoutMessage.waitFor({ state: 'visible', timeout: 5000 });
    }

    /** 
     * Verify if Continue link exists on the logout page.
     * @returns {Promise<boolean>} True if the Continue link is visible, otherwise false.
     */
   
    async iscontinueLinkExist(): Promise<boolean> {
        try {
            await this.linkContinue.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }


    

}