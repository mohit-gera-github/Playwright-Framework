import { Page, Locator } from "@playwright/test";

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly inputFirstName: Locator;
    private readonly inputLastName: Locator;
    private readonly inputEmail: Locator;
    private readonly inputPhone: Locator;
    private readonly inputPwd: Locator;
    private readonly inputConfirmPwd: Locator;
    // newsletter radio buttons (unused)
    // private readonly rBtnNewsYes : Locator;
    // private readonly rBtnNewsNo : Locator;
    private readonly chkPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly confirmationMessage: Locator;

    // constructor 
    constructor(page: Page) {
        this.page = page;

        this.inputFirstName = page.locator("//input[@id='input-firstname']");
        this.inputLastName = page.locator("//input[@id='input-lastname']");
        this.inputEmail = page.locator("//input[@id='input-email']");
        this.inputPhone = page.locator("//input[@id='input-telephone']");
        this.inputPwd = page.locator("//input[@id='input-password']");
        this.inputConfirmPwd = page.locator("//input[@id='input-confirm']");
        this.chkPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator("//input[@value='Continue']");
        this.confirmationMessage = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
    }

    // Action Methods

    /**
     * Set first name in registration form.
     * @param {string} fName - First name.
     * @returns {Promise<void>}
     */
    async setFirstName(fName: string): Promise<void> {
        await this.inputFirstName.fill(fName);
    }

    /**
     * Set last name in registration form.
     * @param {string} lName - Last name.
     * @returns {Promise<void>}
     */
    async setLastName(lName: string): Promise<void> {
        await this.inputLastName.fill(lName);
    }

    /**
     * Set email in registration form.
     * @param {string} email - Email address.
     * @returns {Promise<void>}
     */
    async setEmail(email: string): Promise<void> {
        await this.inputEmail.fill(email);
    }

    /**
     * Set phone in registration form.
     * @param {string} phone - Phone number.
     * @returns {Promise<void>}
     */
    async setPhone(phone: string): Promise<void> {
        await this.inputPhone.fill(phone);
    }

    /**
     * Set password in registration form.
     * @param {string} pwd - Password.
     * @returns {Promise<void>}
     */
    async setPassword(pwd: string): Promise<void> {
        await this.inputPwd.fill(pwd);
    }

    /**
     * Set confirm password in registration form.
     * @param {string} confirmPwd - Confirmation password.
     * @returns {Promise<void>}
     */
    async setConfirmPassword(confirmPwd: string): Promise<void> {
        await this.inputConfirmPwd.fill(confirmPwd);
    }

    /**
     * Accept privacy policy checkbox.
     * @returns {Promise<void>}
     */
    async acceptPolicy(): Promise<void> {
        await this.chkPolicy.check();
    }

    /**
     * Click Continue button on registration step.
     * @returns {Promise<void>}
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Get registration success message.
     * @returns {Promise<string>} Confirmation message text.
     */
    async getConfirmationMessage(): Promise<string> {
        return this.confirmationMessage.innerText();
    }

    /**
     * Fill and submit registration form with user details.
     * @param {{ firstName: string; lastName: string; email: string; phone: string; password: string }} userDetails - User registration data.
     * @returns {Promise<void>}
     */
    async registerAccount(userDetails: { firstName: string; lastName: string; email: string; phone: string; password: string }): Promise<void> {
        await this.setFirstName(userDetails.firstName);
        await this.setLastName(userDetails.lastName);
        await this.setEmail(userDetails.email);
        await this.setPhone(userDetails.phone);
        await this.setPassword(userDetails.password);
        await this.setConfirmPassword(userDetails.password);
        await this.acceptPolicy();
        await this.clickContinue();
    }
}