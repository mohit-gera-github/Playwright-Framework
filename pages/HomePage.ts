import { Page, Locator } from "@playwright/test";

export class HomePage{

    private readonly page : Page;
    // Locators 
    private readonly linkAccount : Locator ;
    private readonly linkLogin : Locator ;
    private readonly linkRegister : Locator;
    private readonly inputSearch : Locator ;
    private readonly btnSearch : Locator;
    private readonly logo : Locator;

    // Constructor 
    constructor(page : Page){
        this.page = page;
        this.logo = page.getByRole('img', { name: 'naveenopencart' });
        this.linkAccount = page.locator("//a[@title='My Account']");
        this.linkRegister = page.locator("//ul[@class='dropdown-menu dropdown-menu-right']//a[normalize-space()='Register']");
        this.linkLogin = page.locator("//ul[@class='dropdown-menu dropdown-menu-right']//a[normalize-space()='Login']");
        this.inputSearch = page.locator("//input[@placeholder='Search']");
        this.btnSearch = page.locator("//button[@class='btn btn-default btn-lg']");
    }

    // Actions methods

    /**
     * Check whether home page exists by title.
     * @returns {Promise<boolean>} True if home page title exists.
     */
    async isHomePageExist(): Promise<boolean> {
        return await this.logo.isVisible();
    }

    /**
     * Click the My Account link.
     * @returns {Promise<void>}
     */
    async clickMyAccount(): Promise<void> {
        await this.linkAccount.click();
    }

    /**
     * Click the Login link.
     * @returns {Promise<void>}
     */
    async clickLogin(): Promise<void> {
        await this.linkLogin.click();
    }

    /**
     * Click the Register link.
     * @returns {Promise<void>}
     */
    async clickRegister(): Promise<void> {
        await this.linkRegister.click();
    }

    /**
     * Set product name in search input.
     * @param {string} pName - Product name to search.
     * @returns {Promise<void>}
     */
    async setProductName(pName:string): Promise<void> {
        await this.inputSearch.fill(pName);
    }

    /**
     * Click search button.
     * @returns {Promise<void>}
     */
    async clickSearch(): Promise<void> {
        await this.btnSearch.click();
    }

}