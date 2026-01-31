import React, { useMemo, useState } from 'react';
import './Games.css';
import { games } from '../data/gamesData';

export default function Eventos() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 27));
  const [search, setSearch] = useState('');

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
    return games.filter(g => g.date === dateStr);
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
  }, [search]);

  const upcomingGames = filteredGames.filter((g) => new Date(g.date) >= today);
  const pastGames = filteredGames.filter((g) => new Date(g.date) < today);

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
          <div className="events-search">
            <input
              type="text"
              placeholder="Buscar por nome, local ou tipo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                    <span>{game.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">👥</span>
                    <span>{game.players} inscritos</span>
                  </div>
                </div>
                <button className="hero-btn nav-login">INSCREVER-SE</button>
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
                    <span>{game.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="icon">👥</span>
                    <span>{game.players} inscritos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
