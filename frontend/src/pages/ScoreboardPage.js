import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ScoreboardPage.css';
import Scoreboard from '../components/Scoreboard';
import { apiFetch } from '../services/api';
import { mockGames, mockOperadores } from '../data/mockData';

export default function ScoreboardPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [operadores, setOperadores] = useState([]);
  const [gameOperadores, setGameOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      apiFetch('/jogos').catch(() => null),
      apiFetch('/operadores').catch(() => null),
      apiFetch(`/jogos/${gameId}/operadores`).catch(() => null)
    ])
      .then(([jogosData, opData, gameOpsData]) => {
        const games = jogosData && Array.isArray(jogosData) ? jogosData : mockGames;
        const ops = opData && Array.isArray(opData) ? opData : mockOperadores;
        const gameOps = gameOpsData && Array.isArray(gameOpsData) ? gameOpsData : [];
        
        const foundGame = games.find(g => g.id === parseInt(gameId));
        
        if (!foundGame) {
          setError('Jogo não encontrado');
          return;
        }

        let dateStr = foundGame.data;
        if (typeof foundGame.data === 'object' && foundGame.data !== null) {
          if (foundGame.data.year && foundGame.data.month && foundGame.data.day) {
            dateStr = `${foundGame.data.year}-${String(foundGame.data.month).padStart(2, '0')}-${String(foundGame.data.day).padStart(2, '0')}`;
          } else {
            dateStr = new Date(foundGame.data).toISOString().split('T')[0];
          }
        }

        let timeStr = foundGame.horario;
        if (typeof foundGame.horario === 'object' && foundGame.horario !== null) {
          if (foundGame.horario.hour !== undefined) {
            timeStr = `${String(foundGame.horario.hour).padStart(2, '0')}:${String(foundGame.horario.minute).padStart(2, '0')}`;
          }
        }

        const mappedGame = {
          id: foundGame.id,
          title: foundGame.titulo,
          type: foundGame.tipo,
          date: dateStr,
          time: timeStr,
          location: foundGame.local,
          players: foundGame.confirmados ? `${foundGame.confirmados} confirmados` : '0 confirmados',
          status: foundGame.status || 'Próximo'
        };

        setGame(mappedGame);
        setOperadores(ops);
        setGameOperadores(gameOps);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar dados');
      })
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) {
    return (
      <div className="scoreboard-page">
        <div className="scoreboard-loading">Carregando scoreboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scoreboard-page">
        <div className="scoreboard-error">{error}</div>
        <button className="back-btn" onClick={() => navigate('/eventos')}>← Voltar aos Eventos</button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="scoreboard-page">
        <div className="scoreboard-error">Jogo não encontrado</div>
        <button className="back-btn" onClick={() => navigate('/eventos')}>← Voltar aos Eventos</button>
      </div>
    );
  }

  const locationUrl = game.location?.startsWith('http') ? game.location : null;

  return (
    <div className="scoreboard-page">
      <button className="back-btn" onClick={() => navigate('/eventos')}>← Voltar</button>

      <div className="scoreboard-game-header">
        <h1>{game.title}</h1>
        <div className="game-meta">
          <span className="meta-item">📅 {new Date(game.date).toLocaleDateString('pt-BR')}</span>
          <span className="meta-item">🕐 {game.time}</span>
          <span className="meta-item">
            📍 {locationUrl ? (
              <a href={locationUrl} target="_blank" rel="noreferrer" className="location-link">Abrir no mapa</a>
            ) : (
              game.location
            )}
          </span>
          <span className="meta-item">👥 {game.players}</span>
        </div>
      </div>

      <div className="scoreboard-wrapper">
        {gameOperadores.length > 0 || operadores.length > 0 ? (
          <Scoreboard
            gameId={game.id}
            operadores={operadores}
            gameOperadores={gameOperadores}
          />
        ) : (
          <div className="no-data">
            <p>Sem operadores associados ao jogo</p>
            <p className="no-data-hint">Adicione operadores pelo Dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
