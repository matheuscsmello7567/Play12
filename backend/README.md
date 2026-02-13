# Play12 — Backend API

> Backend da plataforma Play12 Milsim Manager.
> **NestJS** + **Prisma** + **PostgreSQL** + **Docker**

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS (Node.js) |
| Linguagem | TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 |
| Auth | JWT + Passport |
| Validação | class-validator + Zod |
| Segurança | Helmet + Throttler (rate limit) |
| Docs | Swagger / OpenAPI |
| Pagamentos | Asaas (preparado) |
| Infra | Docker + Docker Compose |

## Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Subir banco de dados (Docker)
```bash
npm run docker:db
```

### 3. Rodar migrações do Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Popular banco com dados de exemplo
```bash
npm run prisma:seed
```

### 5. Iniciar em desenvolvimento
```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3333`
Swagger docs: `http://localhost:3333/api/docs`

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Modo desenvolvimento (hot-reload) |
| `npm run build` | Build para produção |
| `npm run start:prod` | Rodar build de produção |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:migrate` | Rodar migrações |
| `npm run prisma:studio` | Interface visual do banco |
| `npm run prisma:seed` | Popular banco com dados |
| `npm run docker:up` | Subir tudo (DB + API) |
| `npm run docker:db` | Subir só o PostgreSQL |

## Endpoints Principais

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/v1/auth/register` | Registrar operador | - |
| POST | `/api/v1/auth/login` | Login | - |
| GET | `/api/v1/operators` | Listar operadores | - |
| GET | `/api/v1/operators/search?q=` | Buscar por codinome | - |
| GET | `/api/v1/operators/:id` | Perfil do operador | - |
| GET | `/api/v1/squads` | Listar unidades | - |
| POST | `/api/v1/squads` | Criar unidade | JWT |
| POST | `/api/v1/squads/:id/members` | Adicionar membro | JWT |
| GET | `/api/v1/games` | Listar eventos | - |
| POST | `/api/v1/games` | Criar evento | JWT (Org) |
| POST | `/api/v1/games/:id/register/:squadId` | Inscrever squad | JWT |
| GET | `/api/v1/rankings` | Ranking completo | - |
| POST | `/api/v1/payments` | Criar pagamento | JWT |
| POST | `/api/v1/payments/webhook` | Webhook Asaas | - |
| GET | `/api/v1/health` | Health check | - |

## Segurança

- **Helmet**: Headers HTTP de segurança
- **CORS**: Configurável por variável de ambiente
- **Rate Limiting**: 100 req/min por IP
- **JWT**: Tokens com expiração configurável
- **bcrypt**: Hash de senhas (12 salt rounds)
- **Validation**: Input sanitization via class-validator
- **Zod**: Schema validation dupla disponível
- **Roles**: PLAYER, SQUAD_LEADER, ORGANIZER, ADMIN

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/play12_dev"
JWT_SECRET="sua_chave_secreta_muito_longa"
JWT_EXPIRATION="7d"
PORT=3333
CORS_ORIGINS=http://localhost:3000
ASAAS_API_KEY=""
ASAAS_BASE_URL="https://sandbox.asaas.com/api/v3"
```

## Estrutura

```
backend/
├── src/
│   ├── main.ts                  # Bootstrap + configs globais
│   ├── app.module.ts            # Módulo raiz
│   ├── prisma/                  # Prisma Service (global)
│   ├── auth/                    # JWT, login, registro, guards
│   ├── operators/               # CRUD de operadores
│   ├── squads/                  # CRUD de unidades
│   ├── games/                   # CRUD de eventos
│   ├── rankings/                # Ranking de squads
│   ├── payments/                # Pagamentos (Asaas)
│   ├── health/                  # Health check
│   └── common/decorators/       # @Roles, @CurrentUser
├── prisma/
│   ├── schema.prisma            # Schema do banco
│   └── seed.ts                  # Dados de exemplo
├── docker-compose.yml
├── Dockerfile
└── .env.example
```
