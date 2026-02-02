# ----- FASE 1: BUILD DO FRONTEND (REACT) -----
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
# Copia os arquivos de configuração do npm
COPY frontend/package*.json ./
RUN npm install
# Copia todo o conteúdo da sua pasta 'frontend'
COPY frontend/ ./
RUN npm run build

# ----- FASE 2: BUILD DO BACKEND (JAVA) -----
FROM maven:3.9.6-eclipse-temurin-21-jammy AS backend-builder
WORKDIR /app
COPY pom.xml .
# Cria a pasta static se não existir e copia o resultado do React para lá
RUN mkdir -p src/main/resources/static
COPY --from=frontend-builder /app/frontend/build ./src/main/resources/static
COPY src ./src
RUN mvn clean package -DskipTests

# ----- FASE 3: IMAGEM FINAL (JAVA 21) -----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copia o arquivo .jar gerado na fase anterior
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8080
# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8080"]