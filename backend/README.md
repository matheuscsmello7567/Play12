# Play12 - Backend API

> Backend da plataforma Play12 Milsim Manager.

## Status

Em desenvolvimento. Esta pasta é reservada para o backend da aplicação.

## Stack Planejada

- **Runtime:** Node.js / Java / Python (a definir)
- **Framework:** Express / Spring Boot / FastAPI (a definir)
- **Banco de Dados:** PostgreSQL (schema disponível em `docs/database_init.sql`)
- **Autenticação:** JWT

## Estrutura Futura

```
backend/
├── src/
│   ├── controllers/    # Rotas e handlers
│   ├── services/       # Lógica de negócio
│   ├── models/         # Modelos do banco de dados
│   ├── middlewares/     # Auth, validação, etc.
│   ├── config/         # Configurações (DB, env)
│   └── utils/          # Utilitários
├── docs/
│   └── database_init.sql
├── package.json
└── README.md
```

## Banco de Dados

O schema do banco de dados PostgreSQL já está definido em [docs/database_init.sql](docs/database_init.sql).

### Tabelas principais:
- `operators` - Jogadores/Operadores
- `squads` - Times/Equipes
- `squad_members` - Membros dos times
- `games` - Eventos/Jogos
- `game_squads` - Times participando de jogos
- `rankings` - Ranking dos times
