import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, CreditCard, Shield, ExternalLink, X, Search,
  Plus, Trash2, User, ChevronDown, ChevronRight,
} from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

/* ── Types ── */

interface NextGame {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  locationMapsUrl: string | null;
  gameType: string;
  currentPlayers: number;
  registrationFee: number;
  gameSquads: { squad: { id: number; name: string; tag: string | null; totalMembers: number } }[];
  gameOperators: { operator: { id: number; nickname: string; fullName: string | null; avatarUrl: string | null } }[];
}

interface Stats {
  totalOperators: number;
  activeOperators: number;
  confirmedPayments: number;
  activeSquads: number;
  nextGame: NextGame | null;
}

interface OperatorItem {
  id: number;
  nickname: string;
  fullName: string | null;
  avatarUrl: string | null;
}

interface SquadItem {
  id: number;
  name: string;
  tag: string | null;
  totalMembers: number;
  leader: { id: number; nickname: string } | null;
  members: { operator: OperatorItem }[];
}

interface Props {
  stats: Stats | null;
  onRefresh: () => void;
}

type ModalTab = 'operadores' | 'unidades';

/* ── Component ── */

const DashboardNextGame: React.FC<Props> = ({ stats, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('unidades');

  // Squads
  const [allSquads, setAllSquads] = useState<SquadItem[]>([]);
  const [expandedSquad, setExpandedSquad] = useState<number | null>(null);

  // Operators (for "operadores" tab)
  const [allOperators, setAllOperators] = useState<OperatorItem[]>([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* ── Data fetching ── */

  const fetchSquads = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const url = q
        ? `${API}/admin/squads?search=${encodeURIComponent(q)}`
        : `${API}/admin/squads`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) setAllSquads(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  const fetchOperators = useCallback(async (q = '') => {
    setLoading(true);
    try {
      let url = `${API}/admin/operators?page=1&limit=50`;
      if (q) url += `&search=${encodeURIComponent(q)}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setAllOperators(json.data ?? []);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  // On modal open or tab change
  useEffect(() => {
    if (!showModal) return;
    setSearch('');
    if (modalTab === 'unidades') fetchSquads();
    else fetchOperators();
  }, [showModal, modalTab, fetchSquads, fetchOperators]);

  // Debounced search
  useEffect(() => {
    if (!showModal) return;
    const timeout = setTimeout(() => {
      if (modalTab === 'unidades') fetchSquads(search);
      else fetchOperators(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, showModal, modalTab, fetchSquads, fetchOperators]);

  /* ── Registered sets ── */

  const registeredSquadIds = new Set(stats?.nextGame?.gameSquads?.map(gs => gs.squad.id) ?? []);
  const registeredOpIds = new Set(stats?.nextGame?.gameOperators?.map(go => go.operator.id) ?? []);

  /* ── Actions ── */

  const handleSquadRegister = async (squadId: number) => {
    if (!stats?.nextGame) return;
    setActionLoading(`squad-${squadId}`);
    try {
      const res = await fetch(`${API}/games/${stats.nextGame.id}/register/${squadId}`, {
        method: 'POST', credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao inscrever unidade');
      }
      showToast('Unidade inscrita com sucesso!');
      onRefresh();
    } catch (e: any) { showToast(e.message); }
    finally { setActionLoading(null); }
  };

  const handleSquadUnregister = async (squadId: number) => {
    if (!stats?.nextGame) return;
    setActionLoading(`squad-${squadId}`);
    try {
      const res = await fetch(`${API}/games/${stats.nextGame.id}/register/${squadId}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao remover unidade');
      }
      showToast('Unidade removida do evento.');
      onRefresh();
    } catch (e: any) { showToast(e.message); }
    finally { setActionLoading(null); }
  };

  const handleOpRegister = async (operatorId: number) => {
    if (!stats?.nextGame) return;
    setActionLoading(`op-${operatorId}`);
    try {
      const res = await fetch(`${API}/games/${stats.nextGame.id}/register-operator/${operatorId}`, {
        method: 'POST', credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao inscrever operador');
      }
      showToast('Operador inscrito com sucesso!');
      onRefresh();
    } catch (e: any) { showToast(e.message); }
    finally { setActionLoading(null); }
  };

  const handleOpUnregister = async (operatorId: number) => {
    if (!stats?.nextGame) return;
    setActionLoading(`op-${operatorId}`);
    try {
      const res = await fetch(`${API}/games/${stats.nextGame.id}/register-operator/${operatorId}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao remover operador');
      }
      showToast('Operador removido do evento.');
      onRefresh();
    } catch (e: any) { showToast(e.message); }
    finally { setActionLoading(null); }
  };

  /* ── Render ── */

  if (!stats) {
    return (
      <div className="text-center py-12 font-mono text-sm text-zinc-500 uppercase animate-pulse">
        Carregando dados...
      </div>
    );
  }

  const confirmedSquads = stats.nextGame?.gameSquads?.length ?? 0;
  const totalPlayersInSquads = stats.nextGame?.gameSquads?.reduce((sum, gs) => sum + gs.squad.totalMembers, 0) ?? 0;
  const individualOps = stats.nextGame?.gameOperators?.length ?? 0;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="bg-vision-green/20 border border-vision-green/40 px-4 py-2 font-mono text-xs text-vision-green">
          {toast}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Jogadores', value: stats.activeOperators, icon: Users, color: 'text-tactical-amber' },
          { label: 'Confirmados (pagos)', value: stats.confirmedPayments, icon: CreditCard, color: 'text-tactical-amber' },
          { label: 'Unidades Inscritas', value: confirmedSquads, icon: Shield, color: 'text-tactical-amber' },
          { label: 'Operadores Avulsos', value: individualOps, icon: User, color: 'text-hud-blue' },
        ].map((s, i) => (
          <div key={i} className="bg-armor-gray border border-white/10 p-1">
            <div className="bg-ops-black/50 p-5">
              <div className="flex items-center gap-3">
                <s.icon className="w-5 h-5 text-zinc-500" />
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider">{s.label}</div>
              </div>
              <div className={`font-header text-4xl font-bold mt-2 ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Next game */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6">
          <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
            Próximo Jogo
          </div>

          {stats.nextGame ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-header text-2xl font-bold text-white uppercase">{stats.nextGame.name}</h3>
                  <div className="flex items-center gap-4 mt-2 font-mono text-xs text-zinc-400">
                    <span>Data: <span className="text-white">{new Date(stats.nextGame.startDate).toLocaleDateString('pt-BR')}</span></span>
                    <span>Horário: <span className="text-white">{new Date(stats.nextGame.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span></span>
                    {stats.nextGame.locationMapsUrl && (
                      <a href={stats.nextGame.locationMapsUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-hud-blue hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" /> Abrir no mapa
                      </a>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-tactical-amber/20 border border-tactical-amber/40 text-tactical-amber px-3 py-1 uppercase tracking-wider">
                  {stats.nextGame.gameType}
                </span>
              </div>

              {stats.nextGame.registrationFee > 0 && (
                <div className="font-mono text-xs text-zinc-500">
                  Valor: <span className="text-tactical-amber font-bold">R$ {stats.nextGame.registrationFee.toFixed(2)}</span>
                </div>
              )}

              {/* Registered squads */}
              {confirmedSquads > 0 && (
                <div className="border-t border-white/5 pt-3">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                    Unidades inscritas ({confirmedSquads}) · {totalPlayersInSquads} jogadores
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.nextGame.gameSquads.map(gs => (
                      <div key={gs.squad.id} className="flex items-center gap-1.5 font-mono text-[10px] bg-zinc-800 border border-white/10 px-2 py-1 text-zinc-300">
                        <Shield className="w-3 h-3 text-tactical-amber" />
                        <span>{gs.squad.tag ? `[${gs.squad.tag}] ` : ''}{gs.squad.name} ({gs.squad.totalMembers})</span>
                        <button
                          onClick={() => handleSquadUnregister(gs.squad.id)}
                          disabled={actionLoading === `squad-${gs.squad.id}`}
                          className="text-critical-red/60 hover:text-critical-red transition-colors ml-1"
                          title="Remover do evento"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registered individual operators */}
              {individualOps > 0 && (
                <div className="border-t border-white/5 pt-3">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                    Operadores avulsos ({individualOps})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.nextGame.gameOperators.map(go => (
                      <div key={go.operator.id} className="flex items-center gap-1.5 font-mono text-[10px] bg-zinc-800 border border-white/10 px-2 py-1 text-zinc-300">
                        <User className="w-3 h-3 text-hud-blue" />
                        <span>{go.operator.nickname}</span>
                        <button
                          onClick={() => handleOpUnregister(go.operator.id)}
                          disabled={actionLoading === `op-${go.operator.id}`}
                          className="text-critical-red/60 hover:text-critical-red transition-colors ml-1"
                          title="Remover do evento"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="border-2 border-dashed border-tactical-amber/30 p-4 text-center mt-4 cursor-pointer hover:border-tactical-amber/60 hover:bg-tactical-amber/5 transition-all"
                onClick={() => setShowModal(true)}
              >
                <span className="font-mono text-sm text-tactical-amber hover:text-white transition-colors uppercase tracking-wider font-bold">
                  + Incluir Jogadores
                </span>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-zinc-600 uppercase text-center py-8 border border-dashed border-white/10">
              Nenhum jogo agendado
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════ Modal ══════════════════════ */}
      {showModal && stats.nextGame && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-armor-gray border border-white/10 w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-header text-lg font-bold text-white uppercase">Incluir Jogadores</h2>
                <div className="font-mono text-[10px] text-zinc-500 mt-0.5">{stats.nextGame.name}</div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Toggle switch */}
            <div className="px-6 py-3 border-b border-white/10 flex-shrink-0">
              <div className="flex bg-ops-black/70 border border-white/10 p-0.5">
                {([
                  { key: 'unidades' as ModalTab, label: 'Unidades', icon: Shield },
                  { key: 'operadores' as ModalTab, label: 'Operadores', icon: User },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setModalTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                      modalTab === tab.key
                        ? 'bg-tactical-amber text-ops-black font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-white/5 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder={modalTab === 'unidades' ? 'Buscar unidade...' : 'Buscar operador...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-ops-black/70 border border-white/10 pl-10 pr-4 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:border-tactical-amber/50 focus:outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
              {loading ? (
                <div className="text-center py-8 font-mono text-xs text-zinc-500 uppercase animate-pulse">
                  Carregando...
                </div>
              ) : modalTab === 'unidades' ? (
                /* ─── Unidades Tab ─── */
                allSquads.length === 0 ? (
                  <div className="text-center py-8 font-mono text-xs text-zinc-600 uppercase">Nenhuma unidade encontrada</div>
                ) : (
                  allSquads.map(squad => {
                    const isRegistered = registeredSquadIds.has(squad.id);
                    const isExpanded = expandedSquad === squad.id;

                    return (
                      <div key={squad.id} className="border border-white/5 overflow-hidden">
                        {/* Squad row */}
                        <div className={`flex items-center justify-between p-3 transition-colors ${
                          isRegistered ? 'bg-vision-green/5 border-b border-vision-green/10' : 'bg-ops-black/30'
                        }`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => setExpandedSquad(isExpanded ? null : squad.id)}
                              className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                            >
                              {isExpanded
                                ? <ChevronDown className="w-4 h-4" />
                                : <ChevronRight className="w-4 h-4" />
                              }
                            </button>
                            <Shield className={`w-4 h-4 flex-shrink-0 ${isRegistered ? 'text-vision-green' : 'text-zinc-500'}`} />
                            <div className="min-w-0">
                              <div className="font-mono text-sm text-white truncate">
                                {squad.tag ? `[${squad.tag}] ` : ''}{squad.name}
                              </div>
                              <div className="font-mono text-[10px] text-zinc-500">
                                {squad.totalMembers} membros
                                {squad.leader && <> · Líder: {squad.leader.nickname}</>}
                              </div>
                            </div>
                          </div>

                          {isRegistered ? (
                            <button
                              onClick={() => handleSquadUnregister(squad.id)}
                              disabled={actionLoading === `squad-${squad.id}`}
                              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border border-critical-red/40 text-critical-red bg-critical-red/10 px-3 py-1.5 hover:bg-critical-red/20 disabled:opacity-50 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                              {actionLoading === `squad-${squad.id}` ? '...' : 'Remover'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSquadRegister(squad.id)}
                              disabled={actionLoading === `squad-${squad.id}`}
                              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border border-tactical-amber/40 text-tactical-amber bg-tactical-amber/10 px-3 py-1.5 hover:bg-tactical-amber/20 disabled:opacity-50 transition-colors flex-shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              {actionLoading === `squad-${squad.id}` ? '...' : 'Toda Unidade'}
                            </button>
                          )}
                        </div>

                        {/* Expanded members */}
                        {isExpanded && (
                          <div className="bg-ops-black/50 border-t border-white/5">
                            <div className="px-4 py-2 font-mono text-[10px] text-zinc-500 uppercase tracking-wider border-b border-white/5">
                              Membros da unidade
                            </div>
                            {squad.members.length === 0 ? (
                              <div className="px-4 py-3 font-mono text-[10px] text-zinc-600">Nenhum membro</div>
                            ) : (
                              squad.members.map(m => {
                                const opRegistered = registeredOpIds.has(m.operator.id);
                                return (
                                  <div
                                    key={m.operator.id}
                                    className={`flex items-center justify-between px-4 py-2 border-b border-white/5 last:border-0 transition-colors ${
                                      opRegistered ? 'bg-hud-blue/5' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      {m.operator.avatarUrl ? (
                                        <img src={m.operator.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                                          <User className="w-3 h-3 text-zinc-400" />
                                        </div>
                                      )}
                                      <div>
                                        <span className="font-mono text-xs text-white">{m.operator.nickname}</span>
                                        {m.operator.fullName && (
                                          <span className="font-mono text-[10px] text-zinc-500 ml-2">{m.operator.fullName}</span>
                                        )}
                                      </div>
                                    </div>
                                    {opRegistered ? (
                                      <button
                                        onClick={() => handleOpUnregister(m.operator.id)}
                                        disabled={actionLoading === `op-${m.operator.id}`}
                                        className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-critical-red border border-critical-red/30 bg-critical-red/10 px-2 py-1 hover:bg-critical-red/20 disabled:opacity-50 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                        {actionLoading === `op-${m.operator.id}` ? '...' : 'Remover'}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleOpRegister(m.operator.id)}
                                        disabled={actionLoading === `op-${m.operator.id}`}
                                        className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-hud-blue border border-hud-blue/30 bg-hud-blue/10 px-2 py-1 hover:bg-hud-blue/20 disabled:opacity-50 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        {actionLoading === `op-${m.operator.id}` ? '...' : 'Incluir'}
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                /* ─── Operadores Tab ─── */
                allOperators.length === 0 ? (
                  <div className="text-center py-8 font-mono text-xs text-zinc-600 uppercase">Nenhum operador encontrado</div>
                ) : (
                  allOperators.map((op: any) => {
                    const isRegistered = registeredOpIds.has(op.id);
                    return (
                      <div
                        key={op.id}
                        className={`flex items-center justify-between p-3 border transition-colors ${
                          isRegistered
                            ? 'bg-hud-blue/5 border-hud-blue/20'
                            : 'bg-ops-black/30 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {op.avatarUrl ? (
                            <img src={op.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-mono text-sm text-white">{op.nickname}</div>
                            <div className="font-mono text-[10px] text-zinc-500">
                              {op.fullName || op.email}
                              {op.squads?.length > 0 && (
                                <span className="ml-2 text-zinc-600">
                                  · {op.squads.map((s: any) => s.squad?.tag ? `[${s.squad.tag}]` : s.squad?.name).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isRegistered ? (
                          <button
                            onClick={() => handleOpUnregister(op.id)}
                            disabled={actionLoading === `op-${op.id}`}
                            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border border-critical-red/40 text-critical-red bg-critical-red/10 px-3 py-1.5 hover:bg-critical-red/20 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            {actionLoading === `op-${op.id}` ? '...' : 'Remover'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpRegister(op.id)}
                            disabled={actionLoading === `op-${op.id}`}
                            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border border-hud-blue/40 text-hud-blue bg-hud-blue/10 px-3 py-1.5 hover:bg-hud-blue/20 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            {actionLoading === `op-${op.id}` ? '...' : 'Incluir'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/10 flex-shrink-0 flex items-center justify-between">
              <div className="font-mono text-[10px] text-zinc-500">
                {confirmedSquads} unidade(s) · {individualOps} operador(es) avulso(s) · {stats.nextGame.currentPlayers} total
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-tactical-amber text-ops-black font-header text-sm font-bold uppercase tracking-widest px-8 py-2.5 hover:bg-tactical-amber/90 transition-colors"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNextGame;
