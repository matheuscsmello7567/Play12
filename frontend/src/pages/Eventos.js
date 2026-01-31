import React from 'react';
import './Games.css';
import { games } from '../data/gamesData';


function isPast(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const gameDate = new Date(dateStr);
  gameDate.setHours(0,0,0,0);
  return gameDate < today;
}

export default function Eventos() {
  const jogosPassados = games.filter(g => isPast(g.date));
  const proximosJogos = games.filter(g => !isPast(g.date));

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>EVENTOS</h1>
        <p>Veja todos os jogos organizados por data</p>
      </div>
      <div className="games-container">
        <div className="games-list-section">
          <h2>Próximos Jogos</h2>
          <div className="games-grid">
            {proximosJogos.length === 0 && <p>Nenhum jogo futuro cadastrado.</p>}
            {proximosJogos.map((game, idx) => (
              <div key={"proximo-"+idx} className="game-card" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', width: '100%'}}>
                <div style={{flex: 1}}>
                  <div className="game-card-header" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <h3 style={{marginBottom: 0}}>{game.title}
                      <span style={{marginLeft: '1rem'}} className="game-type">{game.type}</span>
                      <span style={{marginLeft: '0.5rem'}} className="game-status">{game.status}</span>
                    </h3>
                  </div>
                  <div className="game-info">
                    <div className="info-row"><span className="icon">📅</span> <span>{game.date}</span></div>
                    <div className="info-row"><span className="icon">🕐</span> <span>{game.time}</span></div>
                    <div className="info-row"><span className="icon">📍</span> <span>{game.location}</span></div>
                    <div className="info-row"><span className="icon">👥</span> <span>{game.players} inscritos</span></div>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', flex: '0 0 200px'}}>
                  <button className="hero-btn nav-login">INSCREVER-SE</button>
                </div>
              </div>
            ))}
          </div>
          <hr style={{margin: '2rem 0', border: 'none', borderTop: '2px solid #D4AF37'}} />
          <h2>Jogos Passados</h2>
          <div className="games-grid">
            {jogosPassados.length === 0 && <p>Nenhum jogo passado cadastrado.</p>}
            {jogosPassados.map((game, idx) => (
              <div key={"passado-"+idx} className="game-card">
                <div className="game-card-header">
                  <h3>{game.title}</h3>
                  <span className="game-type">{game.type}</span>
                  <span className="game-status">{game.status}</span>
                </div>
                <div className="game-info">
                  <div className="info-row"><span className="icon">📅</span> <span>{game.date}</span></div>
                  <div className="info-row"><span className="icon">🕐</span> <span>{game.time}</span></div>
                  <div className="info-row"><span className="icon">📍</span> <span>{game.location}</span></div>
                  <div className="info-row"><span className="icon">👥</span> <span>{game.players} inscritos</span></div>
                </div>
                <button className="hero-btn nav-login" disabled>INSCREVER-SE</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
