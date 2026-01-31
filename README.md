# Play12 MilSim Manager

Uma aplicação web robusta para organização e gerenciamento de eventos de airsoft estilo MilSim.

## 🎯 Visão Geral

O Play12 MilSim Manager é uma plataforma completa que resolve os principais desafios na organização de jogos de airsoft:

- **Gerenciamento de Operadores**: Cadastro, autenticação e perfil de jogadores
- **Gerenciamento de Squads**: Criação e administração de equipes
- **Calendário de Eventos**: Agendamento e listagem de jogos
- **Sistema de Ranking**: Rastreamento de desempenho das equipes
- **Painel Administrativo**: Controle total da plataforma
- **Suporte a Pagamentos**: Integração para registro de jogadores
- **Acervo de Imagens**: Galeria dos eventos

## 📋 Requisitos Funcionais

- ✅ Cadastro/Login de Operadores
- ✅ Acompanhamento de Engajamento
- ✅ Gerenciamento de Squads
- ✅ Página do Squad
- ✅ Ranking de Times
- ✅ Painel de Imagens
- ✅ Painel Administrativo
- ✅ Calendário de Jogos
- ✅ Pagamento Automatizado
- ✅ Aba de Regras
- ✅ Aba de Links

## 🛠️ Stack Técnico

### Backend
- **Java 21**
- **Spring Boot 3.3.0**
- **Spring Security + JWT**
- **JPA/Hibernate**
- **PostgreSQL**

### Dependências Principais
- Spring Data JPA
- Spring Security
- JWT (io.jsonwebtoken)
- Stripe API (Pagamentos)
- AWS S3 (Armazenamento de Imagens)
- Swagger/OpenAPI (Documentação)
- Lombok (Redução de Boilerplate)

## 📦 Estrutura do Projeto

```
src/main/java/com/play12/
├── auth/                 # Módulo de Autenticação
│   ├── entity/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── controller/
├── squad/                # Módulo de Squads
│   ├── entity/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── controller/
├── game/                 # Módulo de Jogos
│   ├── entity/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── controller/
├── ranking/              # Módulo de Ranking
│   ├── entity/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── controller/
├── payment/              # Módulo de Pagamentos
├── image/                # Módulo de Imagens
├── admin/                # Painel Administrativo
└── core/                 # Configurações e Utilitários
    ├── config/
    ├── security/
    ├── exception/
    └── entity/
```

## 🚀 Primeiros Passos

### Pré-requisitos
- Java 21 JDK
- Maven 3.8.1+
- PostgreSQL 13+
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/play12-milsim.git
cd play12-milsim
```

2. **Configure o banco de dados PostgreSQL**
```bash
createdb play12_dev
```

3. **Atualize as variáveis de ambiente**

Edite `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/play12_dev
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
jwt.secret=sua_chave_secreta_aqui_min_256_bits
```

4. **Construa o projeto**
```bash
mvn clean install
```

5. **Execute a aplicação**
```bash
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080/api`

## 📚 Documentação da API

A documentação interativa está disponível em:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api/v3/api-docs`

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

### Registro
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "operador1",
    "email": "operador@example.com",
    "password": "senha123",
    "fullName": "Nome do Operador",
    "phone": "11999999999"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@example.com",
    "password": "senha123"
  }'
```

### Usar Token
```bash
curl -H "Authorization: Bearer SEU_TOKEN_JWT" \
  http://localhost:8080/api/auth/verify
```

## 📝 Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar novo operador
- `POST /auth/login` - Login de operador
- `GET /auth/verify` - Verificar token válido

### Squads
- `GET /squads` - Listar todos os squads
- `GET /squads/{id}` - Obter detalhes do squad
- `POST /squads` - Criar novo squad
- `POST /squads/{squadId}/members/{memberId}` - Adicionar membro
- `DELETE /squads/{squadId}/members/{memberId}` - Remover membro

### Rankings
- `GET /rankings` - Listar ranking completo
- `GET /rankings/top/{limit}` - Top N squads
- `GET /rankings/squad/{squadId}` - Ranking de um squad

### Jogos
- *(A ser implementado)*

### Admin
- *(A ser implementado)*

## 🔧 Configuração

### Variáveis de Ambiente (Production)

```env
DATABASE_URL=jdbc:postgresql://host:5432/play12_db
DATABASE_USER=usuario
DATABASE_PASSWORD=senha
JWT_SECRET=sua_chave_secreta
JWT_EXPIRATION=86400000
STRIPE_API_KEY=sk_test_xxxxx
AWS_S3_BUCKET=play12-images
AWS_REGION=us-east-1
```

## 📦 Fases de Desenvolvimento

### Fase 1 (✅ Em Progresso)
- [x] Setup do projeto Spring Boot
- [x] Autenticação com JWT
- [x] Gerenciamento de Squads
- [ ] Frontend inicial (React)

### Fase 2 (⏳ Próxima)
- [ ] Calendário de Jogos
- [ ] Sistema de Ranking completo
- [ ] Painel de Imagens
- [ ] Aba de Regras e Links

### Fase 3 (⏳ Futura)
- [ ] Painel Administrativo
- [ ] Integração com Stripe
- [ ] Analytics de Engajamento
- [ ] Sistema de notificações

### Fase 4 (⏳ Futura)
- [ ] Deploy em produção
- [ ] CI/CD pipelines
- [ ] Monitoramento e logs

## 🧪 Testes

```bash
# Executar todos os testes
mvn test

# Executar com cobertura
mvn clean test jacoco:report
```

## 🐛 Troubleshooting

### Erro: "Could not connect to PostgreSQL"
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no `application.properties`
- Verifique o nome do banco de dados

### Erro: "Invalid JWT token"
- Verifique se a chave secreta está configurada corretamente
- Confirme que o token não expirou
- Certifique-se do formato "Bearer TOKEN"

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para contato@play12.com.br ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ para a comunidade de airsoft**
