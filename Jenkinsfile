pipeline {
  agent any

  environment {
    // As credenciais devem ser definidas no Jenkins e vinculadas aqui
    EMAIL_USER = credentials('EMAIL_USER')
    EMAIL_PASS = credentials('EMAIL_PASS')
    JWT_SECRET = credentials('JWT_SECRET')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy Homolog') {
      when {
        branch 'homolog'
      }
      steps {
        dir('backend') {
          sh '''
            echo "EMAIL_USER=$EMAIL_USER" > .env.homolog
            echo "EMAIL_PASS=$EMAIL_PASS" >> .env.homolog
            echo "JWT_SECRET=$JWT_SECRET" >> .env.homolog
          '''
        }

        sh '''
          if docker ps --format '{{.Names}}' | grep -q "^homolog"; then
            echo "🛑 Stack homolog já está ativa, reiniciando..."
            docker compose -f docker-compose.homolog.yml -p homolog down
          fi

          echo "🔧 Subindo containers de homologação..."
          docker compose -f docker-compose.homolog.yml -p homolog up -d --build
        '''

        sh '''
          echo "⏳ Aguardando backend responder..."
          curl --retry 10 --retry-delay 5 --fail http://backend-homolog:3001/login || (
            echo "❌ API não respondeu, derrubando containers..."
            docker compose -f docker-compose.homolog.yml -p homolog down
            exit 1
          )
        '''

        sh '''
          echo "🧪 Executando testes do backend..."
          docker exec backend-homolog npm test || (
            echo "❌ Testes do backend falharam, derrubando containers..."
            docker compose -f docker-compose.homolog.yml -p homolog down
            exit 1
          )
        '''

        sh '''
          echo "🧪 Executando testes do frontend..."
          docker exec frontend-homolog npx vitest run || (
            echo "❌ Testes do frontend falharam, derrubando containers..."
            docker compose -f docker-compose.homolog.yml -p homolog down
            exit 1
          )
        '''

        echo "✅ Homologação concluída com sucesso!"
      }
    }

    stage('Deploy Produção') {
      when {
        branch 'main'
      }
      steps {
        dir('backend') {
          sh '''
            echo "EMAIL_USER=$EMAIL_USER" > .env.prod
            echo "EMAIL_PASS=$EMAIL_PASS" >> .env.prod
            echo "JWT_SECRET=$JWT_SECRET" >> .env.prod
          '''
        }

        sh '''
          docker compose -f docker-compose.prod.yml -p prod up -d --build

          echo "⏳ Aguardando backend responder..."
          curl --retry 10 --retry-delay 5 --fail http://backend-prod:3002/login || (
            echo "❌ API não respondeu, derrubando containers..."
            docker compose -f docker-compose.prod.yml -p prod down
            exit 1
          )
        '''

        echo "🚀 Produção implantada com sucesso!"
      }
    }
  }
}
