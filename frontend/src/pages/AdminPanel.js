import React, { useMemo, useState } from 'react';
import './AdminPanel.css';
import { games as initialGames } from '../data/gamesData';

const initialPlayers = [
  { id: 1, name: 'Carlos Silva', email: 'carlos@play12.com', role: 'Líder', squad: 'Alpha Wolves', paid: true },
  { id: 2, name: 'Fernanda Lima', email: 'fernanda@play12.com', role: 'Operador', squad: 'Bravo Ghosts', paid: true },
  { id: 3, name: 'João Mendes', email: 'joao@play12.com', role: 'Avulso', squad: '', paid: false },
  { id: 4, name: 'Marina Costa', email: 'marina@play12.com', role: 'Operador', squad: 'Crimson Vipers', paid: true }
];

const roles = ['Líder', 'Operador', 'Avulso'];

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [players, setPlayers] = useState(initialPlayers);
  const [games, setGames] = useState(initialGames);
  const [editingId, setEditingId] = useState(null);
  const [newGame, setNewGame] = useState({
    title: '',
    type: 'Milsim',
    date: '',
    time: '',
    location: ''
  });

  const totalPlayers = players.length;
  const confirmedPlayers = players.filter(p => p.paid).length;
  const scheduledGames = games.filter(g => new Date(g.date) >= new Date()).length;

  const upcomingGames = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return games
      .filter(g => new Date(g.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [games]);

  const handleRoleChange = (id, role) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, role, squad: role === 'Avulso' ? '' : p.squad } : p)));
  };

  const handleSquadChange = (id, squad) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, squad } : p)));
  };

  const handleRemovePlayer = (id) => {
    const removed = players.find(p => p.id === id);
    setPlayers(prev => prev.filter(p => p.id !== id));
    if (removed && user && removed.email === user.email) {
      onLogout();
    }
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!newGame.title || !newGame.date || !newGame.time || !newGame.location) return;
    const id = Math.max(0, ...games.map(g => g.id)) + 1;
    setGames(prev => [...prev, { id, players: '0/0', status: 'Próximo', ...newGame }]);
    setNewGame({ title: '', type: 'Milsim', date: '', time: '', location: '' });
  };

  const handleEditGame = (id, field, value) => {
    setGames(prev => prev.map(g => (g.id === id ? { ...g, [field]: value } : g)));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel do Administrador</h1>
        <p>Organize jogos, jogadores, regras e logística</p>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'players' ? 'active' : ''} onClick={() => setActiveTab('players')}>Jogadores</button>
        <button className={activeTab === 'games' ? 'active' : ''} onClick={() => setActiveTab('games')}>Jogos</button>
        <button className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>Logística</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="admin-section">
          <div className="admin-stats">
            <div className="stat-card">
              <span>Total de Jogadores</span>
              <strong>{totalPlayers}</strong>
            </div>
            <div className="stat-card">
              <span>Confirmados (pagos)</span>
              <strong>{confirmedPlayers}</strong>
            </div>
            <div className="stat-card">
              <span>Jogos Agendados</span>
              <strong>{scheduledGames}</strong>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Próximos Jogos</h2>
            {upcomingGames.length === 0 && <p>Nenhum jogo agendado.</p>}
            {upcomingGames.map(game => (
              <div key={game.id} className="admin-game-item">
                <div>
                  <strong>{game.title}</strong>
                  <div className="admin-game-info">
                    <span>Data: {new Date(game.date).toLocaleDateString('pt-BR')}</span>
                    <span>Horário: {game.time}</span>
                    <span>Local: {game.location}</span>
                  </div>
                </div>
                <span className="admin-badge">{game.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'players' && (
        <div className="admin-section">
          <div className="admin-panel">
            <h2>Gerenciamento de Jogadores</h2>
            <div className="players-table">
              <div className="players-row header">
                <div>Nome</div>
                <div>Email</div>
                <div>Função</div>
                <div>Squad</div>
                <div>Ações</div>
              </div>
              {players.map(player => (
                <div className="players-row" key={player.id}>
                  <div>{player.name}</div>
                  <div>{player.email}</div>
                  <div>
                    <select value={player.role} onChange={(e) => handleRoleChange(player.id, e.target.value)}>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={player.squad}
                      disabled={player.role === 'Avulso'}
                      onChange={(e) => handleSquadChange(player.id, e.target.value)}
                      placeholder={player.role === 'Avulso' ? 'Sem squad' : 'Nome do squad'}
                    />
                  </div>
                  <div>
                    <button className="danger" onClick={() => handleRemovePlayer(player.id)}>Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="admin-section">
          <div className="admin-panel">
            <h2>Gerenciamento de Jogos</h2>

            <form className="game-form" onSubmit={handleCreateGame}>
              <input
                type="text"
                placeholder="Título do jogo"
                value={newGame.title}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
              />
              <select
                value={newGame.type}
                onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
              >
                <option value="Milsim">Milsim</option>
                <option value="Treino">Treino</option>
                <option value="4Fun">4Fun</option>
              </select>
              <input
                type="date"
                value={newGame.date}
                onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
              />
              <input
                type="time"
                value={newGame.time}
                onChange={(e) => setNewGame({ ...newGame, time: e.target.value })}
              />
              <input
                type="text"
                placeholder="Local"
                value={newGame.location}
                onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
              />
              <button type="submit">Criar Novo Jogo</button>
            </form>

            <div className="games-admin-list">
              {games.map(game => (
                <div key={game.id} className="games-admin-card">
                  <div className="games-admin-fields">
                    <input
                      type="text"
                      value={game.title}
                      onChange={(e) => handleEditGame(game.id, 'title', e.target.value)}
                    />
                    <select value={game.type} onChange={(e) => handleEditGame(game.id, 'type', e.target.value)}>
                      <option value="Milsim">Milsim</option>
                      <option value="Treino">Treino</option>
                      <option value="4Fun">4Fun</option>
                    </select>
                    <input type="date" value={game.date} onChange={(e) => handleEditGame(game.id, 'date', e.target.value)} />
                    <input type="time" value={game.time} onChange={(e) => handleEditGame(game.id, 'time', e.target.value)} />
                    <input type="text" value={game.location} onChange={(e) => handleEditGame(game.id, 'location', e.target.value)} />
                  </div>
                  <div className="games-admin-meta">
                    <span>Confirmados (pagos): {confirmedPlayers}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="admin-section">
          <div className="admin-panel">
            <h2>Gerenciamento de Logística</h2>
            <div className="logistics-grid">
              <div className="logistics-card">
                <h3>Equipamentos</h3>
                <p>Nenhum item cadastrado</p>
              </div>
              <div className="logistics-card">
                <h3>Locais</h3>
                <p>Nenhum item cadastrado</p>
              </div>
              <div className="logistics-card">
                <h3>Transporte</h3>
                <p>Nenhum item cadastrado</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
