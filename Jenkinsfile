pipeline {
  agent { label 'built-in' }

  environment {
    REGISTRY = credentials('registry-url')          // optional: e.g., gcr.io/PROJECT, <aws_account>.dkr.ecr.region.amazonaws.com, or myacr.azurecr.io
    REGISTRY_USER = credentials('registry-user')    // or use cloud-specific auth steps instead
    REGISTRY_PASS = credentials('registry-pass')
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    SONAR_HOST_URL = credentials('SONAR_HOST_URL')  // http://sonarqube:9000
    SONAR_TOKEN = credentials('SONAR_TOKEN')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Test (Backend)') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm test'
          sh 'npm run lint || true'
        }
      }
    }

    stage('Install & Build (Frontend)') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('SonarQube Scan') {
      steps {
        sh '''
        npx -y sonar-scanner \
          -Dsonar.host.url=${SONAR_HOST_URL} \
          -Dsonar.login=${SONAR_TOKEN}
        '''
      }
    }

    stage('Build Images') {
      steps {
        sh '''
        docker build -t $REGISTRY/mern-backend:$IMAGE_TAG ./backend
        docker build -t $REGISTRY/mern-frontend:$IMAGE_TAG ./frontend
        '''
      }
    }

    stage('Login & Push') {
      when { expression { return env.REGISTRY?.trim() } }
      steps {
        sh '''
        echo $REGISTRY_PASS | docker login $REGISTRY -u $REGISTRY_USER --password-stdin
        docker push $REGISTRY/mern-backend:$IMAGE_TAG
        docker push $REGISTRY/mern-frontend:$IMAGE_TAG
        '''
      }
    }

    stage('Deploy') {
      steps {
        echo 'Choose one of the cloud deploy steps in the next section and paste here.'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
    }
  }
}