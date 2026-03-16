import { th } from "@faker-js/faker";
import { Page , Locator } from "@playwright/test";

export class LoginPage{
    private readonly page : Page;
    // Locators
    private readonly inputEmail : Locator;
    private readonly inputPassword : Locator;
    private readonly btnLogin : Locator;
    private readonly errorMessage : Locator;

    // Constructor 
    constructor(page : Page){
        this.page = page;
        this.inputEmail = page.locator("//input[@id='input-email']");
        this.inputPassword = page.locator("//input[@id='input-password']");
        this.btnLogin = page.locator("//input[@value='Login']");
        this.errorMessage = page.locator("//div[contains(@class,'alert-danger')]");
    }        
    
    // Action Methods

    /**
     * Fill email input.
     * @param {string} email - Email address to enter.
     * @returns {Promise<void>}
     */
    async setEmail(email:string): Promise<void>{
        await this.inputEmail.fill(email);
    }       

    /**
     * Fill password input.
     * @param {string} pwd - Password to enter.
     * @returns {Promise<void>}
     */
    async setPassword(pwd:string): Promise<void>{
        await this.inputPassword.fill(pwd);
    }       

    /**
     * Click login button.
     * @returns {Promise<void>}
     */
    async clickLogin(): Promise<void>{
        await this.btnLogin.click();
    }       

    /**
     * Get login error message text.
     * @returns {Promise<string>} Error message text.
     */
    async getErrorMessage(): Promise<string>{
        return await this.errorMessage.textContent() || '';
    }

    /**
     * Complete login workflow using email and password.
     * @param {string} email - Email address.
     * @param {string} password - Password.
     * @returns {Promise<void>}
     */
    async login(email:string, password:string): Promise<void>{
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLogin();
    }
}