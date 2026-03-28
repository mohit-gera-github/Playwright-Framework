import {test , Page, expect} from '@playwright/test';
import { HomePage } from "../pages/HomePage";       
import { MyAccountPage } from '../pages/MyAccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { TestConfig } from '../test.config';    
import { LoginPage } from '../pages/LoginPage';


let homePage : HomePage;
let myAccountPage : MyAccountPage;
let logoutPage : LogoutPage;
let loginPage : LoginPage;
let config : TestConfig;

test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl); 
    homePage = new HomePage(page);
    myAccountPage = new MyAccountPage(page);
    logoutPage = new LogoutPage(page);
    loginPage = new LoginPage(page);
});

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.close();
})

test('Login and Logout Test @smoke @master @sanity @regression', async () => {

    // Go to My Account and click login
    await homePage.clickMyAccount();
    await homePage.clickLogin();

    // Enter valid credentials and login
    await loginPage.setEmail(config.email);
    await loginPage.setPassword(config.password);
    await loginPage.clickLogin();

    // Verify that My Account page is displayed
    const isMyAccountPageVisible = await myAccountPage.isMyAccountPageExist();      
    
    expect(isMyAccountPageVisible).toBeTruthy();
})