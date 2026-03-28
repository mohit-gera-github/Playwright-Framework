import {test ,expect} from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { MyAccountPage } from '../../pages/MyAccountPage';
import { LoginPage } from '../../pages/LoginPage';
import { LogoutPage } from '../../pages/LogoutPage';
import { TestConfig } from '../../test.config';    
import { verify } from 'node:crypto';

let config: TestConfig;
let homePage: HomePage;
let myAccountPage: MyAccountPage;
let loginPage: LoginPage;
let logoutPage: LogoutPage;

test.beforeEach(async ({ page }) => {
    // navigate to page 
    config = new TestConfig();
    await page.goto(config.appUrl_PROD); 

    // Initilize Pages 
    homePage = new HomePage(page);
    myAccountPage = new MyAccountPage(page);
    loginPage = new LoginPage(page);
})

test.afterEach(async ({ page }) => {
    await page.close();
})

test('Logout Test @master @smoke @regression',async()=> {
    // Go to My Account and click login
    await homePage.clickMyAccount();
    await homePage.clickLogin();

    // Login with valid credentials
    await loginPage.login(config.email, config.password);   

    // Verify login success by checking My Account page
    expect(await myAccountPage.isMyAccountPageExist()).toBeTruthy();

    // Click logout and verify logout success
    logoutPage = await myAccountPage.clickLogout();

    // Wait for logout page to load
    await logoutPage.waitForLogoutPage();

     

    //verify if continue link exist on logout page
    expect(await logoutPage.iscontinueLinkExist()).toBeTruthy();
    
    // Click Continue and verify navigation back to HomePage
    homePage = await logoutPage.clickContinue();
    expect(await homePage.isHomePageExist()).toBeTruthy();
})
