<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PLAY12 MILSIM MANAGER

Plataforma de gerenciamento para jogadores, squads e eventos de airsoft.

## Estrutura do Projeto

```
Play12/
├── frontend/          # Aplicação React (Vite + TypeScript)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       ├── types.ts
│       ├── components/
│       ├── pages/
│       └── services/
│
├── backend/           # API Backend (a ser implementado)
│   ├── README.md
│   ├── docs/
│   │   └── database_init.sql
│   └── src/
│
└── README.md
```

## Frontend

### Pré-requisitos
- Node.js 18+

### Rodar localmente

```bash
cd frontend
npm install
npm run dev
```

O app estará disponível em `http://localhost:3000`.

## Backend

O backend será implementado futuramente. O schema do banco de dados PostgreSQL já está definido em `backend/docs/database_init.sql`.
