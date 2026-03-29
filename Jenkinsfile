pipeline {

    agent any

    /* ===============================
       1️⃣ Job Parameters (UI driven)
       =============================== */
    parameters {
        choice(
            name: 'ENV',
            choices: ['qa', 'uat', 'prod'],
            description: 'Target environment'
        )

        choice(
            name: 'TEST_SUITE',
            choices: ['sanity', 'master', 'regression', 'datadriven', 'smoke'],
            description: 'Test suite to execute'
        )

        booleanParam(
            name: 'RERUN_FAILED',
            defaultValue: false,
            description: 'Re-run only failed tests'
        )

        booleanParam(
            name: 'PARALLEL_EXECUTION',
            defaultValue: false,
            description: 'Enable Playwright parallel execution'
        )
    }

    /* ===============================
       2️⃣ Global Environment Variables
       =============================== */
    environment {
        NODE_ENV = 'ci'
        ENV = "${params.ENV}"
    }

    stages {

        /* ===============================
           3️⃣ Checkout Source Code
           =============================== */
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohit-gera-github/Playwright-Framework.git'
            }
        }

        /* ===============================
           4️⃣ Install Node Dependencies
           =============================== */
        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npm install -D allure-playwright
                '''
            }
        }

        /* ===============================
           5️⃣ Load Environment Config
           =============================== */
        stage('Setup Environment File') {
            steps {
                script {
                    if (!params.ENV?.trim()) {
                        error "ENV parameter is missing"
                    }

                    def credId = "${params.ENV}-env-file"

                    withCredentials([
                        file(credentialsId: credId, variable: 'ENV_FILE')
                    ]) {
                        sh """
                            mkdir -p config
                            cp \$ENV_FILE config/${params.ENV}.env
                        """
                    }
                }
            }
        }

        /* ===============================
           6️⃣ Install Playwright Browsers
           =============================== */
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium firefox webkit --with-deps'
            }
        }

        /* ===============================
           7️⃣ Execute Tests
           =============================== */
        stage('Execute Tests') {
            steps {
                script {

                    /* ---------- Scenario 1: Re-run Failed ---------- */
                    if (params.RERUN_FAILED) {

                        sh "ENV=${params.ENV} npx playwright test --last-failed"

                    /* ---------- Scenario 2: Parallel Execution ---------- */
                    } else if (params.PARALLEL_EXECUTION) {

                        /*
                         * Playwright handles:
                         * - cross-browser
                         * - parallel workers
                         * Defined in playwright.config.ts
                         */
                        sh "npm run test:${params.ENV}:${params.TEST_SUITE}"

                    /* ---------- Scenario 3: Normal Execution ---------- */
                    } else {

                        sh "npm run test:${params.ENV}:${params.TEST_SUITE}"
                    }
                }
            }
        }

        /* ===============================
           8️⃣ Generate Allure Report
           =============================== */
        stage('Generate Allure Report') {
            steps {
                sh '''
                    if [ -d allure-results ]; then
                        allure generate allure-results --clean -o allure-report
                    else
                        echo "No allure-results directory found"
                    fi
                '''
            }
        }

        /* ===============================
           9️⃣ Zip Allure Report
           =============================== */
        // stage('Zip Allure Report') {
        //     steps {
        //         sh 'zip -r allure-report.zip allure-report || true'
        //     }
        // }
    }

    /* ===============================
       🔟 Post Build Actions
       =============================== */
    post {

        always {
            archiveArtifacts artifacts: 'allure-report.zip', allowEmptyArchive: true

            allure(
                includeProperties: false,
                results: [[path: 'allure-results']]
            )
        }

        success {
            echo "✅ Tests PASSED on ${params.ENV.toUpperCase()}"
        }

        failure {
            echo "❌ Tests FAILED on ${params.ENV.toUpperCase()}"
        }
    }
}