import React, { useEffect, useState } from 'react';
import './Times.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export default function Times() {
  const navigate = useNavigate();
  const [squads, setSquads] = useState([]);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [operadoresSquad, setOperadoresSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/squads')
      .then((data) => {
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        setSquads(dataArray);
      })
      .catch((err) => {
        setSquads([]);
        setError(err.message || 'Erro ao carregar times');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSquadClick = async (squad) => {
    setSelectedSquad(squad);
    try {
      const response = await apiFetch('/operadores');
      const oprs = response.data || response || [];
      const filtered = (Array.isArray(oprs) ? oprs : []).filter((op) => op.squadId === squad.id);
      setOperadoresSquad(filtered);
    } catch (err) {
      setOperadoresSquad([]);
    }
  };

  return (
    <div className="times-page">
      <div className="times-header">
        <h1>TIMES</h1>
        <p>Conheça os times da comunidade</p>
        <button className="hero-btn create-team-btn" onClick={() => navigate('/criar-time')}>+ Criar Time</button>
      </div>

      {error && <div className="times-error">{error === 'Servidor offline' ? 'Servidor offline.' : error}</div>}
      {loading && <div className="times-loading">Carregando times...</div>}

      <div className="times-container">
        {squads.length === 0 ? (
          <div className="times-empty">
            <p>Nenhum time cadastrado</p>
          </div>
        ) : (
          <div className="times-grid">
            {squads.map((squad) => (
              <div
                className="team-card"
                key={squad.id}
                onClick={() => handleSquadClick(squad)}
              >
                <div className="team-cover">
                  <div className="team-cover-badge">{squad.pontuacaoTotal || 0}</div>
                </div>
                <div className="team-info">
                  <h3>{squad.nome}</h3>
                  <p className="team-subtitle">{squad.qtdOperadores || 0} operadores</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSquad && (
        <div className="squad-profile-modal" onClick={() => setSelectedSquad(null)}>
          <div className="squad-profile" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedSquad(null)}>×</button>

            <div className="profile-header">
              <div className="profile-cover"></div>
              <div className="profile-info">
                <h2>{selectedSquad.nome}</h2>
                <p className="profile-stats">
                  <span><strong>{selectedSquad.qtdOperadores || 0}</strong> operadores</span>
                  <span><strong>{selectedSquad.jogosJogados || 0}</strong> jogos</span>
                  <span><strong>{selectedSquad.pontuacaoTotal || 0}</strong> pontos</span>
                </p>
              </div>
            </div>

            <div className="profile-description">
              <h3>Descrição do Time</h3>
              <p>{selectedSquad.descricao || 'Sem descrição'}</p>
            </div>

            <div className="profile-members">
              <h3>Operadores do Time</h3>
              {operadoresSquad.length === 0 ? (
                <p className="no-members">Nenhum operador neste time</p>
              ) : (
                <div className="members-list">
                  {operadoresSquad.map((op) => (
                    <div className="member-card" key={op.id}>
                      <div className="member-avatar">{op.nickname[0]}</div>
                      <div className="member-info">
                        <h4>{op.nickname}</h4>
                        <p>{op.nomeCompleto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
