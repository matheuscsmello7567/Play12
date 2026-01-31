import React, { useState } from 'react';
import './Games.css';
import { games } from '../data/gamesData';

export default function Games() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 27)); // Janeiro 27, 2026

  // games importado

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
        <h1>JOGOS</h1>
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
          <h2>PRÓXIMOS JOGOS</h2>
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-card-header">
                  <span className="game-type">{game.type}</span>
                  <span className="game-status">{game.status}</span>
                </div>

                <h3>{game.title}</h3>

                <div className="game-info">
                  <div className="info-row">
                    <span className="icon">📅</span>
                    <span>{new Date(game.dateObj).toLocaleDateString('pt-BR')}</span>
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
        </div>
      </div>
    </div>
  );
}
