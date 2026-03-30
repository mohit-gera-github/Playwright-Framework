import dotenv from 'dotenv';
import path from 'path';



// Why? → Reads ENV variable to know which environment to load
//        Defaults to 'qa' if not specified
const env = process.env.ENV || 'qa';

// Why? → Loads the correct .env file based on environment
//        qa   → config/qa.env
//        uat  → config/uat.env
//        prod → config/prod.env
dotenv.config({
    path: path.resolve(__dirname, `config/${env}.env`)
});

export class TestConfig {

    // Why process.env? → Reads value from loaded .env file
    // Why || fallback? → If .env not found, uses default value

    // App URL
    appUrl = process.env.APP_URL || 'https://naveenautomationlabs.com/opencart/';

    // Login Credentials
    email    = process.env.EMAIL    || 'mohit@test.com';
    password = process.env.PASSWORD || 'mohit123';

    // Product Details
    productName     = process.env.PRODUCT_NAME     || 'MacBook';
    productQuantity = process.env.PRODUCT_QUANTITY || '2';
    totalPrice      = process.env.TOTAL_PRICE      || '$1,204.00';

    // Current Environment (useful for logging/reporting)
    currentEnv = process.env.ENV || 'qa';
}
