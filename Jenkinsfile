pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sseon701/moyamo-react"
        IMAGE_TAG = "latest"
        SSH_CREDENTIAL = 'ec2'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'fe/develop',
                    url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D203.git',
                    credentialsId: 'gitlab-credential-id'
            }
        }
        
        stage('Prepare .env') {
            steps {
                dir('FE') {
                    withCredentials([
                        string(credentialsId: 'VITE_API_BASE_URL', variable: 'VITE_API_BASE_URL'),
                        string(credentialsId: 'VITE_SERVER_STATIC_WS_URL', variable: 'VITE_SERVER_STATIC_WS_URL'),
                        string(credentialsId: 'VITE_SERVER_DYNAMIC_WS_URL', variable: 'VITE_SERVER_DYNAMIC_WS_URL')
                    ]) {
                        sh """
                            echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
                            echo "VITE_SERVER_STATIC_WS_URL=${VITE_SERVER_STATIC_WS_URL}" >> .env
                            echo "VITE_SERVER_DYNAMIC_WS_URL=${VITE_SERVER_DYNAMIC_WS_URL}" >> .env
                        """
                    }
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}", "./FE")
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
                        docker.image("${DOCKER_IMAGE}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'EC2_IP', variable: 'EC2_IP')]) {
                        sshagent(credentials: [SSH_CREDENTIAL]) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP '
                                    docker pull ${DOCKER_IMAGE}:${IMAGE_TAG}
                                    docker stop react || true
                                    docker rm react || true
                                    docker run -d --network nginx_jenkins_network --name react -p 5173:80 ${DOCKER_IMAGE}:${IMAGE_TAG}
                                '
                            """
                        }
                    }
                }
            }
        }

        stage('Notify Success') {
            steps {
                script {
                    def commitMessage = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                    def commitAuthor = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                    
                    withCredentials([string(credentialsId: 'FE-MATTERMOST', variable: 'MATTERMOST_WEBHOOK')]) {
                        sh """
                            curl -X POST -H 'Content-Type: application/json' -d '{
                                "text": ":cat_clap: **FE 배포 완료!**\\n\\n:label: 브랜치: fe/develop\\n:package: 도커 이미지: ${DOCKER_IMAGE}:${IMAGE_TAG}\\n:bust_in_silhouette: 작성자: ${commitAuthor}\\n:page_facing_up: 커밋 메시지: ${commitMessage}\\n:link: [서비스 바로가기](https://moyamo.site)"
                            }' $MATTERMOST_WEBHOOK
                        """
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                def commitMessage = sh(script: "git log -1 --pretty=format:'%s'", returnStdout: true).trim()
                def commitAuthor = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
                
                withCredentials([string(credentialsId: 'FE-MATTERMOST', variable: 'MATTERMOST_WEBHOOK')]) {
                    sh """
                        curl -X POST -H 'Content-Type: application/json' -d '{
                            "text": ":jenkins6: **FE 배포 실패!**\\n\\n<@sunju701> 확인 부탁드립니다.\\n:bust_in_silhouette: 작성자: ${commitAuthor}\\n:page_facing_up: 커밋 메시지: ${commitMessage}"
                        }' $MATTERMOST_WEBHOOK
                    """
                }
            }
        }
    }
}
