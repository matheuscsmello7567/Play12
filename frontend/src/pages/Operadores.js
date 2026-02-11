import React, { useEffect, useState } from 'react';
import './Operadores.css';
import { apiFetch } from '../services/api';
import { mockOperadores } from '../data/mockData';

export default function Operadores() {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/operadores')
      .then((response) => {
        // Se API retornar null, usar dados mock
        if (!response) {
          setOperadores(mockOperadores);
          return;
        }
        const dataArray = response.data || response || [];
        setOperadores(Array.isArray(dataArray) ? dataArray : mockOperadores);
      })
      .catch((err) => {
        console.warn('Erro ao carregar operadores, usando dados locais:', err.message);
        setError('Usando dados locais (servidor indisponível)');
        setOperadores(mockOperadores);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOperadores = operadores.filter((op) => {
    const term = search.toLowerCase();
    return (
      op.nickname.toLowerCase().includes(term) ||
      op.nomeCompleto.toLowerCase().includes(term) ||
      (op.squadNome && op.squadNome.toLowerCase().includes(term))
    );
  });

  return (
    <div className="operadores-page">
      <div className="operadores-header">
        <h1>OPERADORES</h1>
        <p>Conheça os jogadores da comunidade</p>
      </div>

      <div className="operadores-container">
        <div className="operadores-search">
          <input
            type="text"
            placeholder="Buscar por apelido, nome ou time"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => setSearch('')}
            disabled={!search.trim()}
          >
            Limpar
          </button>
        </div>

        {error && <div className="operadores-error">{error === 'Servidor offline' ? 'Servidor offline.' : error}</div>}
        {loading && <div className="operadores-loading">Carregando operadores...</div>}

        <div className="operadores-table">
          <div className="operadores-row operadores-header">
            <div>Apelido</div>
            <div>Squad</div>
            <div>Jogos</div>
            <div>Pontos</div>
          </div>
          {filteredOperadores.length === 0 ? (
            <div className="operadores-empty">
              <p>Nenhum operador encontrado</p>
            </div>
          ) : (
            filteredOperadores.map((operador) => (
              <div className="operadores-row" key={operador.id}>
                <div className="operador-nickname"><strong>{operador.nickname}</strong></div>
                <div>{operador.squadNome || 'Sem squad'}</div>
                <div>{operador.totalJogos || 0}</div>
                <div className="operador-points">{operador.pontos || 0}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
