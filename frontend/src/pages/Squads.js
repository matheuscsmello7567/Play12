import React, { useEffect, useState } from 'react';
import './Squads.css';
import { apiFetch } from '../services/api';

export default function Squads() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/squads')
      .then((data) => setSquads(data))
      .catch((err) => {
        setSquads([]);
        setError(err.message || 'Erro ao carregar squads');
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="squads-page">
      <h1 className="squads-title">Squads</h1>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
        <button className="hero-btn nav-login">Criar Squad</button>
      </div>
      {error && <div className="squads-error">{error === 'Servidor offline' ? 'Servidor offline. Tente novamente mais tarde.' : error}</div>}
      {loading && <div className="squads-loading">Carregando squads...</div>}
      <div className="squads-table">
        <div className="squads-row squads-header">
          <div>Nome</div>
          <div>Qtd. Operadores</div>
          <div>Jogos jogados</div>
          <div>Pontuação total</div>
        </div>
        {squads.map((squad, idx) => (
          <div className="squads-row" key={idx}>
            <div className="squad-name">{squad.nome}</div>
            <div>{squad.qtdOperadores}</div>
            <div>{squad.jogosJogados}</div>
            <div className="squad-points">{squad.pontuacaoTotal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
