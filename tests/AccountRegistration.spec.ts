import { Page, expect, test } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { DataProvide } from '../utils/dataProvider';
import { RandomDataUtil } from '../utils/randomDataGenerator';


let homePage: HomePage;
let registrationPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
    const config = new TestConfig();
    await page.goto(config.appUrl);
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
})

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.close();
})

test('Account Registration Test  @master @sanity @regression', async () => {


    // Go to My Account and click register

    await homePage.clickMyAccount();
    await homePage.clickRegister();

    // Fill details in the registration form
    const userDetails = {
        firstName: RandomDataUtil.getFirstname(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        phone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getRandomPassword(12)
    };
    await registrationPage.registerAccount(userDetails);
    const confirmationMessage = await registrationPage.getConfirmationMessage();

    // Assertion
    expect(confirmationMessage).toContain('Your Account Has Been Created!');


})