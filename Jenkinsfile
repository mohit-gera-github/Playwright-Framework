pipeline {

    /******************************************************************
     * AGENT
     * Runs on any available Jenkins node
     ******************************************************************/
    agent any


    /******************************************************************
     * PARAMETERS (Visible in "Build with Parameters")
     ******************************************************************/
    parameters {

        choice(
            name: 'ENV',
            choices: ['qa', 'uat', 'prod'],
            description: 'Select target environment'
        )

        choice(
            name: 'TEST_SUITE',
            choices: ['sanity', 'master', 'regression', 'datadriven' , 'smoke'],
            description: 'Select test suite to execute'
        )

        booleanParam(
            name: 'RERUN_FAILED',
            defaultValue: false,
            description: 'Re-run only failed tests from previous execution'
        )

        booleanParam(
            name: 'PARALLEL_EXECUTION',
            defaultValue: false,
            description: 'Run tests in parallel across browsers'
        )
    }


    /******************************************************************
     * ENVIRONMENT VARIABLES
     ******************************************************************/
    environment {
        NODE_ENV = 'ci'
    }


    /******************************************************************
     * STAGES
     ******************************************************************/
    stages {

        /******************** CHECKOUT CODE ****************************/
        stage('Checkout Source Code') {
            steps {
                // Always pull fresh code from GitHub
                git branch: 'main',
                    url: 'https://github.com/mohit-gera-github/Playwright-Framework.git'
            }
        }


        /******************** INSTALL DEPENDENCIES *********************/
        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install
                    npm install -D allure-playwright
                    npm install -g allure-commandline --force
                '''
            }
        }


        /******************** SETUP ENV FILE ***************************/
        stage('Setup Environment File') {
            steps {
                script {

                    // Dynamically select credential ID
                    // qa   -> qa-env-file
                    // uat  -> uat-env-file
                    // prod -> prod-env-file
                    def credId = "${params.ENV}-env-file"

                    withCredentials([
                        file(credentialsId: credId, variable: 'ENV_FILE')
                    ]) {
                        sh '''
                            mkdir -p config
                            cp $ENV_FILE config/${ENV}.env
                        '''
                    }
                }
            }
        }


        /******************** INSTALL PLAYWRIGHT BROWSERS **************/
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }


        /******************** RUN TESTS ********************************/
        stage('Execute Tests') {
            steps {
                script {

                    /************* SCENARIO 1: RERUN FAILED ****************/
                    if (params.RERUN_FAILED == true) {

                        sh """
                            cross-env ENV=${params.ENV} \
                            npx playwright test --last-failed
                        """

                    } else {

                        /************* SCENARIO 2: PARALLEL EXECUTION ********/
                        if (params.PARALLEL_EXECUTION == true) {

                            parallel(

                                chrome: {
                                    sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=chromium"
                                },

                                firefox: {
                                    sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=firefox"
                                },

                                safari: {
                                    sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=webkit"
                                }
                            )

                        } else {

                            /************* SCENARIO 3: NORMAL RUN **************/
                            sh "npm run test:${params.ENV}:${params.TEST_SUITE}"
                        }
                    }
                }
            }
        }


        /******************** GENERATE ALLURE REPORT *******************/
        stage('Generate Allure Report') {
            steps {
                sh 'allure generate ./allure-results --clean -o ./allure-report'
            }
        }


        /******************** ZIP REPORT FOR EMAIL *********************/
        stage('Zip Allure Report') {
            steps {
                sh 'zip -r allure-report.zip allure-report'
            }
        }
    }


    /******************************************************************
     * POST ACTIONS (Runs even if tests fail)
     ******************************************************************/
    post {

        /******************** ALWAYS **********************************/
        always {

            // Store test artifacts in Jenkins
            archiveArtifacts artifacts: 'test-results/**/*',
                             allowEmptyArchive: true

            // Publish Allure report in Jenkins UI
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'allure-results']]
        }


        /******************** SUCCESS *********************************/
        success {

            /******** EMAIL NOTIFICATION ********/
            emailext(
                subject: "✅ Tests PASSED | ${params.ENV}",
                body: """
                Hello Team,

                All tests passed successfully.

                Environment : ${params.ENV}
                Test Suite : ${params.TEST_SUITE}

                Jenkins Build:
                ${env.BUILD_URL}

                Regards,
                Automation CI
                """,
                to: "qa-team@company.com",
                attachmentsPattern: 'allure-report.zip'
            )

            /******** SLACK NOTIFICATION ********/
            // Uncomment when Slack plugin is configured
            /*
            slackSend(
                channel: '#automation-reports',
                color: 'good',
                message: "✅ Tests PASSED | ${params.ENV} | ${env.BUILD_URL}"
            )
            */
        }


        /******************** FAILURE *********************************/
        failure {

            /******** EMAIL NOTIFICATION ********/
            emailext(
                subject: "❌ Tests FAILED | ${params.ENV}",
                body: """
                Hello Team,

                Some tests have failed.

                Environment : ${params.ENV}
                Test Suite : ${params.TEST_SUITE}

                Jenkins Build:
                ${env.BUILD_URL}

                Please find the attached Allure report.
                """,
                to: "qa-team@company.com",
                attachmentsPattern: 'allure-report.zip'
            )

            /******** SLACK NOTIFICATION ********/
            // Uncomment when Slack plugin is configured
            /*
            slackSend(
                channel: '#automation-alerts',
                color: 'danger',
                message: "❌ Tests FAILED | ${params.ENV} | ${env.BUILD_URL}"
            )
            */
        }
    }
}