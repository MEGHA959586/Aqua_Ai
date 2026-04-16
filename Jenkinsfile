pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'MEGHA959586'
        DOCKER_IMAGE_NAME = 'my_docker_image_meghana'
        DOCKER_IMAGE_TAG = 'latest'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'meghana', url: 'https://github.com/MEGHA959586/Aqua_Ai.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'Dock_cred_hub',
                                                  usernameVariable: 'DOCKER_USER',
                                                  passwordVariable: 'DOCKER_PASS')]) {
                    bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                bat "docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }
    }

    post {
        success {
            bat "docker rmi ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        }
    }
}