pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '289984444209'

        PRODUCT_IMAGE = '289984444209.dkr.ecr.ap-south-1.amazonaws.com/shipforge/product-service'
        ORDER_IMAGE   = '289984444209.dkr.ecr.ap-south-1.amazonaws.com/shipforge/order-service'

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Product Service') {
    steps {
        dir('application/product-service') {
            sh '''
                npm ci
                npm test
            '''
        }
    }
}

stage('Test Order Service') {
    steps {
        dir('application/order-service') {
            sh '''
                npm ci
                npm test
            '''
        }
    }
}
        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build \
                      -t "$PRODUCT_IMAGE:$IMAGE_TAG" \
                      ./application/product-service

                    docker build \
                      -t "$ORDER_IMAGE:$IMAGE_TAG" \
                      ./application/order-service
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh '''
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest \
                      image \
                      --severity HIGH,CRITICAL \
                      --exit-code 1 \
                      "$PRODUCT_IMAGE:$IMAGE_TAG"

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest \
                      image \
                      --severity HIGH,CRITICAL \
                      --exit-code 1 \
                      "$ORDER_IMAGE:$IMAGE_TAG"
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-shipforge',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        docker run --rm \
                          -e AWS_ACCESS_KEY_ID \
                          -e AWS_SECRET_ACCESS_KEY \
                          amazon/aws-cli \
                          ecr get-login-password \
                          --region "$AWS_REGION" |
                        docker login \
                          --username AWS \
                          --password-stdin \
                          "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

                        docker push "$PRODUCT_IMAGE:$IMAGE_TAG"
                        docker push "$ORDER_IMAGE:$IMAGE_TAG"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '🚀 ShipForge CI pipeline completed successfully!'
        }

        failure {
            echo '❌ ShipForge CI pipeline failed. Check the stage logs.'
        }
    }
}