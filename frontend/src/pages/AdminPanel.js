import React, { useEffect, useMemo, useState } from 'react';
import './AdminPanel.css';
import { apiFetch } from '../services/api';
import { mockDashboard, mockOperadores, mockGames, mockSquads } from '../data/mockData';

const roles = ['LIDER', 'OPERADOR', 'AVULSO'];

const TEAM_SQUADS = {
  BLUFOR: ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
  OPFOR: ['ECHO', 'FOXTROT', 'GOLF', 'HOTEL']
};

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
    duration: '',
    date: '',
    gateTime: '',
    startTime: '',
    value: '',
    location: ''
  });
  const [equipments, setEquipments] = useState([]);
  const [newEquipment, setNewEquipment] = useState({ name: '', rentalPrice: '' });
  const [gameLocations, setGameLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', url: '' });
  const [expandedSquads, setExpandedSquads] = useState({});
  const [expandedGames, setExpandedGames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [selectedPlayersForGame, setSelectedPlayersForGame] = useState({});
  const [playersInGame, setPlayersInGame] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('BLUFOR');

  const totalPlayers = dashboard.totalJogadores;
  const confirmedPlayers = dashboard.confirmados;

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
      
      // Use mock data if API returns null or errors
      if (!dash || !playersData || !gamesData || !squadsData) {
        setDashboard(mockDashboard);
        setPlayers(mockOperadores);
        setGames(mockGames);
        setSquads(mockSquads);
        // Initialize first game as expanded
        if (mockGames.length > 0) {
          setExpandedGames({ [mockGames[0].id]: true });
        }
        setError('Usando dados locais (servidor indisponível)');
        return;
      }

      setDashboard(dash);
      // Extrair data do players (operadores retorna {success: true, data: [...]})
      const operadores = Array.isArray(playersData) ? playersData : (playersData.data || []);
      setPlayers(operadores);
      // Games e Squads retornam direto a lista
      const gamesArray = Array.isArray(gamesData) ? gamesData : [];
      setGames(gamesArray);
      setSquads(Array.isArray(squadsData) ? squadsData : []);
      // Initialize first game as expanded
      if (gamesArray.length > 0) {
        setExpandedGames({ [gamesArray[0].id]: true });
      }
    } catch (err) {
      // Fallback to mock data on error
      setDashboard(mockDashboard);
      setPlayers(mockOperadores);
      setGames(mockGames);
      setSquads(mockSquads);
      // Initialize first game as expanded
      if (mockGames.length > 0) {
        setExpandedGames({ [mockGames[0].id]: true });
      }
      setError('Usando dados locais (servidor indisponível)');
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
    if (!newGame.title || !newGame.duration || !newGame.date || !newGame.gateTime || !newGame.startTime || !newGame.value || !newGame.location) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
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
          horario: newGame.startTime,
          local: mapsUrl,
          confirmados: 0,
          status: 'Próximo'
        })
      });
      const created = response.data || response;
      setGames(prev => [...prev, created]);
      setNewGame({ title: '', type: 'Milsim', duration: '', date: '', gateTime: '', startTime: '', value: '', location: '' });
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

  // Calcular times confirmados (times com pelo menos 1 jogador confirmado)
  const calculateConfirmedTeams = () => {
    const teamsWithPlayers = new Set();
    Object.values(playersInGame).forEach(playersList => {
      playersList.forEach(p => {
        if (p.time) teamsWithPlayers.add(p.time);
      });
    });
    return teamsWithPlayers.size;
  };

  // Adicionar jogadores selecionados ao jogo
  const handleAddPlayersToGame = (gameId) => {
    const selectedPlayers = Object.entries(selectedPlayersForGame)
      .filter(([_, selected]) => selected)
      .map(([playerId, _]) => {
        const player = players.find(p => p.id === parseInt(playerId));
        return {
          id: player.id,
          name: player.nomeCompleto,
          squad: '',
          time: ''
        };
      });

    setPlayersInGame(prev => ({
      ...prev,
      [gameId]: [...(prev[gameId] || []), ...selectedPlayers]
    }));
    
    setSelectedPlayersForGame({});
    setShowAddPlayersModal(false);
  };

  // Remover jogador do jogo
  const handleRemovePlayerFromGame = (gameId, playerId) => {
    setPlayersInGame(prev => ({
      ...prev,
      [gameId]: prev[gameId].filter(p => p.id !== playerId)
    }));
  };

  // Atualizar assignments (squad/time) de um jogador
  const handleUpdatePlayerAssignment = (gameId, playerId, field, value) => {
    setPlayersInGame(prev => ({
      ...prev,
      [gameId]: prev[gameId].map(p =>
        p.id === playerId ? { ...p, [field]: value } : p
      )
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Organize jogos, jogadores, regras e logística</p>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Próximo Jogo</button>
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
              <span>Times Confirmados</span>
              <strong>{calculateConfirmedTeams()}</strong>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Próximo Jogo</h2>
            {error && <p>{error}</p>}
            {upcomingGames.length === 0 && <p>Nenhum jogo agendado.</p>}
            {upcomingGames.length > 0 && (
              <div className="admin-game-item">
                <div>
                  <strong>{upcomingGames[0].titulo}</strong>
                  <div className="admin-game-info">
                    <span>Data: {new Date(upcomingGames[0].data).toLocaleDateString('pt-BR')}</span>
                    <span>Horário: {upcomingGames[0].horario}</span>
                    <span>
                      Local:{' '}
                      {String(upcomingGames[0].local || '').startsWith('http') ? (
                        <a href={upcomingGames[0].local} target="_blank" rel="noreferrer">Abrir no mapa</a>
                      ) : (
                        upcomingGames[0].local
                      )}
                    </span>
                  </div>
                </div>
                <span className="admin-badge">{upcomingGames[0].tipo}</span>
              </div>
            )}
            
            {upcomingGames.length > 0 && (
              <div className="add-players-section">
                <button 
                  className="hero-btn"
                  onClick={() => setShowAddPlayersModal(true)}
                >
                  + Incluir Jogadores
                </button>
              </div>
            )}
          </div>

          {/* Modal para Incluir Jogadores */}
          {showAddPlayersModal && upcomingGames.length > 0 && (
            <div className="modal-overlay" onClick={() => setShowAddPlayersModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Selecionar Jogadores</h3>
                  <button className="close-btn" onClick={() => setShowAddPlayersModal(false)}>✕</button>
                </div>

                {/* Team Toggle */}
                <div className="team-toggle-section">
                  <span className="toggle-label">Exército:</span>
                  <div className="team-toggle">
                    <button
                      className={`toggle-btn ${selectedTeam === 'BLUFOR' ? 'active' : ''}`}
                      onClick={() => setSelectedTeam('BLUFOR')}
                    >
                      BLUFOR
                    </button>
                    <button
                      className={`toggle-btn ${selectedTeam === 'OPFOR' ? 'active' : ''}`}
                      onClick={() => setSelectedTeam('OPFOR')}
                    >
                      OPFOR
                    </button>
                  </div>
                </div>
                
                <div className="modal-body">
                  <div className="players-selection">
                    {players.length === 0 ? (
                      <p>Nenhum jogador cadastrado</p>
                    ) : (
                      <>
                        <p className="selection-info">Selecione múltiplos jogadores para incluir no jogo</p>
                        <div className="checkbox-list">
                          {players.map(player => (
                            <label key={player.id} className="checkbox-item">
                              <input 
                                type="checkbox"
                                checked={selectedPlayersForGame[player.id] || false}
                                onChange={(e) => setSelectedPlayersForGame(prev => ({
                                  ...prev,
                                  [player.id]: e.target.checked
                                }))}
                              />
                              <span>{player.nomeCompleto}</span>
                            </label>
                          ))}
                        </div>

                        {Object.values(selectedPlayersForGame).some(v => typeof v === 'boolean' && v) && (
                          <div className="selected-players-assignments">
                            <h4>Squad</h4>
                            {players
                              .filter(p => selectedPlayersForGame[p.id])
                              .map(player => (
                                <div key={player.id} className="player-assignment-row">
                                  <span className="player-name">{player.nomeCompleto}</span>
                                  <select 
                                    className="assignment-select"
                                    value={selectedPlayersForGame[`${player.id}_squad`] || ''}
                                    onChange={(e) => setSelectedPlayersForGame(prev => ({
                                      ...prev,
                                      [`${player.id}_squad`]: e.target.value
                                    }))}
                                  >
                                    <option value="">Squad</option>
                                    {(selectedTeam === 'BLUFOR' ? TEAM_SQUADS.BLUFOR : TEAM_SQUADS.OPFOR).map(squad => (
                                      <option key={squad} value={squad}>{squad}</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowAddPlayersModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="hero-btn"
                    onClick={() => handleAddPlayersToGame(upcomingGames[0].id)}
                    disabled={!Object.values(selectedPlayersForGame).some(v => v)}
                  >
                    Adicionar Jogadores
                  </button>
                </div>
              </div>
            </div>
          )}
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

            <div className="create-games-section">
              <h3>Criar Novo Jogo</h3>

              <form className="game-form" onSubmit={handleCreateGame}>
              <div className="form-group">
                <label>Nome do Jogo</label>
                <input
                  type="text"
                  placeholder="Ex: Operação Hotel Betim"
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Duração</label>
                <input
                  type="text"
                  placeholder="Ex: 8 horas"
                  value={newGame.duration}
                  onChange={(e) => setNewGame({ ...newGame, duration: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data do Jogo</label>
                  <input
                    type="date"
                    value={newGame.date}
                    onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Abertura dos Portões</label>
                  <input
                    type="time"
                    value={newGame.gateTime}
                    onChange={(e) => setNewGame({ ...newGame, gateTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Começo do Jogo</label>
                  <input
                    type="time"
                    value={newGame.startTime}
                    onChange={(e) => setNewGame({ ...newGame, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 150.00"
                    value={newGame.value}
                    onChange={(e) => setNewGame({ ...newGame, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL do Local do Jogo</label>
                <input
                  type="text"
                  placeholder="Ex: https://maps.google.com/... ou endereço"
                  value={newGame.location}
                  onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
                />
              </div>

              <button type="submit">Criar Novo Jogo</button>
            </form>
            </div>

            <div className="scheduled-games-section">
              <h3>Jogos Agendados ({games.length})</h3>
              {games.length === 0 ? (
                <p className="no-games">Nenhum jogo agendado</p>
              ) : (
                <div className="games-admin-list">
                  {games.map(game => (
                    <div key={game.id} className="games-admin-card">
                      <div className="games-admin-header" onClick={() => setExpandedGames(prev => ({
                        ...prev,
                        [game.id]: !prev[game.id]
                      }))}>
                        <h4>{game.titulo}</h4>
                        <span className="expand-icon">{expandedGames[game.id] ? '▼' : '▶'}</span>
                      </div>
                      {expandedGames[game.id] && (
                        <>
                          <div className="games-admin-fields">
                            <div className="form-group">
                              <label>Nome do Jogo</label>
                              <input
                                type="text"
                                value={game.titulo}
                                onChange={(e) => handleEditGame(game.id, 'title', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Duração</label>
                              <input
                                type="text"
                                placeholder="Ex: 8 horas"
                                value={game.duracao || ''}
                                onChange={(e) => handleEditGame(game.id, 'duration', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Data do Jogo</label>
                              <input type="date" value={game.data} onChange={(e) => handleEditGame(game.id, 'date', e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Abertura dos Portões</label>
                              <input
                                type="time"
                                value={game.aberturaPortoes || ''}
                                onChange={(e) => handleEditGame(game.id, 'gateTime', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Começo do Jogo</label>
                              <input type="time" value={game.horario} onChange={(e) => handleEditGame(game.id, 'time', e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label>Valor (R$)</label>
                              <input
                                type="number"
                                placeholder="Ex: 150.00"
                                value={game.valor || ''}
                                onChange={(e) => handleEditGame(game.id, 'value', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>URL do Local do Jogo</label>
                              <input
                                type="text"
                                placeholder="Ex: https://maps.google.com/... ou endereço"
                                value={game.local}
                                onChange={(e) => handleEditGame(game.id, 'location', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="games-admin-meta">
                            <span>Confirmados (pagos): {confirmedPlayers}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            <p className="times-count">Total de times cadastrados: <strong>{squads.length}</strong></p>
            
            <div className="times-search">
              <input
                type="text"
                placeholder="Pesquisar time..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="times-admin-list">
              {squads
                .filter(squad => squad.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(squad => (
                  <div key={squad.id} className="times-admin-card-collapsible">
                    <div
                      className="times-admin-header"
                      onClick={() => setExpandedSquads({ ...expandedSquads, [squad.id]: !expandedSquads[squad.id] })}
                    >
                      <div className="times-admin-title">
                        <span className="expand-icon">{expandedSquads[squad.id] ? '▼' : '▶'}</span>
                        <h3>{squad.nome}</h3>
                      </div>
                      <div className="times-admin-meta">
                        <span>{squad.qtdOperadores || 0} integrantes</span>
                        <span>Pontos: {squad.pontuacaoTotal || 0}</span>
                      </div>
                    </div>
                    
                    {expandedSquads[squad.id] && (
                      <div className="times-admin-content">
                        <div className="times-admin-fields">
                          <div className="points-editor">
                            <label>Pontuação:</label>
                            <div className="points-input-group">
                              <input
                                type="number"
                                value={squad.pontuacaoTotal || 0}
                                onChange={(e) => {
                                  const updated = squads.map(s =>
                                    s.id === squad.id ? { ...s, pontuacaoTotal: parseInt(e.target.value) || 0 } : s
                                  );
                                  setSquads(updated);
                                }}
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
                                    setSuccess('Pontuação atualizada!');
                                    setTimeout(() => setSuccess(''), 3000);
                                  }).catch(err => {
                                    setError(err.message || 'Erro ao atualizar');
                                  });
                                }}
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                          
                          <div className="members-section">
                            <h4>Integrantes ({squad.qtdOperadores || 0})</h4>
                            <div className="members-grid">
                              {players
                                .filter(p => p.squadNome === squad.nome || p.squadId === squad.id)
                                .map(member => (
                                  <div key={member.id} className="member-badge">
                                    <strong>{member.nickname}</strong>
                                    <p>{member.nomeCompleto}</p>
                                  </div>
                                ))}
                            </div>
                            {players.filter(p => p.squadNome === squad.nome || p.squadId === squad.id).length === 0 && (
                              <p className="no-members">Nenhum integrante neste time</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="admin-section">
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          <div className="admin-panel">
            <h2>Gerenciamento de Logística</h2>
            
            <div className="logistics-section">
              <h3>Equipamentos para Aluguel</h3>
              <div className="logistics-form">
                <input
                  type="text"
                  placeholder="Nome do equipamento"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Valor de aluguel (R$)"
                  value={newEquipment.rentalPrice}
                  onChange={(e) => setNewEquipment({ ...newEquipment, rentalPrice: e.target.value })}
                />
                <button
                  className="success"
                  onClick={() => {
                    if (newEquipment.name && newEquipment.rentalPrice) {
                      setEquipments([...equipments, { id: Date.now(), ...newEquipment }]);
                      setNewEquipment({ name: '', rentalPrice: '' });
                      setSuccess('Equipamento adicionado!');
                      setTimeout(() => setSuccess(''), 2000);
                    }
                  }}
                >
                  + Adicionar Equipamento
                </button>
              </div>
              {equipments.length > 0 && (
                <div className="logistics-list">
                  {equipments.map((eq) => (
                    <div key={eq.id} className="logistics-item">
                      <div>
                        <strong>{eq.name}</strong>
                        <p>Aluguel: R$ {eq.rentalPrice}/dia</p>
                      </div>
                      <button
                        className="danger"
                        onClick={() => setEquipments(equipments.filter(e => e.id !== eq.id))}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="logistics-section">
              <h3>Locais de Jogos</h3>
              <div className="logistics-form">
                <input
                  type="text"
                  placeholder="Nome do local"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="URL do Google Maps ou endereço"
                  value={newLocation.url}
                  onChange={(e) => setNewLocation({ ...newLocation, url: e.target.value })}
                />
                <button
                  className="success"
                  onClick={() => {
                    if (newLocation.name && newLocation.url) {
                      setGameLocations([...gameLocations, { id: Date.now(), ...newLocation }]);
                      setNewLocation({ name: '', url: '' });
                      setSuccess('Local adicionado!');
                      setTimeout(() => setSuccess(''), 2000);
                    }
                  }}
                >
                  + Adicionar Local
                </button>
              </div>
              {gameLocations.length > 0 && (
                <div className="logistics-list">
                  {gameLocations.map((loc) => (
                    <div key={loc.id} className="logistics-item">
                      <div>
                        <strong>{loc.name}</strong>
                        <p>
                          <a href={loc.url} target="_blank" rel="noreferrer">Abrir mapa</a>
                        </p>
                      </div>
                      <button
                        className="danger"
                        onClick={() => setGameLocations(gameLocations.filter(l => l.id !== loc.id))}
                      >
                        Remover
                      </button>
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
