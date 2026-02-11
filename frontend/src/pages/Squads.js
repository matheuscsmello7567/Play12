import React, { useEffect, useState } from 'react';
import './Squads.css';
import { apiFetch } from '../services/api';
import { mockSquads } from '../data/mockData';

export default function Squads() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/squads')
      .then((data) => {
        if (!data) {
          setSquads(mockSquads);
          setError('Usando dados locais (servidor indisponível)');
          return;
        }
        setSquads(data);
      })
      .catch((err) => {
        setSquads(mockSquads);
        setError('Usando dados locais (servidor indisponível)');
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="squads-page">
      <div className="squads-header-section">
        <h1>Squads</h1>
        <p>Conheça as esquadras do grupo</p>
      </div>
      <div className="squads-content">
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
        <button className="hero-btn">Criar Squad</button>
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
    </div>
  );
}
