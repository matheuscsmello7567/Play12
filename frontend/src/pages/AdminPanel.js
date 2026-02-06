import React, { useEffect, useMemo, useState } from 'react';
import './AdminPanel.css';
import { apiFetch } from '../services/api';

const roles = ['LIDER', 'OPERADOR', 'AVULSO'];

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [dashboard, setDashboard] = useState({ totalJogadores: 0, confirmados: 0, jogosAgendados: 0, proximosJogos: [] });
  const [squads, setSquads] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState({
    title: '',
    type: 'Milsim',
    date: '',
    time: '',
    location: ''
  });

  const totalPlayers = dashboard.totalJogadores;
  const confirmedPlayers = dashboard.confirmados;
  const scheduledGames = dashboard.jogosAgendados;

  const upcomingGames = useMemo(() => dashboard.proximosJogos || [], [dashboard]);

  const refreshAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [dash, playersData, gamesData, squadsData] = await Promise.all([
        apiFetch('/admin/dashboard'),
        apiFetch('/operadores'),
        apiFetch('/jogos'),
        apiFetch('/squads')
      ]);
      setDashboard(dash);
      // Extrair data do players (operadores retorna {success: true, data: [...]})
      const operadores = Array.isArray(playersData) ? playersData : (playersData.data || []);
      setPlayers(operadores);
      // Games e Squads retornam direto a lista
      setGames(Array.isArray(gamesData) ? gamesData : []);
      setSquads(Array.isArray(squadsData) ? squadsData : []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      const payload = { funcao: role, squadId: null };
      if (role !== 'AVULSO') {
        const player = players.find(p => p.id === id);
        payload.squadId = player?.squadId || null;
      }
      const response = await apiFetch(`/operadores/${id}/admin`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      const updated = response.data || response;
      setPlayers(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message || 'Erro ao atualizar jogador');
    }
  };

  const handleSquadChange = async (id, squadId) => {
    try {
      const response = await apiFetch(`/operadores/${id}/admin`, {
        method: 'PUT',
        body: JSON.stringify({ squadId })
      });
      const updated = response.data || response;
      setPlayers(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message || 'Erro ao atualizar squad');
    }
  };

  const handleRemovePlayer = async (id) => {
    try {
      const removed = players.find(p => p.id === id);
      await apiFetch(`/operadores/${id}`, { method: 'DELETE' });
      setPlayers(prev => prev.filter(p => p.id !== id));
      if (removed && user && removed.email === user.email) {
        onLogout();
      }
    } catch (err) {
      setError(err.message || 'Erro ao remover jogador');
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    if (!newGame.title || !newGame.date || !newGame.time || !newGame.location) return;
    try {
      const mapsUrl = newGame.location.startsWith('http')
        ? newGame.location
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newGame.location)}`;
      
      // Converter tipo para o enum correto
      const tipoMapping = {
        'Milsim': 'MILSIM',
        'Treino': 'TREINO',
        '4Fun': 'FUN4'
      };
      
      const response = await apiFetch('/jogos', {
        method: 'POST',
        body: JSON.stringify({
          titulo: newGame.title,
          tipo: tipoMapping[newGame.type] || 'MILSIM',
          data: newGame.date,
          horario: newGame.time,
          local: mapsUrl,
          confirmados: 0,
          status: 'Próximo'
        })
      });
      const created = response.data || response;
      setGames(prev => [...prev, created]);
      setNewGame({ title: '', type: 'Milsim', date: '', time: '', location: '' });
      setSuccess('Jogo criado com sucesso!');
      refreshAll();
    } catch (err) {
      setError(err.message || 'Erro ao criar jogo');
    }
  };

  const handleEditGame = async (id, field, value) => {
    try {
      const target = games.find(g => g.id === id);
      if (!target) return;
      const updatedLocation = field === 'location'
        ? (value.startsWith('http') ? value : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`)
        : target.local;
      
      // Mapear tipo se necessário
      let tipo = target.tipo;
      if (field === 'type') {
        const tipoMapping = {
          'MILSIM': 'MILSIM',
          'TREINO': 'TREINO',
          'FUN4': 'FUN4',
          'Milsim': 'MILSIM',
          'Treino': 'TREINO',
          '4Fun': 'FUN4'
        };
        tipo = tipoMapping[value] || value;
      }
      
      const response = await apiFetch(`/jogos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          titulo: field === 'title' ? value : target.titulo,
          tipo: field === 'type' ? tipo : target.tipo,
          data: field === 'date' ? value : target.data,
          horario: field === 'time' ? value : target.horario,
          local: updatedLocation,
          confirmados: target.confirmados,
          status: target.status
        })
      });
      const updated = response.data || response;
      setGames(prev => prev.map(g => (g.id === id ? updated : g)));
      setSuccess('Jogo atualizado com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar jogo');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel do Administrador</h1>
        <p>Organize jogos, jogadores, regras e logística</p>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'operadores' ? 'active' : ''} onClick={() => setActiveTab('operadores')}>Operadores</button>
        <button className={activeTab === 'times' ? 'active' : ''} onClick={() => setActiveTab('times')}>Times</button>
        <button className={activeTab === 'games' ? 'active' : ''} onClick={() => setActiveTab('games')}>Jogos</button>
        <button className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>Logística</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="admin-section">
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          {loading && <div className="admin-loading">Carregando...</div>}
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
            {error && <p>{error}</p>}
            {upcomingGames.length === 0 && <p>Nenhum jogo agendado.</p>}
            {upcomingGames.map(game => (
              <div key={game.id} className="admin-game-item">
                <div>
                  <strong>{game.titulo}</strong>
                  <div className="admin-game-info">
                    <span>Data: {new Date(game.data).toLocaleDateString('pt-BR')}</span>
                    <span>Horário: {game.horario}</span>
                    <span>
                      Local:{' '}
                      {String(game.local || '').startsWith('http') ? (
                        <a href={game.local} target="_blank" rel="noreferrer">Abrir no mapa</a>
                      ) : (
                        game.local
                      )}
                    </span>
                  </div>
                </div>
                <span className="admin-badge">{game.tipo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'players' && (
        <div className="admin-section">
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          {loading && <div className="admin-loading">Carregando...</div>}
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
                  <div>{player.nomeCompleto}</div>
                  <div>{player.email}</div>
                  <div>
                    <select value={player.funcao} onChange={(e) => handleRoleChange(player.id, e.target.value)}>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <select
                      value={player.squadId || ''}
                      disabled={player.funcao === 'AVULSO'}
                      onChange={(e) => handleSquadChange(player.id, e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">{player.funcao === 'AVULSO' ? 'Sem squad' : 'Selecionar squad'}</option>
                      {squads.map((s) => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                      ))}
                    </select>
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
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          {loading && <div className="admin-loading">Carregando...</div>}
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
                placeholder="URL do Google Maps ou endereço"
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
                      value={game.titulo}
                      onChange={(e) => handleEditGame(game.id, 'title', e.target.value)}
                    />
                    <select value={game.tipo} onChange={(e) => handleEditGame(game.id, 'type', e.target.value)}>
                      <option value="MILSIM">Milsim</option>
                      <option value="TREINO">Treino</option>
                      <option value="FUN4">4Fun</option>
                    </select>
                    <input type="date" value={game.data} onChange={(e) => handleEditGame(game.id, 'date', e.target.value)} />
                    <input type="time" value={game.horario} onChange={(e) => handleEditGame(game.id, 'time', e.target.value)} />
                    <input type="text" value={game.local} onChange={(e) => handleEditGame(game.id, 'location', e.target.value)} />
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

      {activeTab === 'operadores' && (
        <div className="admin-section">
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          {loading && <div className="admin-loading">Carregando...</div>}
          <div className="admin-panel">
            <h2>Gerenciamento de Operadores</h2>
            <div className="players-table">
              <div className="players-row header">
                <div>Apelido</div>
                <div>Nome</div>
                <div>Squad</div>
                <div>Pontos</div>
                <div>Ações</div>
              </div>
              {players.map(player => (
                <div className="players-row" key={player.id}>
                  <div>{player.nickname}</div>
                  <div>{player.nomeCompleto}</div>
                  <div>{player.squadNome || 'Sem squad'}</div>
                  <div>
                    <input
                      type="number"
                      value={player.pontos || 0}
                      onChange={(e) => {
                        const updated = players.map(p =>
                          p.id === player.id ? { ...p, pontos: parseInt(e.target.value) } : p
                        );
                        setPlayers(updated);
                      }}
                      style={{ width: '80px' }}
                    />
                  </div>
                  <div>
                    <button
                      className="success"
                      onClick={() => {
                        setError('');
                        setSuccess('');
                        const pontosValue = parseInt(player.pontos || 0);
                        
                        console.log(`Enviando para /operadores/${player.id}/pontos:`, { pontos: pontosValue });
                        
                        apiFetch(`/operadores/${player.id}/pontos`, {
                          method: 'PUT',
                          body: JSON.stringify({ pontos: pontosValue })
                        }).then((response) => {
                          console.log('Resposta:', response);
                          setSuccess('Pontos atualizados com sucesso!');
                          setTimeout(() => {
                            refreshAll();
                            setSuccess('');
                          }, 1000);
                        }).catch(err => {
                          console.error('Erro completo:', err);
                          setError(err.message || 'Erro ao atualizar pontos');
                        });
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'times' && (
        <div className="admin-section">
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          {loading && <div className="admin-loading">Carregando...</div>}
          <div className="admin-panel">
            <h2>Gerenciamento de Times</h2>
            <div className="times-admin-list">
              {squads.map(squad => (
                <div key={squad.id} className="times-admin-card">
                  <div className="times-admin-fields">
                    <h3>{squad.nome}</h3>
                    <p>Operadores: {squad.qtdOperadores || 0}</p>
                    <p>Jogos: {squad.jogosJogados || 0}</p>
                    <p>
                      Pontos:
                      <input
                        type="number"
                        value={squad.pontuacaoTotal || 0}
                        onChange={(e) => {
                          const updated = squads.map(s =>
                            s.id === squad.id ? { ...s, pontuacaoTotal: parseInt(e.target.value) } : s
                          );
                          setSquads(updated);
                        }}
                        style={{ width: '80px', marginLeft: '0.5rem' }}
                      />
                    </p>
                    <p>
                      <strong>Descrição:</strong>
                    </p>
                    <textarea
                      value={squad.descricao || ''}
                      onChange={(e) => {
                        const updated = squads.map(s =>
                          s.id === squad.id ? { ...s, descricao: e.target.value } : s
                        );
                        setSquads(updated);
                      }}
                      style={{ width: '100%', minHeight: '100px' }}
                    />
                    <button
                      className="success"
                      onClick={() => {
                        setError('');
                        apiFetch(`/squads/${squad.id}`, {
                          method: 'PUT',
                          body: JSON.stringify({
                            nome: squad.nome,
                            pontuacaoTotal: squad.pontuacaoTotal,
                            descricao: squad.descricao,
                            qtdOperadores: squad.qtdOperadores,
                            jogosJogados: squad.jogosJogados
                          })
                        }).then(() => {
                          setSuccess('Time atualizado!');
                          setTimeout(() => setSuccess(''), 3000);
                        }).catch(err => {
                          setError(err.message || 'Erro ao atualizar time');
                        });
                      }}
                      style={{ marginTop: '1rem' }}
                    >
                      Salvar
                    </button>
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
