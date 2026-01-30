# 📚 Índice da Documentação - Play12 MilSim Manager

## 🏠 Começar Aqui

Para novos desenvolvedores, comece por esta ordem:

1. **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** (5 min)
   - Visão geral do projeto
   - Métricas e timeline
   - Status atual

2. **[README.md](./README.md)** (10 min)
   - Documentação principal
   - Stack técnico
   - Endpoints disponíveis

3. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** (30 min)
   - Pré-requisitos
   - Instalação passo a passo
   - Como compilar e rodar

4. **[PLANNING.md](./PLANNING.md)** (20 min)
   - Arquitetura da aplicação
   - Roadmap de 4 fases
   - Checklist de implementação

---

## 📖 Documentação Técnica

### Configuração e Setup
| Arquivo | Descrição | Tempo |
|---------|-----------|-------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Guia completo de instalação | 30 min |
| [.env.example](./.env.example) | Variáveis de ambiente | 5 min |
| [docs/database_init.sql](./docs/database_init.sql) | Script SQL de inicialização | - |
| [pom.xml](./pom.xml) | Dependências Maven | - |

### Planejamento e Roadmap
| Arquivo | Descrição | Tempo |
|---------|-----------|-------|
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Sumário executivo | 5 min |
| [PLANNING.md](./PLANNING.md) | Planejamento detalhado | 20 min |
| [README.md](./README.md) | Documentação geral | 10 min |

### Código Fonte
```
src/main/java/com/play12/
├── auth/                  # Autenticação
├── squad/                 # Gerenciamento de Squads
├── game/                  # Gerenciamento de Jogos
├── ranking/               # Sistema de Ranking
├── payment/               # Processamento de Pagamentos
├── image/                 # Gerenciamento de Imagens
├── admin/                 # Painel Administrativo
└── core/                  # Configurações e Utilitários
```

---

## 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/play12-milsim.git
cd play12-milsim

# 2. Configure o banco de dados
# Execute: docs/database_init.sql em PostgreSQL

# 3. Configure variáveis de ambiente
copy .env.example .env
# Edite .env com suas credenciais

# 4. Compile
mvn clean compile

# 5. Execute
mvn spring-boot:run

# 6. Acesse a API
# Swagger UI: http://localhost:8080/api/swagger-ui.html
# API Root: http://localhost:8080/api
```

---

## 📚 Guias por Tópico

### Para Desenvolvedores Backend
1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Instalar ambiente
2. [PLANNING.md](./PLANNING.md) - Entender arquitetura
3. Explorar `src/main/java/com/play12/` - Ver código
4. [README.md](./README.md) - Entender endpoints

### Para Arquitetos/Tech Leads
1. [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) - Visão geral
2. [PLANNING.md](./PLANNING.md) - Arquitetura detalhada
3. `pom.xml` - Dependências
4. [README.md](./README.md) - Design das APIs

### Para DevOps/Infra
1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Requisitos
2. [PLANNING.md](./PLANNING.md#fase-4---deploy) - Deploy
3. `.env.example` - Variáveis de produção
4. `docs/database_init.sql` - Schema do BD

### Para Managers/PMs
1. [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) - Status e timeline
2. [PLANNING.md](./PLANNING.md#-fases-de-desenvolvimento) - Fases
3. [README.md](./README.md) - Requisitos funcionais

---

## 🔑 Conceitos Principais

### Autenticação
- **JWT (JSON Web Token)**: Token-based authentication
- **BCrypt**: Hash seguro de senhas
- **Spring Security**: Framework de segurança
- **Roles**: PLAYER, SQUAD_LEADER, ORGANIZER, ADMIN

### Entidades Principais
```
Operator (Jogador)
├── nickname, email, password
├── role (PLAYER, SQUAD_LEADER, etc)
└── engagement_score

Squad (Equipe)
├── name, description, logo
├── leader (Operator)
├── members (Set<Operator>)
└── ranking stats

Game (Jogo)
├── name, startDate, endDate
├── location, maxPlayers
├── status, gameType
└── participatingSquads

Ranking
├── squad
├── position, totalPoints
├── gamesPlayed, gamesWon, winRate
└── totalEliminations
```

### Endpoints Principais

#### Auth
```
POST   /api/auth/register         # Registrar novo operador
POST   /api/auth/login            # Login
GET    /api/auth/verify           # Verificar token
```

#### Squads
```
GET    /api/squads                # Listar todos
GET    /api/squads/{id}           # Detalhes
POST   /api/squads                # Criar novo
POST   /api/squads/{id}/members   # Adicionar membro
DELETE /api/squads/{id}/members   # Remover membro
```

#### Rankings
```
GET    /api/rankings              # Ranking completo
GET    /api/rankings/top/{limit}  # Top N
GET    /api/rankings/squad/{id}   # Por squad
```

---

## 📋 Checklist de Desenvolvimento

### Setup Inicial
- [ ] Clone do repositório
- [ ] JDK 21 instalado
- [ ] Maven 3.8.1+ instalado
- [ ] PostgreSQL 13+ instalado
- [ ] Executar `docs/database_init.sql`
- [ ] Configurar `.env`
- [ ] `mvn clean compile` com sucesso
- [ ] `mvn spring-boot:run` funciona
- [ ] Acessar Swagger UI

### Antes de Começar Código
- [ ] Ler PLANNING.md (arquitetura)
- [ ] Explorar estrutura de pacotes
- [ ] Entender padrão MVC/Repository/Service
- [ ] Revisar AuthService como exemplo
- [ ] Configurar IDE com plugins Java

### Durante Desenvolvimento
- [ ] Seguir padrões do projeto
- [ ] Adicionar Javadoc em métodos públicos
- [ ] Fazer testes unitários
- [ ] Verificar coverage
- [ ] Commit messages em inglês
- [ ] Push para feature branch
- [ ] Criar Pull Request

### Antes de Deploy
- [ ] Todos testes passando
- [ ] SonarQube clean
- [ ] Documentação atualizada
- [ ] Performance testada
- [ ] Security review
- [ ] Database migrations testadas

---

## 🎯 Próximas Tarefas

### Hoje
```
1. Compilar projeto: mvn clean compile
2. Configurar PostgreSQL
3. Rodar aplicação: mvn spring-boot:run
4. Testar endpoints em http://localhost:8080/api/swagger-ui.html
5. Ler PLANNING.md
```

### Esta Semana
```
1. Implementar GameService completo
2. Criar GameController endpoints
3. Adicionar testes unitários
4. Documentar no Swagger
5. Code review
```

### Próximas 2 Semanas (Fase 2)
```
1. ImageService e upload
2. RulesService e LinksService
3. Setup React frontend
4. Frontend components
5. Integração frontend-backend
6. Deploy staging
```

---

## 🔗 Links Rápidos

### Documentação Oficial
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Maven](https://maven.apache.org/)

### Ferramentas Online
- [JWT.io](https://jwt.io) - Decode JWT tokens
- [Random.org](https://www.random.org/strings/) - Gerar strings
- [Base64 Encoder](https://www.base64encode.org/) - Encode/decode

### Comunidades
- [Stack Overflow](https://stackoverflow.com/questions/tagged/spring-boot)
- [Spring Community Forum](https://spring.io/community)
- [r/java](https://www.reddit.com/r/java/)

---

## ❓ FAQ

### P: Por onde começo?
**R**: Leia [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md), depois [SETUP_GUIDE.md](./SETUP_GUIDE.md).

### P: Como rodar localmente?
**R**: Veja [SETUP_GUIDE.md](./SETUP_GUIDE.md) - "Passo 5: Executar a Aplicação".

### P: Quais são os endpoints?
**R**: Veja [README.md](./README.md) - "Endpoints Principais", ou acesse Swagger em localhost:8080/api/swagger-ui.html.

### P: Como contribuir?
**R**: Veja [PLANNING.md](./PLANNING.md) - "Próximos Passos Imediatos".

### P: Qual é o roadmap?
**R**: Veja [PLANNING.md](./PLANNING.md) - "Fases de Desenvolvimento".

### P: Como fazer deploy?
**R**: Veja [PLANNING.md](./PLANNING.md#fase-4---deploy) e [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting).

---

## 📞 Suporte

- **Issues**: GitHub Issues
- **Discussões**: GitHub Discussions
- **Email**: contato@play12.com.br
- **Chat**: Discord (se tiver servidor)

---

## 📄 Versionamento de Documentação

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 27/01/2026 | Documentação inicial com Fase 1 completa |

---

**Última atualização**: 27 de Janeiro de 2026  
**Mantido por**: GitHub Copilot  
**Status**: ✅ Ativo e em desenvolvimento

---

## 🎓 Aprender Mais

### Sobre Spring Boot
- [Spring Boot in 100 Seconds](https://www.youtube.com/watch?v=aKYoHMNZCPM)
- [Spring Security Tutorial](https://www.baeldung.com/spring-security-tutorial)
- [JWT with Spring Boot](https://www.baeldung.com/spring-security-oauth-two-login)

### Sobre PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [SQL Performance](https://www.postgresql.org/docs/current/sql.html)

### Sobre RESTful APIs
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Obrigado por ler!** 🎉

Qualquer dúvida, consulte a documentação ou abra uma issue.

Boa sorte com o desenvolvimento! 🚀
