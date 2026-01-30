#!/bin/bash
# Quick Start Script - Play12 MilSim Manager
# Execute este script para configurar e rodar a aplicação

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         PLAY12 MILSIM MANAGER - QUICK START                   ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Verificar pré-requisitos
echo "📋 Checando pré-requisitos..."
echo ""

# Java 21
echo -n "  ✓ Java 21: "
java -version 2>&1 | head -1 | grep -q "21" && echo "✅" || echo "❌ Instale Java 21"

# Maven
echo -n "  ✓ Maven: "
mvn -v 2>&1 | head -1 | grep -q "Apache Maven" && echo "✅" || echo "❌ Instale Maven"

# PostgreSQL
echo -n "  ✓ PostgreSQL: "
psql --version 2>&1 | grep -q "psql" && echo "✅" || echo "❌ Instale PostgreSQL"

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""

# 2. Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    echo "   Criando .env a partir de .env.example..."
    cp .env.example .env
    echo "   ⚠️  Edite .env com suas credenciais!"
else
    echo "   ✅ .env já existe"
fi

echo ""

# 3. Criar database PostgreSQL
echo "🗄️  Criando banco de dados..."
read -p "   Deseja criar o database play12_dev? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    psql -U postgres -c "CREATE DATABASE play12_dev;" 2>/dev/null && echo "   ✅ Database criado" || echo "   ℹ️  Database já pode existir"
fi

echo ""

# 4. Compilar projeto
echo "🔨 Compilando projeto..."
mvn clean compile -q && echo "   ✅ Compilação bem-sucedida" || (echo "   ❌ Erro na compilação" && exit 1)

echo ""

# 5. Executar aplicação
echo "🚀 Iniciando aplicação..."
echo ""
echo "   ℹ️  A aplicação estará disponível em:"
echo "      • API Root: http://localhost:8080/api"
echo "      • Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo ""

mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
