import React, { useEffect, useMemo, useState } from 'react';
import './Games.css';
import { apiFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Scoreboard from '../components/Scoreboard';

export default function Eventos() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 27));
  const [search, setSearch] = useState('');
  const [games, setGames] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const gamesByDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return games.filter(g => {
      // Garantir que g.date está em formato string YYYY-MM-DD
      let gameDate = g.date;
      if (typeof gameDate === 'object' && gameDate !== null) {
        // Se for um objeto, converter para string
        if (gameDate.year && gameDate.month && gameDate.day) {
          gameDate = `${gameDate.year}-${String(gameDate.month).padStart(2, '0')}-${String(gameDate.day).padStart(2, '0')}`;
        }
      }
      return gameDate === dateStr;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredGames = useMemo(() => {
    const term = search.trim().toLowerCase();
    return games.filter((g) => {
      if (!term) return true;
      return (
        g.title.toLowerCase().includes(term) ||
        g.location.toLowerCase().includes(term) ||
        g.type.toLowerCase().includes(term)
      );
    });
  }, [search, games]);

  const upcomingGames = filteredGames.filter((g) => {
    try {
      const gameDate = new Date(g.date);
      return gameDate >= today;
    } catch {
      return false;
    }
  });
  
  const pastGames = filteredGames.filter((g) => {
    try {
      const gameDate = new Date(g.date);
      return gameDate < today;
    } catch {
      return false;
    }
  });

  const refreshGames = () => {
    setLoading(true);
    setError('');
    Promise.all([
      apiFetch('/jogos'),
      apiFetch('/operadores'),
      apiFetch('/squads')
    ])
      .then(([jogosData, opData, squadsData]) => {
        const mapped = jogosData.map((g) => {
          // Converter data para string no formato YYYY-MM-DD se necessário
          let dateStr = g.data;
          if (typeof g.data === 'object' && g.data !== null) {
            // Se for um objeto com year, month, day
            if (g.data.year && g.data.month && g.data.day) {
              dateStr = `${g.data.year}-${String(g.data.month).padStart(2, '0')}-${String(g.data.day).padStart(2, '0')}`;
            } else {
              // Se for um objeto Date, converter
              dateStr = new Date(g.data).toISOString().split('T')[0];
            }
          }
          
          // Converter horario para string no formato HH:mm se necessário
          let timeStr = g.horario;
          if (typeof g.horario === 'object' && g.horario !== null) {
            // Se for um objeto com hour, minute, second
            if (g.horario.hour !== undefined) {
              timeStr = `${String(g.horario.hour).padStart(2, '0')}:${String(g.horario.minute).padStart(2, '0')}`;
            }
          }
          
          return {
            id: g.id,
            title: g.titulo,
            type: g.tipo,
            date: dateStr,
            time: timeStr,
            location: g.local,
            players: g.confirmados ? `${g.confirmados} confirmados` : '0 confirmados',
            status: g.status || 'Próximo'
          };
        });
        setGames(mapped);
        // Extrair dados do operadores (que é {success: true, data: [...]})
        const opsArray = Array.isArray(opData) ? opData : (opData.data || []);
        setOperadores(opsArray);
        setSquads(Array.isArray(squadsData) ? squadsData : []);
      })
      .catch((err) => {
        setGames([]);
        setError(err.message || 'Erro ao carregar dados');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshGames();
  }, []);

  const calendarDays = [];
  const totalDays = daysInMonth(currentDate);
  const startDay = firstDayOfMonth(currentDate);

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>EVENTOS</h1>
        <p>Agenda de eventos e torneios de airsoft</p>
      </div>

      <div className="games-container">
        {/* Calendário */}
        <div className="calendar-section">
          <div className="calendar">
            <div className="calendar-header">
              <button onClick={previousMonth} className="nav-btn">◀</button>
              <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <button onClick={nextMonth} className="nav-btn">▶</button>
            </div>

            <div className="weekdays">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sab</div>
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day ? 'active' : 'empty'} ${
                    gamesByDate(day).length > 0 ? 'has-event' : ''
                  }`}
                >
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {gamesByDate(day).length > 0 && (
                        <span className="event-indicator">●</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Jogos */}
        <div className="games-list-section">
          {error && <div className="events-error">{error === 'Servidor offline' ? 'Servidor offline. Tente novamente mais tarde.' : error}</div>}
          {loading && <div className="events-loading">Carregando jogos...</div>}
          <div className="events-search">
            <input
              type="text"
              placeholder="Buscar por nome, local ou tipo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => setSearch('')}
              disabled={!search.trim()}
            >
              Limpar filtros
            </button>
            <button
              type="button"
              className="clear-filters-btn"
              onClick={refreshGames}
              disabled={loading}
            >
              Atualizar
            </button>
          </div>

          <h2>PRÓXIMOS JOGOS</h2>
          <div className="upcoming-grid">
            {upcomingGames.length === 0 && <p>Nenhum jogo encontrado.</p>}
            {upcomingGames.map((game) => (
              <div key={game.id} className="upcoming-card">
                <div className="upcoming-head">
                  <h3>{game.title}</h3>
                  <div className="badge-row">
                    <span className="game-type">{game.type}</span>
                    <span className="game-status">{game.status}</span>
                  </div>
                </div>
                <div className="game-info">
                  <div className="info-row">
                    <span className="icon">📅</span>
                    <span>{new Date(game.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">🕐</span>
                    <span>{game.time}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">📍</span>
                    {game.location?.startsWith('http') ? (
                      <a href={game.location} target="_blank" rel="noreferrer">Abrir no mapa</a>
                    ) : (
                      <span>{game.location}</span>
                    )}
                  </div>
                  <div className="info-row">
                    <span className="icon">👥</span>
                    <span>{game.players}</span>
                  </div>
                </div>

                <div className="game-actions">
                  {operadores.length > 0 && squads.length > 0 && (
                    <button 
                      className="hero-btn nav-login"
                      onClick={() => navigate(`/eventos/${game.id}/scoreboard`)}
                    >
                      SCOREBOARD
                    </button>
                  )}
                  <button className="hero-btn nav-login">INSCREVER-SE</button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="past-title">JOGOS PASSADOS</h2>
          <div className="games-list">
            {pastGames.length === 0 && <p>Nenhum jogo passado encontrado.</p>}
            {pastGames.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-card-header">
                  <span className="game-type">{game.type}</span>
                  <span className="game-status">{game.status}</span>
                </div>

                <h3>{game.title}</h3>

                <div className="game-info">
                  <div className="info-row">
                    <span className="icon">📅</span>
                    <span>{new Date(game.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">🕐</span>
                    <span>{game.time}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">📍</span>
                    {game.location?.startsWith('http') ? (
                      <a href={game.location} target="_blank" rel="noreferrer">Abrir no mapa</a>
                    ) : (
                      <span>{game.location}</span>
                    )}
                  </div>
                  <div className="info-row">
                    <span className="icon">👥</span>
                    <span>{game.players}</span>
                  </div>
                </div>

                {/* Scoreboard para jogos finalizados */}
                {game.status === 'Finalizado' && operadores.length > 0 && squads.length > 0 && (
                  <Scoreboard 
                    gameId={game.id}
                    operadores={operadores}
                    squads={squads}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
