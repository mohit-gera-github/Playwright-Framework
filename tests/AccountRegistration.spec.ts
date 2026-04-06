import { expect, test } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { RandomDataUtil } from '../utils/randomDataGenerator';

test.beforeEach(async ({ page }) => {
    const config = new TestConfig();
    await page.goto(config.appUrl);
});

test('Account Registration Test1 @master @sanity @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const registrationPage = new RegistrationPage(page);

    await homePage.clickMyAccount();
    await homePage.clickRegister();

    const userDetails = {
        firstName: RandomDataUtil.getFirstname(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        phone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getRandomPassword(12)
    };

    await registrationPage.registerAccount(userDetails);
    const confirmationMessage = await registrationPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Your Account Has Been Created!');
});

test('Account Registration Test2 @master @sanity @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const registrationPage = new RegistrationPage(page);

    await homePage.clickMyAccount();
    await homePage.clickRegister();

    const userDetails = {
        firstName: RandomDataUtil.getFirstname(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        phone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getRandomPassword(12)
    };

    await registrationPage.registerAccount(userDetails);
    const confirmationMessage = await registrationPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Your Account Has Been Created!');
});

test('Account Registration Test3 @master @smoke @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    const registrationPage = new RegistrationPage(page);

    await homePage.clickMyAccount();
    await homePage.clickRegister();

    const userDetails = {
        firstName: RandomDataUtil.getFirstname(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getEmail(),
        phone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getRandomPassword(12)
    };

    await registrationPage.registerAccount(userDetails);
    const confirmationMessage = await registrationPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Your Account Has Been Created!');
});