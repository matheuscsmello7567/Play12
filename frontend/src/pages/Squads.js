import React from 'react';
import './Squads.css';

const squads = [
  { name: 'Alpha Wolves', operators: 12, matches: 24, points: 320 },
  { name: 'Bravo Ghosts', operators: 9, matches: 18, points: 260 },
  { name: 'Crimson Vipers', operators: 14, matches: 30, points: 410 },
  { name: 'Delta Rangers', operators: 8, matches: 15, points: 210 },
  { name: 'Echo Titans', operators: 11, matches: 22, points: 295 }
];

export default function Squads() {
  return (
    <div className="squads-page">
      <h1 className="squads-title">Squads</h1>
      <div className="squads-table">
        <div className="squads-row squads-header">
          <div>Nome</div>
          <div>Qtd. Operadores</div>
          <div>Jogos jogados</div>
          <div>Pontuação total</div>
        </div>
        {squads.map((squad, idx) => (
          <div className="squads-row" key={idx}>
            <div className="squad-name">{squad.name}</div>
            <div>{squad.operators}</div>
            <div>{squad.matches}</div>
            <div className="squad-points">{squad.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
