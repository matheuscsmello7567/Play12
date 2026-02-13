# Preparativos para Integração com Banco de Dados

## Resumo do que foi implementado

A estrutura do frontend foi completamente preparada para integração com um banco de dados real. Todos os dados estão configurados em camadas, permitindo fácil migração de dados mock para dados reais.

## Arquivos Criados/Modificados

### 1. **`src/services/api.ts`** (NOVO)
- Gerencia todas as requisições HTTP para o backend
- Funções genéricas: `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
- Constantes de endpoints organizados em `API_ENDPOINTS`
- Suporta variáveis de ambiente via `VITE_API_BASE_URL`

### 2. **`src/services/data.ts`** (MODIFICADO)
- Separou dados mock em variáveis privadas (`mockTimes`, `mockOperadores`, `mockEventos`)
- Mantém exportações estáticas para compatibilidade com código existente
- Adicionou funções assíncronas com fallback automático:
  - `fetchTimes()`, `fetchTimeById()`
  - `fetchOperadores()`, `fetchOperadorById()`, `fetchOperadoresByTime()`
  - `fetchEventos()`, `fetchEventoById()`
  - `fetchRanking()`

### 3. **`frontend/.env.example`** (NOVO)
- Template de configuração de variáveis de ambiente
- Define `VITE_API_BASE_URL` para desenvolvimento/produção

### 4. **`frontend/.gitignore`** (NOVO)
- Inclui `.env` para evitar commit de variáveis sensíveis
- Padrão gitignore completo para projetos Node.js

### 5. **`frontend/DATABASE_INTEGRATION.md`** (NOVO)
- Guia detalhado de integração com banco de dados
- Especifica endpoints necessários no backend
- Formato de resposta esperado da API
- Checklist para integração

### 6. **`frontend/BACKEND_EXAMPLE.md`** (NOVO)
- Exemplos de implementação em Java/Spring Boot
- Exemplos de implementação em Node.js/Express
- Estrutura de DTOs esperados
- Classes de resposta padrão

### 7. **`frontend/USAGE_EXAMPLES.md`** (NOVO)
- Exemplos práticos de como usar as novas funções
- Padrões de componentes com API
- Hooks customizados para fetching
- Estratégias de caching com SWR/React Query

## Como Funciona

### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│      Componentes React               │
│   (Home, Eventos, Times, etc)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Serviço de Dados (data.ts)         │
│  - fetchEventos()                    │
│  - fetchOperadores()                 │
│  - fetchTimes()                      │
│  - fetchRanking()                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Camada de API (api.ts)             │
│  - apiGet()                          │
│  - apiPost()                         │
│  - apiPut()                          │
│  - apiDelete()                       │
└──────────────┬──────────────────────┘
               │
            ┌──┴──┐
            │     │
    ┌───────▼──┐  └─────────────────┐
    │   API    │                    │ (Fallback)
    │ Backend  │  Dados Mock        │
    │ (Com DB) │                    │
    └──────────┘  ┌────────────────┘
```

### Fluxo de Dados

1. **Componente solicita dados**: `await fetchEventos()`
2. **data.ts chama API**: `apiGet('/eventos')`
3. **api.ts faz requisição HTTP**: `fetch(API_BASE_URL + '/eventos')`
4. **Resultado**:
   - ✅ Se API responder: retorna dados reais do banco
   - ❌ Se API falhar: retorna dados mock automaticamente

## Próximas Etapas

### Para o Backend

1. Implementar endpoints REST nos padrões especificados
2. Banco de dados com as tabelas apropriadas
3. Serialização de dados nos formatos esperados
4. CORS habilitado para o frontend

### Para o Frontend

1. Copiar `.env.example` para `.env` e configurar URL
2. Gradualmente atualizar componentes para usar `fetch*` functions
3. Implementar estados de carregamento
4. Adicionar tratamento de erros
5. Testar com dados reais

## Configuração Rápida

```bash
# 1. Copiar arquivo de ambiente
cp frontend/.env.example frontend/.env

# 2. Editar .env com a URL do backend
VITE_API_BASE_URL=http://seu-backend.com/api

# 3. Implementar endpoints no backend (ver BACKEND_EXAMPLE.md)

# 4. Atualizar componentes (ver USAGE_EXAMPLES.md)

# 5. Testar!
```

## Benefícios da Arquitetura

✅ **Separação de responsabilidades**: API isolada em `api.ts`
✅ **Fácil manutenção**: Endpoints centralizados
✅ **Sem quebra de código**: Dados mock funcionam sem backend
✅ **Migração suave**: Transição gradual para dados reais
✅ **Tipo-seguro**: Tipos TypeScript para todas as operações
✅ **Escalável**: Fácil adicionar novos endpoints e dados

## Documentação de Referência

- 📖 [DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md) - Guia completo de integração
- 💻 [BACKEND_EXAMPLE.md](./BACKEND_EXAMPLE.md) - Exemplos de implementação backend
- 🎯 [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - Exemplos de uso nos componentes

## Status Atual

| Item | Status | Notas |
|------|--------|-------|
| Dados Mock | ✅ Implementado | Em uso atualmente |
| Camada API | ✅ Implementado | Pronto para produção |
| Funções Async | ✅ Implementado | Com fallback |
| Configuração .env | ✅ Implementado | Exemplo + .gitignore |
| Documentação | ✅ Completa | 3 arquivos de guia |
| Componentes Atualizados | ⏳ Pendente | Use como referência em USAGE_EXAMPLES.md |
| Backend Implementado | ⏳ Pendente | Siga BACKEND_EXAMPLE.md |

---

**Nota**: O sistema está 100% funcional com dados mock. Quando o backend estiver pronto, basta configurar a URL em `.env` e atualizar os componentes conforme os exemplos fornecidos.
