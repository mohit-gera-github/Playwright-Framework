import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/* =====================================
   Load environment-specific .env file
   ===================================== */

const ENV = process.env.ENV || 'qa';

// Load config/qa.env, config/uat.env, config/prod.env
dotenv.config({
  path: path.resolve(__dirname, `config/${ENV}.env`)
});

/* =====================================
    Playwright Configuration
   ===================================== */

export default defineConfig({

  testDir: './tests',

  /* Timeouts */
  timeout: 120000,

  /* Retry strategy */
  retries: process.env.CI ? 1 : 0,

  expect: {
    timeout: 30000,
  },
  
  fullyParallel: false,
  workers: process.env.CI ? 3 : undefined,

  /* Reporting */
  reporter: [
    ['dot'],
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],

 
  use: {
    baseURL: process.env.APP_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    headless: true,
    ignoreHTTPSErrors: true,
     navigationTimeout: 60000,
    actionTimeout: 30000,
  },

 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // }
  ]
});