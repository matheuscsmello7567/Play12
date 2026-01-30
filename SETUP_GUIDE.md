# Guia de Setup e Execução - Play12 MilSim Manager

## 🎯 Objetivo
Este guia fornece instruções passo a passo para compilar, configurar e executar o projeto Play12 MilSim Manager em ambiente de desenvolvimento.

---

## 📋 Pré-Requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatório
- **Java Development Kit (JDK) 21**
  - [Download OpenJDK 21](https://jdk.java.net/21/)
  - Ou use: `choco install openjdk21` (Windows com Chocolatey)
  - Verifique: `java -version`

- **Maven 3.8.1 ou superior**
  - [Download Maven](https://maven.apache.org/download.cgi)
  - Ou use: `choco install maven` (Windows com Chocolatey)
  - Verifique: `mvn -v`

- **PostgreSQL 13 ou superior**
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - Ou use: `choco install postgresql` (Windows com Chocolatey)
  - Verifique: `psql --version`

- **Git**
  - [Download Git](https://git-scm.com/download/win)
  - Ou use: `choco install git` (Windows com Chocolatey)
  - Verifique: `git --version`

### Ferramentas Recomendadas (Opcional)
- **IDE**: IntelliJ IDEA Community, VS Code com extensions Java
- **API Testing**: Postman, Insomnia, Thunder Client
- **Database GUI**: DBeaver, pgAdmin
- **Terminal**: PowerShell (Windows), Git Bash, ou cmder

---

## 🔧 Passo 1: Configurar Banco de Dados

### Windows (PowerShell como Administrador)

```powershell
# Iniciar o serviço PostgreSQL
Start-Service postgresql-x64-15

# Abrir psql
psql -U postgres

# Executar comandos SQL
```

### macOS/Linux

```bash
# Iniciar PostgreSQL
brew services start postgresql

# Ou
sudo systemctl start postgresql

# Conectar
psql postgres
```

### Executar Script SQL

```sql
-- Copie e execute o conteúdo do arquivo: docs/database_init.sql

-- OU manualmente:

-- Criar databases
CREATE DATABASE play12_dev;
CREATE DATABASE play12_test;

-- Conectar à database dev
\c play12_dev

-- O Hibernate criará as tabelas automaticamente ao iniciar
```

**Nota**: Se você preferir criar as tabelas manualmente, execute o script `docs/database_init.sql`.

---

## 🔐 Passo 2: Configurar Variáveis de Ambiente

### Opção A: Arquivo `.env` (Recomendado)

```bash
# Navegue até o diretório do projeto
cd c:\Zion\Projects\Projeto_Play12

# Copie o arquivo de exemplo
copy .env.example .env

# Edite o arquivo .env com seus dados
notepad .env
```

**Conteúdo do `.env`** (mínimo necessário):
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/play12_dev
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=sua_chave_secreta_min_256_bits_aqui_xxxxxxxxxxxxxx
```

### Opção B: Arquivo `application-dev.properties`

Edite `src/main/resources/application-dev.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/play12_dev
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=create-drop
jwt.secret=sua_chave_secreta_min_256_bits
```

---

## 🚀 Passo 3: Compilar o Projeto

### Via Terminal/PowerShell

```bash
# Navegue ao diretório do projeto
cd c:\Zion\Projects\Projeto_Play12

# Limpe builds anteriores
mvn clean

# Compile o projeto
mvn compile

# Se tudo correr bem, você verá:
# [INFO] BUILD SUCCESS
```

### Via IDE (IntelliJ IDEA)
1. Abra o projeto
2. `View` → `Tool Windows` → `Maven`
3. Clique em `play12-milsim` → `Lifecycle` → `clean`
4. Clique em `play12-milsim` → `Lifecycle` → `compile`

---

## 📦 Passo 4: Resolver Dependências (Se Necessário)

```bash
# Download todas as dependências
mvn dependency:resolve

# Veja árvore de dependências
mvn dependency:tree

# Limpe cache se houver problemas
rmdir /s /q %USERPROFILE%\.m2\repository
mvn clean install
```

---

## ⚡ Passo 5: Executar a Aplicação

### Opção A: Maven Command Line (Recomendado)

```bash
cd c:\Zion\Projects\Projeto_Play12

# Execute com profile dev
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# OU simplesmente (se spring.profiles.active=dev está em application-dev.properties)
mvn spring-boot:run

# Você deve ver algo como:
# [INFO] Starting Play12Application
# [INFO] Started Play12Application in 4.2 seconds (JVM running for 5.1)
```

### Opção B: Executar JAR Compilado

```bash
# Primeiro, crie o JAR
mvn clean package

# Depois execute
java -jar target/play12-milsim-1.0.0.jar
```

### Opção C: Via IDE (IntelliJ IDEA)
1. Clique com botão direito em `Play12Application.java`
2. Selecione `Run 'Play12Application'`
3. Ou use: `Shift + F10`

---

## ✅ Passo 6: Verificar se Está Funcionando

### Verifique os Logs

A aplicação deve imprimir algo como:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/

[INFO] Starting Play12Application v1.0.0 on YOUR-COMPUTER with PID ...
[INFO] Started Play12Application in X.XXX seconds (JVM running for X.XXX)
```

### Teste os Endpoints

**1. Acessar Swagger UI (Documentação Interativa)**
```
http://localhost:8080/api/swagger-ui.html
```

**2. Testar com cURL**

Registrar operador:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "operador_teste",
    "email": "teste@example.com",
    "password": "senha123",
    "fullName": "Operador Teste",
    "phone": "11999999999"
  }'
```

Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

Usar Token:
```bash
# Copie o token retornado acima
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:8080/api/auth/verify
```

**3. Testar com Postman/Insomnia**
- Importe a coleção do Swagger: `http://localhost:8080/api/v3/api-docs`
- Ou crie manualmente os endpoints

---

## 🐛 Troubleshooting

### Erro: "Could not connect to database"

**Solução**:
```bash
# 1. Verifique se PostgreSQL está rodando
sc query postgresql-x64-15

# 2. Verifique a conexão
psql -U postgres -h localhost

# 3. Verifique as credenciais em application-dev.properties

# 4. Crie o database se não existir
psql -U postgres -c "CREATE DATABASE play12_dev;"
```

### Erro: "Invalid JWT secret"

**Solução**:
- Gere uma chave de 256+ bits
- Online: https://www.random.org/strings/ (256 bits de hex)
- Ou em Java:
```java
import javax.crypto.KeyGenerator;
import java.util.Base64;

KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA512");
keyGen.init(512);
String secret = Base64.getEncoder().encodeToString(keyGen.generateKey().getEncoded());
System.out.println(secret);
```

### Erro: "Java version not compatible"

**Solução**:
```bash
# Verifique sua versão
java -version

# Instale Java 21
choco install openjdk21

# Configure JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-21"

# Reinicie seu terminal
```

### Erro: "Port 8080 already in use"

**Solução**:
```bash
# Encontre o processo usando a porta
netstat -ano | findstr :8080

# Mate o processo
taskkill /PID <PID> /F

# Ou mude a porta em application-dev.properties
server.port=8081
```

### Compilação lenta

**Solução**:
```bash
# Configure Maven para usar mais memória
set MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=512m

# Ou em PowerShell
$env:MAVEN_OPTS = "-Xmx1024m"

# Use -o para modo offline
mvn clean install -o
```

---

## 📊 Verificação da Estrutura

Após compilar com sucesso, você deve ter:

```
target/
├── classes/               # Classes compiladas
├── play12-milsim-1.0.0.jar
├── play12-milsim-1.0.0.jar.original
└── ... (outras pastas de build)

src/main/java/com/play12/
├── Play12Application.class
├── auth/
│   ├── controller/
│   ├── service/
│   ├── entity/
│   ├── repository/
│   └── dto/
├── squad/
├── game/
├── ranking/
├── payment/
├── image/
├── admin/
└── core/
    ├── config/
    ├── security/
    ├── exception/
    └── entity/
```

---

## 🎓 Próximos Passos

Após confirmar que a aplicação está rodando:

1. **Explore a API**
   - Acesse `http://localhost:8080/api/swagger-ui.html`
   - Teste os endpoints de autenticação

2. **Crie dados de teste**
   - Registre alguns operadores
   - Crie alguns squads
   - Teste os rankings

3. **Comece a implementar Fase 2**
   - GameService completo
   - Endpoints de jogo
   - Lógica de ranking

4. **Setup frontend**
   - Instale Node.js e npm
   - Crie projeto React
   - Integre com API

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Maven Docs](https://maven.apache.org/guides/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Comunidades
- Stack Overflow: Tag `spring-boot`
- Spring Community: https://spring.io/community
- r/java (Reddit)

### IDEs Recomendadas
- IntelliJ IDEA Community (Melhor para Spring Boot)
- VS Code + Extension Pack for Java
- Eclipse IDE

---

## 💡 Dicas Finais

1. **Use Profiles**: Mantenha configurações separadas (dev, test, prod)
2. **Logs**: Acompanhe os logs para debugar problemas
3. **Testes**: Execute `mvn test` regularmente
4. **Versionamento**: Faça commits frequentes
5. **Documentação**: Atualize conforme implementa features

---

**✅ Pronto para começar!**

Se tiver dúvidas ou problemas, consulte:
- `README.md` - Overview do projeto
- `PLANNING.md` - Roadmap detalhado
- `docs/database_init.sql` - Schema do banco de dados

Boa sorte com o desenvolvimento! 🚀
