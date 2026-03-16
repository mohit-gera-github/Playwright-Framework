import { Page, expect, Locator } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    
    // Locators
    private readonly radioGuest: Locator;
    private readonly btnContinue: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtAddress1: Locator;
    private readonly txtAddress2: Locator;
    private readonly txtCity: Locator;
    private readonly txtPin: Locator;
    private readonly drpCountry: Locator;
    private readonly drpState: Locator;
    private readonly btnContinueBillingAddress: Locator;
    private readonly btnContinueDeliveryAddress: Locator;
    private readonly txtDeliveryMethod: Locator;
    private readonly btnContinueShippingAddress: Locator;
    private readonly chkboxTerms: Locator;
    private readonly btnContinuePaymentMethod: Locator;
    private readonly lblTotalPrice: Locator;
    private readonly btnConfOrder: Locator;
    private readonly lblOrderConMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with CSS selectors
        this.radioGuest = page.locator('input[value="guest"]');
        this.btnContinue = page.locator('#button-account');
        this.txtFirstName = page.locator('#input-payment-firstname');
        this.txtLastName = page.locator('#input-payment-lastname');
        this.txtAddress1 = page.locator('#input-payment-address-1');
        this.txtAddress2 = page.locator('#input-payment-address-2');
        this.txtCity = page.locator('#input-payment-city');
        this.txtPin = page.locator('#input-payment-postcode');
        this.drpCountry = page.locator('#input-payment-country');
        this.drpState = page.locator('#input-payment-zone');
        this.btnContinueBillingAddress = page.locator('#button-payment-address');
        this.btnContinueDeliveryAddress = page.locator('#button-shipping-address');
        this.txtDeliveryMethod = page.locator('textarea[name="comment"]');
        this.btnContinueShippingAddress = page.locator('#button-shipping-method');
        this.chkboxTerms = page.locator('input[name="agree"]');
        this.btnContinuePaymentMethod = page.locator('#button-payment-method');
        this.lblTotalPrice = page.locator('strong:has-text("Total:") + td');
        this.btnConfOrder = page.locator('#button-confirm');
        this.lblOrderConMsg = page.locator('#content h1');
    }

    /**
     * Check if checkout page exists by verifying the page title.
     * @returns {Promise<boolean>} True when checkout page title matches, otherwise false.
     */
    async isCheckoutPageExists(): Promise<boolean> {
        try {
            await expect(this.page).toHaveTitle("Checkout");
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Choose checkout option from available options.
     * @param {string} checkOutOption - The text of checkout option to select.
     * @returns {Promise<void>}
     */
    async chooseCheckoutOption(checkOutOption: string): Promise<void> {
        if (checkOutOption === "Guest Checkout") {
            await this.radioGuest.click();
        }
    }

    /**
     * Click on checkout continue button.
     * @returns {Promise<void>}
     */
    async clickOnContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Set first name in billing form.
     * @param {string} firstName - First name to enter.
     * @returns {Promise<void>}
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Set last name in billing form.
     * @param {string} lastName - Last name to enter.
     * @returns {Promise<void>}
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Set address 1 in billing form.
     * @param {string} address1 - Address line 1 to enter.
     * @returns {Promise<void>}
     */
    async setAddress1(address1: string): Promise<void> {
        await this.txtAddress1.fill(address1);
    }

    /**
     * Set address 2 in billing form.
     * @param {string} address2 - Address line 2 to enter.
     * @returns {Promise<void>}
     */
    async setAddress2(address2: string): Promise<void> {
        await this.txtAddress2.fill(address2);
    }

    /**
     * Set city in billing form.
     * @param {string} city - City value to enter.
     * @returns {Promise<void>}
     */
    async setCity(city: string): Promise<void> {
        await this.txtCity.fill(city);
    }

    /**
     * Set postal code in billing form.
     * @param {string} pin - Postal code to enter.
     * @returns {Promise<void>}
     */
    async setPin(pin: string): Promise<void> {
        await this.txtPin.fill(pin);
    }

    /**
     * Select country from country dropdown.
     * @param {string} country - Country label to select.
     * @returns {Promise<void>}
     */
    async setCountry(country: string): Promise<void> {
        await this.drpCountry.selectOption({ label: country });
    }

    /**
     * Select state/region from state dropdown.
     * @param {string} state - State label to select.
     * @returns {Promise<void>}
     */
    async setState(state: string): Promise<void> {
        await this.drpState.selectOption({ label: state });
    }

    /**
     * Click continue after billing address form.
     * @returns {Promise<void>}
     */
    async clickOnContinueAfterBillingAddress(): Promise<void> {
        await this.btnContinueBillingAddress.click();
    }

    /**
     * Click continue after delivery address form.
     * @returns {Promise<void>}
     */
    async clickOnContinueAfterDeliveryAddress(): Promise<void> {
        await this.btnContinueDeliveryAddress.click();
    }

    /**
     * Set delivery method comment text.
     * @param {string} deliveryMsg - Message for delivery instructions.
     * @returns {Promise<void>}
     */
    async setDeliveryMethodComment(deliveryMsg: string): Promise<void> {
        await this.txtDeliveryMethod.fill(deliveryMsg);
    }

    /**
     * Click continue after selecting shipping method.
     * @returns {Promise<void>}
     */
    async clickOnContinueAfterDeliveryMethod(): Promise<void> {
        await this.btnContinueShippingAddress.click();
    }

    /**
     * Select terms and conditions checkbox.
     * @returns {Promise<void>}
     */
    async selectTermsAndConditions(): Promise<void> {
        await this.chkboxTerms.check();
    }

    /**
     * Click continue after selecting payment method.
     * @returns {Promise<void>}
     */
    async clickOnContinueAfterPaymentMethod(): Promise<void> {
        await this.btnContinuePaymentMethod.click();
    }

    /**
     * Get total price text before order confirmation.
     * @returns {Promise<string | null>} Total price as text.
     */
    async getTotalPriceBeforeConfOrder(): Promise<string | null> {
        return await this.lblTotalPrice.textContent();
    }

    /**
     * Click on confirm order button.
     * @returns {Promise<void>}
     */
    async clickOnConfirmOrder(): Promise<void> {
        await this.btnConfOrder.click();
    }

    /**
     * Verify whether order placement confirmation page is shown.
     * @returns {Promise<boolean>} True when order placed message appears.
     */
    async isOrderPlaced(): Promise<boolean> {
        try {
            // Handle alert if present
            if (this.page.on('dialog', dialog => dialog.accept())) {
                await this.page.waitForEvent('dialog');
            }
            
            await expect(this.lblOrderConMsg).toHaveText("Your order has been placed!");
            return true;
        } catch (error) {
            console.log(`Error verifying order placement: ${error}`);
            return false;
        }
    }
}