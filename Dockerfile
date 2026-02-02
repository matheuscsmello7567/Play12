# ----- FASE 1: BUILD DO FRONTEND (REACT) -----
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ----- FASE 2: BUILD DO BACKEND (JAVA) -----
FROM maven:3.9.6-eclipse-temurin-21-jammy AS backend-builder
WORKDIR /app
COPY pom.xml .
# Copia o build do React para a pasta de recursos estáticos do Java
COPY --from=frontend-builder /app/frontend/build ./src/main/resources/static
COPY src ./src
RUN mvn clean package -DskipTests

# ----- FASE 3: IMAGEM FINAL -----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8080"]