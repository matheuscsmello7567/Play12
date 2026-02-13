# Exemplos de Uso - Integração com API

Este documento mostra como atualizar os componentes para usar as novas funções assíncronas.

## Exemplo 1: Componente com useEffect

### Antes (Dados Mock Estáticos)
```typescript
import React from 'react';
import { eventos } from '../services/data';

const Eventos: React.FC = () => {
  return (
    <div>
      {eventos.map(evt => (
        <div key={evt.id}>{evt.nome}</div>
      ))}
    </div>
  );
};

export default Eventos;
```

### Depois (Com API)
```typescript
import React, { useState, useEffect } from 'react';
import { fetchEventos } from '../services/data';
import { Evento } from '../types';

const Eventos: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        setLoading(true);
        const data = await fetchEventos();
        setEventos(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar eventos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  if (loading) return <div>Carregando eventos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {eventos.map(evt => (
        <div key={evt.id}>{evt.nome}</div>
      ))}
    </div>
  );
};

export default Eventos;
```

## Exemplo 2: Componente com Hook Customizado

Para evitar repetição, crie um hook customizado:

```typescript
// src/hooks/useFetchEventos.ts
import { useState, useEffect } from 'react';
import { fetchEventos } from '../services/data';
import { Evento } from '../types';

interface UseFetchState {
  data: Evento[];
  loading: boolean;
  error: string | null;
}

export function useFetchEventos(): UseFetchState {
  const [data, setData] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventos = await fetchEventos();
        setData(eventos);
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}
```

Uso do hook:
```typescript
const Eventos: React.FC = () => {
  const { data: eventos, loading, error } = useFetchEventos();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {eventos.map(evt => (
        <div key={evt.id}>{evt.nome}</div>
      ))}
    </div>
  );
};
```

## Exemplo 3: Componente com Cache (SWR)

Para melhor performance, use SWR ou React Query:

```typescript
import useSWR from 'swr';
import { fetchEventos } from '../services/data';

const Eventos: React.FC = () => {
  const { data: eventos = [], isLoading, error } = useSWR(
    'eventos',
    fetchEventos
  );

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar</div>;

  return (
    <div>
      {eventos.map(evt => (
        <div key={evt.id}>{evt.nome}</div>
      ))}
    </div>
  );
};
```

## Exemplo 4: Detalhes de um Item Específico

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventoById } from '../services/data';
import { Evento } from '../types';

const EventoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventoById(id).then(data => {
        setEvento(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!evento) return <div>Evento não encontrado</div>;

  return (
    <div>
      <h1>{evento.nome}</h1>
      <p>{evento.intel}</p>
      <p>Data: {evento.data}</p>
      <p>Horário: {evento.horario}</p>
    </div>
  );
};

export default EventoDetalhes;
```

## Exemplo 5: Dados Relacionados (Operadores de um Time)

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOperadoresByTime } from '../services/data';
import { Operador } from '../types';

const TimeOperadores: React.FC = () => {
  const { timeId } = useParams<{ timeId: string }>();
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timeId) {
      fetchOperadoresByTime(timeId).then(data => {
        setOperadores(data);
        setLoading(false);
      });
    }
  }, [timeId]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Operadores</h2>
      {operadores.map(op => (
        <div key={op.id}>
          <strong>{op.apelido}</strong> - {op.patente}
          <p>{op.nome_completo}</p>
        </div>
      ))}
    </div>
  );
};

export default TimeOperadores;
```

## Exemplo 6: Ranking

```typescript
import { useEffect, useState } from 'react';
import { fetchRanking } from '../services/data';
import { RankingEntry } from '../types';

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking().then(data => {
      setRanking(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Posição</th>
          <th>Time</th>
          <th>Pontos</th>
          <th>Jogos</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map(entry => (
          <tr key={entry.time.id}>
            <td>{entry.posicao}</td>
            <td>{entry.time.nome}</td>
            <td>{entry.pontos}</td>
            <td>{entry.jogos_jogados}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Ranking;
```

## Migração Gradual

Para migrar gradualmente sem quebrar a aplicação:

1. **Fase 1**: Manter componentes com dados mock
2. **Fase 2**: Criar novos componentes com API
3. **Fase 3**: Atualizar componentes antigos um por um
4. **Fase 4**: Remover referências aos dados mock quando tudo está funcionando

---

Quando o banco de dados estiver pronto:
1. Configure a URL em `.env`
2. Implemente os endpoints no backend
3. Atualize os componentes como nos exemplos acima
4. Teste a integração
