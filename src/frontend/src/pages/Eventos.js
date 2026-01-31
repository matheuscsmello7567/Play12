import React from 'react';
import './Games.css';
import { games } from '../data/gamesData';

export default function Eventos() {
	return (
		<div className="games-page">
			<div className="games-header">
				<h1>EVENTOS</h1>
				<p>Confira os próximos eventos e jogos de airsoft organizados pela Play12</p>
			</div>
			<div className="games-list">
				{games.map((game, idx) => (
					<div key={idx} className="game-card">
						<h2>{game.title}</h2>
						<p className="game-date">{game.date}</p>
						<p className="game-location">Local: {game.location}</p>
						<p className="game-description">{game.description ? game.description : ''}</p>
					</div>
				))}
			</div>
		</div>
	);
}
