pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'MEGHA959586'
        IMAGE_NAME = 'online-book-store'
        IMAGE_TAG = 'latest'
    }

    stages {

        stage('1. Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('2. Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('3. Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('4. Login & Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'Dock_cred_hub') {
                        dockerImage.push("${IMAGE_TAG}")
                        dockerImage.push("latest")
                        echo 'Image pushed to DockerHub successfully'
                    }
                }
            }
        }

        stage('5. Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig-secret']) {   // ✅ Corrected ID
                    bat 'kubectl apply -f deployment.yaml'
                    bat 'kubectl rollout status deployment/online-book-store'
                }
            }
        }

        stage('6. Build Successful') {
            steps {
                echo 'CI/CD Pipeline completed successfully!'
            }
        }
    }
}