pipeline {
  agent any

  environment {
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
          sh """
            echo "EMAIL_USER=$EMAIL_USER" > .env.homolog
            echo "EMAIL_PASS=$EMAIL_PASS" >> .env.homolog
            echo "JWT_SECRET=$JWT_SECRET" >> .env.homolog
			echo "EMAIL_USER=$EMAIL_USER" > .env.test
            echo "EMAIL_PASS=$EMAIL_PASS" >> .env.test
            echo "JWT_SECRET=$JWT_SECRET" >> .env.test
          """
        }

        sh """
          if docker ps --format '{{.Names}}' | grep -q "^homolog"; then
            echo "🛑 Stack homolog já está ativa, reiniciando..."
            docker compose -f docker-compose.homolog.yml -p homolog down
          fi

          echo "🔧 Subindo containers de homologação..."
          docker compose -f docker-compose.homolog.yml -p homolog up -d --build
        """

        sh """
          echo "🧪 Executando testes do backend..."
          docker exec -e NODE_ENV=test backend-homolog npm test || (
            echo "❌ Testes do backend falharam!"
            docker logs backend-homolog || true
            docker compose -f docker-compose.homolog.yml -p homolog down
            exit 1
          )
        """

        sh """
  			echo "🧪 Executando testes do frontend..."
  			docker compose -f docker-compose.homolog.yml -p homolog run --rm frontend-test || (
    		echo "❌ Testes do frontend falharam!"
    		exit 1
  			)
		"""


        echo "✅ Homologação concluída com sucesso!"
      }
    }

    stage('Deploy Produção') {
      when {
        branch 'main'
      }
      steps {
        dir('backend') {
          sh """
            echo "EMAIL_USER=$EMAIL_USER" > .env.prod
            echo "EMAIL_PASS=$EMAIL_PASS" >> .env.prod
            echo "JWT_SECRET=$JWT_SECRET" >> .env.prod
          """
        }

        sh """
          if docker ps --format '{{.Names}}' | grep -q "^prod"; then
            docker compose -f docker-compose.prod.yml -p prod down
          fi

          echo "🚀 Subindo containers de produção..."
          docker compose -f docker-compose.prod.yml -p prod up -d --build
        """

        echo "🚀 Produção implantada com sucesso!"
      }
    }
  }
}
