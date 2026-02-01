# ----- FASE 1: BUILD DO BACKEND (JAVA 21) -----
# Usamos uma imagem que já contém o Maven instalado para não depender do mvnw
FROM maven:3.9.6-eclipse-temurin-21-jammy AS backend-builder
WORKDIR /app

# Copia apenas o pom.xml para baixar dependências e ganhar velocidade no cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código fonte e gera o arquivo JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ----- FASE 2: IMAGEM FINAL -----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8080"]