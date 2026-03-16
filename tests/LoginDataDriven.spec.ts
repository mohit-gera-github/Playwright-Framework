import { Page, expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { TestConfig } from '../test.config';
import { DataProvide } from '../utils/dataProvider';
import { LogoutPage } from '../pages/LogoutPage';

const jsonPath = './testdata/logindata.json';
const csvPath = './testData/logindata.csv';
const jsonTestData = DataProvide.getTestDataFromJson(jsonPath);
const csvTestData = DataProvide.getTestDataFromCsv(csvPath);

for (const data of jsonTestData) {
    test(`Login Test (JSON) with ${data.email} and ${data.password} Status : ${data.testName} @datadriven @regression`, async ({ page }) => {
        const config = new TestConfig();
        await page.goto(config.appUrl);

        const homePage = new HomePage(page);
        const myAccountPage = new MyAccountPage(page);
        const loginPage = new LoginPage(page);
        const logoutPage = new LogoutPage(page);

        // Go to My Account and click login
        await homePage.clickMyAccount();
        await homePage.clickLogin();

        await loginPage.login(data.email, data.password);

        if (data.expected === 'success') {
            expect(await myAccountPage.isMyAccountPageExist()).toBeTruthy();
            // Logout after successful login
            await myAccountPage.clickLogout();
            expect(await logoutPage.getLogoutMessage()).toContain('Account Logout');
            await logoutPage.clickContinue();
        } else {
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
        }
    });
}

for (const data of csvTestData) {
    test(`Login Test (CSV) with ${data.email} and ${data.password} Status : ${data.testName} @datadriven @regression`, async ({ page }) => {
        const config = new TestConfig();
        await page.goto(config.appUrl);

        const homePage = new HomePage(page);
        const myAccountPage = new MyAccountPage(page);
        const loginPage = new LoginPage(page);
        const logoutPage = new LogoutPage(page);

        // Go to My Account and click login
        await homePage.clickMyAccount();
        await homePage.clickLogin();

        await loginPage.login(data.email, data.password);

        if (data.expected === 'success') {
            expect(await myAccountPage.isMyAccountPageExist()).toBeTruthy();
            // Logout after successful login
            await myAccountPage.clickLogout();
            expect(await logoutPage.getLogoutMessage()).toContain('Account Logout');
            await logoutPage.clickContinue();
        } else {
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).toContain(' Warning: No match for E-Mail Address and/or Password.');
        }
    });
}
