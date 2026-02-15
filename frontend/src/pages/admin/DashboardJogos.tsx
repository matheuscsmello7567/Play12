import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Save, Trash2, Calendar, Clock, MapPin, DollarSign, Tag } from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

const GAME_TYPES = ['MILSIM', 'CQB', 'WOODLAND', 'SKIRMISH', 'SCENARIO', 'CTF'] as const;
const GAME_STATUSES = ['SCHEDULED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

interface Game {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string | null;
  location: string | null;
  locationMapsUrl: string | null;
  maxPlayers: number | null;
  currentPlayers: number;
  status: string;
  gameType: string;
  registrationFee: number;
}

interface GameForm {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  locationMapsUrl: string;
  maxPlayers: string;
  gameType: string;
  registrationFee: string;
  status?: string;
}

const emptyForm: GameForm = {
  name: '',
  startDate: '',
  endDate: '',
  description: '',
  location: '',
  locationMapsUrl: '',
  maxPlayers: '',
  gameType: 'MILSIM',
  registrationFee: '',
};

const formatDateForInput = (iso: string) => {
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

const DashboardJogos: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGame, setNewGame] = useState<GameForm>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [editForms, setEditForms] = useState<Record<number, GameForm>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchGames = async () => {
    try {
      const res = await fetch(`${API}/games?limit=100`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setGames(Array.isArray(json) ? json : json.data ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreate = async () => {
    if (!newGame.name || !newGame.startDate || !newGame.endDate) {
      showToast('Preencha nome, data início e data fim.');
      return;
    }
    setCreating(true);
    try {
      const body: any = {
        name: newGame.name,
        startDate: new Date(newGame.startDate).toISOString(),
        endDate: new Date(newGame.endDate).toISOString(),
        gameType: newGame.gameType,
      };
      if (newGame.description) body.description = newGame.description;
      if (newGame.location) body.location = newGame.location;
      if (newGame.locationMapsUrl) body.locationMapsUrl = newGame.locationMapsUrl;
      if (newGame.maxPlayers) body.maxPlayers = parseInt(newGame.maxPlayers, 10);
      if (newGame.registrationFee) body.registrationFee = parseFloat(newGame.registrationFee);

      const res = await fetch(`${API}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao criar jogo');
      }
      showToast('Jogo criado com sucesso!');
      setNewGame(emptyForm);
      fetchGames();
    } catch (e: any) {
      showToast(e.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Pre-fill edit form
        const g = games.find((g) => g.id === id)!;
        setEditForms((ef) => ({
          ...ef,
          [id]: {
            name: g.name,
            startDate: formatDateForInput(g.startDate),
            endDate: formatDateForInput(g.endDate),
            description: g.description || '',
            location: g.location || '',
            locationMapsUrl: g.locationMapsUrl || '',
            maxPlayers: g.maxPlayers?.toString() || '',
            gameType: g.gameType,
            registrationFee: g.registrationFee?.toString() || '0',
            status: g.status,
          },
        }));
      }
      return next;
    });
  };

  const updateEditForm = (id: number, field: keyof GameForm, value: string) => {
    setEditForms((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleUpdate = async (id: number) => {
    const form = editForms[id];
    if (!form) return;
    setSaving(id);
    try {
      const body: any = {};
      if (form.name) body.name = form.name;
      if (form.startDate) body.startDate = new Date(form.startDate).toISOString();
      if (form.endDate) body.endDate = new Date(form.endDate).toISOString();
      if (form.description) body.description = form.description;
      if (form.location) body.location = form.location;
      if (form.locationMapsUrl) body.locationMapsUrl = form.locationMapsUrl;
      if (form.maxPlayers) body.maxPlayers = parseInt(form.maxPlayers, 10);
      if (form.registrationFee) body.registrationFee = parseFloat(form.registrationFee);
      if (form.status) body.status = form.status;

      const res = await fetch(`${API}/games/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erro ao atualizar jogo');
      showToast('Jogo atualizado!');
      fetchGames();
    } catch (e: any) {
      showToast(e.message);
    } finally {
      setSaving(null);
    }
  };

  const scheduledGames = games.filter((g) => ['SCHEDULED', 'REGISTRATION_OPEN'].includes(g.status));

  const inputClass = 'w-full bg-ops-black border border-white/10 px-3 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-tactical-amber/50 focus:outline-none';
  const labelClass = 'font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block';

  return (
    <div className="space-y-6">
      {toast && (
        <div className="bg-vision-green/20 border border-vision-green/40 px-4 py-2 font-mono text-xs text-vision-green">
          {toast}
        </div>
      )}

      {/* Create new game form */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6">
          <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest mb-5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
            Criar Novo Jogo
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Nome do Jogo</label>
              <input
                type="text"
                placeholder="OPERAÇÃO RED WINGS"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Data Início</label>
              <input
                type="datetime-local"
                value={newGame.startDate}
                onChange={(e) => setNewGame({ ...newGame, startDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Data Fim</label>
              <input
                type="datetime-local"
                value={newGame.endDate}
                onChange={(e) => setNewGame({ ...newGame, endDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tipo do Jogo</label>
              <select
                value={newGame.gameType}
                onChange={(e) => setNewGame({ ...newGame, gameType: e.target.value })}
                className={inputClass}
              >
                {GAME_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="80.00"
                value={newGame.registrationFee}
                onChange={(e) => setNewGame({ ...newGame, registrationFee: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max Jogadores</label>
              <input
                type="number"
                placeholder="40"
                value={newGame.maxPlayers}
                onChange={(e) => setNewGame({ ...newGame, maxPlayers: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Local</label>
              <input
                type="text"
                placeholder="Serra do Rola Moça, Sector 7"
                value={newGame.location}
                onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>URL do Local (Google Maps)</label>
              <input
                type="url"
                placeholder="https://google.com/maps/..."
                value={newGame.locationMapsUrl}
                onChange={(e) => setNewGame({ ...newGame, locationMapsUrl: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Descrição</label>
              <textarea
                rows={3}
                placeholder="Briefing da operação..."
                value={newGame.description}
                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                className={inputClass + ' resize-none'}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="mt-5 w-full bg-tactical-amber text-ops-black font-header text-sm font-bold uppercase tracking-widest py-3 hover:bg-tactical-amber/90 disabled:opacity-50 transition-colors"
          >
            {creating ? 'CRIANDO...' : 'CRIAR NOVO JOGO'}
          </button>
        </div>
      </div>

      {/* Scheduled games list */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <button
          onClick={() => {}}
          className="w-full bg-ops-black/50 px-4 py-3 flex items-center justify-between"
        >
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Jogos Agendados (<span className="text-tactical-amber font-bold">{scheduledGames.length}</span>)
          </span>
        </button>

        <div className="space-y-1 mt-1">
          {loading ? (
            <div className="text-center py-8 font-mono text-sm text-zinc-500 animate-pulse uppercase">
              Carregando jogos...
            </div>
          ) : scheduledGames.length === 0 ? (
            <div className="text-center py-8 font-mono text-xs text-zinc-600 uppercase">
              Nenhum jogo agendado
            </div>
          ) : (
            scheduledGames.map((game) => (
              <div key={game.id} className="bg-ops-black/30 border border-white/5">
                <button
                  onClick={() => toggleExpand(game.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <div>
                      <span className="font-mono text-sm text-white font-bold">{game.name}</span>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="font-mono text-[10px] text-zinc-500">
                          {new Date(game.startDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="font-mono text-[10px] bg-tactical-amber/20 text-tactical-amber px-1.5 py-0.5">{game.gameType}</span>
                        <span className="font-mono text-[10px] text-zinc-500">{game.status}</span>
                      </div>
                    </div>
                  </div>
                  {expanded.has(game.id) ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {expanded.has(game.id) && editForms[game.id] && (
                  <div className="border-t border-white/5 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Nome</label>
                        <input
                          type="text"
                          value={editForms[game.id].name}
                          onChange={(e) => updateEditForm(game.id, 'name', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Data Início</label>
                        <input
                          type="datetime-local"
                          value={editForms[game.id].startDate}
                          onChange={(e) => updateEditForm(game.id, 'startDate', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Data Fim</label>
                        <input
                          type="datetime-local"
                          value={editForms[game.id].endDate}
                          onChange={(e) => updateEditForm(game.id, 'endDate', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Status</label>
                        <select
                          value={editForms[game.id].status}
                          onChange={(e) => updateEditForm(game.id, 'status', e.target.value)}
                          className={inputClass}
                        >
                          {GAME_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Valor (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForms[game.id].registrationFee}
                          onChange={(e) => updateEditForm(game.id, 'registrationFee', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>URL do Local</label>
                        <input
                          type="url"
                          value={editForms[game.id].locationMapsUrl}
                          onChange={(e) => updateEditForm(game.id, 'locationMapsUrl', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdate(game.id)}
                      disabled={saving === game.id}
                      className="mt-4 flex items-center gap-2 bg-tactical-amber/20 border border-tactical-amber/40 text-tactical-amber font-mono text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-tactical-amber/30 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      {saving === game.id ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardJogos;
