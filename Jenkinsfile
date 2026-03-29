pipeline {

    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['qa', 'uat', 'prod'],
            description: 'Select target environment'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['sanity', 'master', 'regression', 'datadriven', 'smoke'],
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

    environment {
        NODE_ENV = 'ci'
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohit-gera-github/Playwright-Framework.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install
                    npm install -D allure-playwright
                    npm install -g allure-commandline --force
                    npm install -g cross-env
                '''
                // ✅ Added cross-env installation
            }
        }

        stage('Setup Environment File') {
            steps {
                script {
                    def credId = "${params.ENV}-env-file"

                    withCredentials([
                        file(credentialsId: credId, variable: 'ENV_FILE')
                    ]) {
                        // ✅ Fixed: double quotes + params.ENV
                        sh """
                            mkdir -p config
                            cp \$ENV_FILE config/${params.ENV}.env
                        """
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                script {

                    if (params.RERUN_FAILED == true) {
                        // ✅ Fixed: removed cross-env (Linux doesn't need it)
                        sh "ENV=${params.ENV} npx playwright test --last-failed"

                    } else if (params.PARALLEL_EXECUTION == true) {

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
                        sh "npm run test:${params.ENV}:${params.TEST_SUITE}"
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'allure generate ./allure-results --clean -o ./allure-report'
            }
        }

        stage('Zip Allure Report') {
            steps {
                // ✅ Fixed: Install zip first
                sh '''
                    sudo apt-get install -y zip
                    zip -r allure-report.zip allure-report
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**/*',
                             allowEmptyArchive: true
            allure includeProperties: false,
                   jdk: '',
                   results: [[path: 'allure-results']]
        }
        success {
            echo "✅ Tests PASSED on ${params.ENV} environment!"
        }
        failure {
            echo "❌ Tests FAILED on ${params.ENV} environment!"
        }
    }
}