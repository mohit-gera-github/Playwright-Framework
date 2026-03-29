pipeline {

    agent any

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

    environment {
        NODE_ENV = 'ci'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.pw-browsers"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohit-gera-github/Playwright-Framework.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npm install -D allure-playwright
                '''
            }
        }

        stage('Setup Environment File') {
            steps {
                withCredentials([
                    file(credentialsId: "${params.ENV}-env-file", variable: 'ENV_FILE')
                ]) {
                    
                    sh """
                        mkdir -p config
                        cp "\$ENV_FILE" "config/${params.ENV}.env"
                        chmod 644 "config/${params.ENV}.env"
                    """
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    def cmd = ""

                    if (params.RERUN_FAILED) {
                    
                        cmd = "ENV=${params.ENV} npx playwright test --last-failed"
                    } else if (params.PARALLEL_EXECUTION) {
                        parallel(
                            chrome: {
                                sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=chromium"
                            }
                            // ,
                            // firefox: {
                            //     sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=firefox"
                            // },
                            // safari: {
                            //     sh "npm run test:${params.ENV}:${params.TEST_SUITE} -- --project=webkit"
                            // }
                        )
                        return
                    } else {
                        cmd = "npm run test:${params.ENV}:${params.TEST_SUITE}"
                    }

                    sh cmd
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    if [ -d allure-results ]; then
                        echo "Generating Allure report..."
                        allure generate ./allure-results --clean -o ./allure-report
                    else
                        echo "No allure-results found - skipping"
                    fi
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/**',
                             allowEmptyArchive: true
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