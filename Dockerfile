# ----- FASE 1: BUILD DO FRONTEND REACT -----
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copia todo o código do frontend
COPY frontend ./frontend

# Constrói a aplicação React (gera os arquivos estáticos)
RUN cd frontend && npm run build


# ----- FASE 2: BUILD DO BACKEND SPRING BOOT E SERVIÇO -----
FROM openjdk:17-jdk-slim AS backend-builder

WORKDIR /app

# Copia o arquivo Maven (pom.xml) para otimizar o cache do Docker
COPY pom.xml .

# Copia o wrapper Maven
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Baixa as dependências do Maven (apenas uma vez se o pom.xml não mudar)
RUN ./mvnw dependency:go-offline -B

# Copia o restante do código do backend
COPY src ./src

# Copia os arquivos estáticos do frontend construídos na Fase 1 para a pasta de recursos do Spring Boot
# Por padrão, Spring Boot serve conteúdo estático de src/main/resources/static
COPY --from=frontend-builder /app/frontend/build src/main/resources/static

# Constrói a aplicação Spring Boot
RUN ./mvnw clean install -DskipTests


# ----- FASE 3: CRIAÇÃO DA IMAGEM FINAL OTIMIZADA -----
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copia o JAR construído da fase anterior
COPY --from=backend-builder /app/target/*.jar app.jar

# Expõe a porta que o Spring Boot usa
EXPOSE 8080

# Comando para rodar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]