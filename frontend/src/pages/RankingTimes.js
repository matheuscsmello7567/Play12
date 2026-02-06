import React, { useEffect, useState } from 'react';
import './RankingTimes.css';
import { apiFetch } from '../services/api';

export default function RankingTimes() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/squads')
      .then((data) => {
        // Ordenar por pontuacao total (descendente)
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        const sorted = dataArray.sort((a, b) => (b.pontuacaoTotal || 0) - (a.pontuacaoTotal || 0));
        setSquads(sorted);
      })
      .catch((err) => {
        setSquads([]);
        setError(err.message || 'Erro ao carregar ranking');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1>RANKING DE TIMES</h1>
        <p>Confira a classificação dos times</p>
      </div>

      {error && <div className="ranking-error">{error === 'Servidor offline' ? 'Servidor offline.' : error}</div>}
      {loading && <div className="ranking-loading">Carregando ranking...</div>}

      <div className="ranking-container">
        <div className="ranking-table">
          <div className="ranking-row ranking-header">
            <div className="rank-position">Posição</div>
            <div className="rank-name">Time</div>
            <div className="rank-stat">Operadores</div>
            <div className="rank-stat">Jogos</div>
            <div className="rank-points">Pontos</div>
          </div>
          {squads.length === 0 ? (
            <div className="ranking-empty">
              <p>Nenhum time cadastrado</p>
            </div>
          ) : (
            squads.map((squad, idx) => (
              <div className="ranking-row" key={squad.id}>
                <div className="rank-position">
                  <span className="medal">{idx + 1}</span>
                </div>
                <div className="rank-name"><strong>{squad.nome}</strong></div>
                <div className="rank-stat">{squad.qtdOperadores || 0}</div>
                <div className="rank-stat">{squad.jogosJogados || 0}</div>
                <div className="rank-points">{squad.pontuacaoTotal || 0}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
