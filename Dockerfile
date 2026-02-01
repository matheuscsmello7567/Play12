# Fase de build do Backend e Frontend
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copia arquivos do Maven e instala dependências
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Copia o código e gera o JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Fase final (Imagem leve de execução)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]