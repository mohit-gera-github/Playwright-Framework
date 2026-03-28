pipeline {
    agent any
    // Why agent any?
    // → Run on any available Jenkins node/machine

    parameters {
        choice(
            name: 'ENV',
            choices: ['qa', 'uat', 'prod'],
            description: 'Select Environment to run tests on'
            // Why? → User picks environment from Jenkins UI
            //        Pipeline automatically picks correct credentials
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['sanity', 'master', 'regression', 'datadriven'],
            description: 'Select Test Suite to run'
            // Why? → User picks which group of tests to run
        )
        booleanParam(
            name: 'RERUN_FAILED',
            defaultValue: false,
            description: 'Check to rerun only last failed tests'
            // Why? → If 2 out of 9 tests fail
            //        Rerun only those 2 instead of all 9
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run tests in headless mode'
            // Why? → Server has no screen
            //        Headless = runs without visible browser
        )
    }

    stages {

        stage('Checkout') {
            // Why this stage?
            // → Downloads latest code from GitHub
            // → Always runs on fresh latest code
            // → No manual git pull needed
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohit-gera-github/Playwright-Framework.git'
            }
        }

        stage('Install Dependencies') {
            // Why this stage?
            // → AWS server is fresh environment
            // → node_modules is NOT in GitHub (.gitignore)
            // → Must install all packages before running tests
            steps {
                sh 'npm install'
                // Why allure-playwright?
                // → Generates Allure test results during test run
                sh 'npm install -D allure-playwright'
                // Why -g allure-commandline?
                // → CLI tool to generate HTML report from results
                sh 'npm install -g allure-commandline --force'
            }
        }

        stage('Setup ENV File') {
            // Why this stage?
            // → Fetches correct ENV file from Jenkins credentials
            // → Copies to config/ folder in workspace
            // → test.config.ts reads credentials from there
            steps {
                script {
                    // Why dynamic credId?
                    // → qa   → fetches qa-env-file from Jenkins
                    // → uat  → fetches uat-env-file from Jenkins
                    // → prod → fetches prod-env-file from Jenkins
                    def credId = "${params.ENV}-env-file"

                    withCredentials([
                        file(credentialsId: credId, variable: 'ENV_FILE')
                    ]) {
                        // Why mkdir -p?
                        // → config/ folder may not exist in fresh checkout
                        // → -p means don't error if already exists
                        sh "mkdir -p config"

                        // Why cp?
                        // → Copy env file from Jenkins secure storage
                        //   to workspace so test.config.ts can read it
                        sh "cp \$ENV_FILE config/${params.ENV}.env"
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            // Why this stage?
            // → Playwright needs browsers to run tests
            // → Chrome, Firefox etc must be installed on server
            // → --with-deps installs system dependencies too
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            // Why this stage?
            // → Actually runs the Playwright tests!
            // → Uses parameters to decide what to run
            steps {
                script {
                    if (params.RERUN_FAILED == true) {
                        // Why --last-failed?
                        // → Reads test-results/.last-run.json
                        // → Runs only previously failed tests
                        // → Saves time when only few tests fail
                        sh "cross-env ENV=${params.ENV} npx playwright test --last-failed"
                    } else {
                        // Why npm run test:ENV:SUITE?
                        // → e.g. npm run test:qa:sanity
                        // → cross-env sets ENV variable
                        // → test.config.ts reads correct .env file
                        // → Tests run on correct environment
                        sh "npm run test:${params.ENV}:${params.TEST_SUITE}"
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            // Why this stage?
            // → Converts raw JSON results to beautiful HTML report
            // → Team can see what passed / failed with details
            // → --clean removes old report before generating new
            steps {
                sh 'allure generate ./allure-results --clean -o ./allure-report'
            }
        }
    }

    post {
        // Why post block?
        // → Runs AFTER all stages complete
        // → Even if tests FAIL - report is still generated
        // → Team always gets the report

        always {
            // Why archiveArtifacts?
            // → Saves test result files in Jenkins
            // → Can download later for debugging
            // → allowEmptyArchive = don't fail if no files
            archiveArtifacts artifacts: 'test-results/**/*',
                             allowEmptyArchive: true

            // Why allure here?
            // → Publishes Allure HTML report in Jenkins UI
            // → Accessible from build page
            // → Team can view detailed results anytime
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'allure-results']]
        }

        success {
            // Why success block?
            // → Runs only when ALL tests pass
            // → Can add email/Slack notification here
            echo "✅ Tests PASSED on ${params.ENV} environment!"
        }

        failure {
            // Why failure block?
            // → Runs only when tests FAIL
            // → Can notify team here
            echo "❌ Tests FAILED on ${params.ENV} environment!"
        }
    }
}