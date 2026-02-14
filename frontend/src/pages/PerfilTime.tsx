import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Crosshair, Trophy, Shield, User, ChevronRight, Edit3, Save, X, CheckCircle, AlertTriangle, Bell, UserPlus, UserX } from 'lucide-react';
import { times as mockTimes, operadores as mockOperadores } from '../services/data';
import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:3333/api/v1';

interface SquadData {
  id: number;
  name: string;
  tag: string | null;
  description: string | null;
  specialty: string;
  state: string | null;
  leaderId: number;
  totalMembers: number;
  totalGamesPlayed: number;
  totalWins: number;
  leader: { id: number; nickname: string; avatarUrl?: string | null };
  members: { joinedAt: string; operator: { id: number; nickname: string; fullName?: string; avatarUrl?: string | null; role: string; totalGames: number } }[];
  ranking?: any;
  gameSquads?: any[];
}

interface JoinRequestData {
  id: number;
  operatorId: number;
  message: string | null;
  status: string;
  createdAt: string;
  operator: { id: number; nickname: string; avatarUrl: string | null };
}

const PerfilTime: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { operator: authOperator } = useAuth();
  const [squadApi, setSquadApi] = useState<SquadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', tag: '', description: '', specialty: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequestData[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch join requests for the leader
  const fetchJoinRequests = useCallback(async () => {
    if (!id) return;
    setLoadingRequests(true);
    try {
      const res = await fetch(`${API}/squads/${id}/join-requests`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setJoinRequests(data);
      }
    } catch { /* ignore */ }
    finally { setLoadingRequests(false); }
  }, [id]);

  // First try API, then fallback to mock
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/squads/${id}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => {
        setSquadApi(data);
        setEditData({
          name: data.name,
          tag: data.tag || '',
          description: data.description || '',
          specialty: data.specialty || 'ASSALTO',
        });
      })
      .catch(() => setSquadApi(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch join requests when commander
  useEffect(() => {
    if (squadApi && authOperator && squadApi.leaderId === authOperator.id) {
      fetchJoinRequests();
    }
  }, [squadApi, authOperator, fetchJoinRequests]);

  const handleJoinRequest = async (requestId: number, accept: boolean) => {
    try {
      const endpoint = accept ? 'accept' : 'reject';
      const res = await fetch(`${API}/squads/join-requests/${requestId}/${endpoint}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao processar solicitação');
      }
      showToast('success', accept ? 'Operador aceito na unidade!' : 'Solicitação rejeitada.');
      // Refresh join requests and squad data
      fetchJoinRequests();
      fetch(`${API}/squads/${id}`, { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setSquadApi(data); });
    } catch (err: any) {
      showToast('error', err?.message || 'Erro ao processar solicitação.');
    }
  };

  // Check mock data fallback
  const mockTime = mockTimes.find((t) => t.id === id);
  const isApiSquad = !!squadApi;
  const isCommander = isApiSquad && authOperator && squadApi.leaderId === authOperator.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-mono text-sm text-zinc-500 uppercase tracking-widest animate-pulse">Carregando dados da unidade...</div>
      </div>
    );
  }

  if (!squadApi && !mockTime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-6xl font-header font-bold text-critical-red">404</div>
        <div className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Unidade não encontrada no sistema</div>
        <Link to="/times" className="mt-6 font-mono text-xs text-tactical-amber hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar ao QG
        </Link>
      </div>
    );
  }

  // Build unified data — use ?? (nullish coalescing) to avoid fallback on falsy values like 0 or ""
  const timeName = squadApi ? squadApi.name : mockTime!.nome;
  const timeTag = squadApi ? (squadApi.tag ?? 'N/A') : mockTime!.tag;
  const timeDesc = squadApi ? (squadApi.description ?? '') : mockTime!.descricao;
  const timeMembrosCount = squadApi ? (squadApi.totalMembers ?? 0) : mockTime!.membros_count;
  const timePontos = mockTime?.pontos_totais ?? 0;
  const timeOps = squadApi ? (squadApi.totalGamesPlayed ?? 0) : (mockTime?.jogos_participados ?? 0);
  const leaderName = squadApi?.leader?.nickname ?? mockOperadores.find(o => o.id === mockTime?.lider_id)?.apelido ?? 'Desconhecido';

  // Members list
  const membros = squadApi
    ? (squadApi.members ?? []).map(m => ({
        id: String(m.operator.id),
        apelido: m.operator.nickname,
        nome_completo: m.operator.fullName || m.operator.nickname,
        patente: m.operator.role === 'SQUAD_LEADER' ? 'Líder de Squad' : 'Recruta',
        status: 'ONLINE' as const,
        pontos: 0,
      }))
    : mockTime ? mockOperadores.filter(op => op.squad_id === mockTime.id) : [];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/squads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editData.name,
          tag: editData.tag || undefined,
          description: editData.description || undefined,
          specialty: editData.specialty,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Falha ao atualizar');
      }
      const updated = await res.json();
      setSquadApi(prev => prev ? { ...prev, ...updated } : prev);
      setEditing(false);
      showToast('success', 'Unidade atualizada com sucesso!');
    } catch (err: any) {
      showToast('error', err?.message || 'Erro ao atualizar unidade.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md">
          <div className={`mx-4 flex items-start gap-3 p-4 border backdrop-blur-md rounded-sm clip-corner-br ${
            toast.type === 'success'
              ? 'bg-vision-green/10 border-vision-green/40 text-vision-green'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <p className="font-mono text-sm flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Navegação */}
      <Link to="/times" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-tactical-amber transition-colors uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Voltar às Unidades
      </Link>

      {/* Header */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-[120px] font-header font-bold text-white/5 leading-none -mr-4 -mt-8 select-none">
            {editing ? editData.tag || '...' : timeTag}
          </div>

          <div className="relative z-10 flex items-start gap-6">
            <div className="w-20 h-20 border-2 border-tactical-amber/50 flex items-center justify-center bg-zinc-900 shrink-0">
              <Shield className="w-10 h-10 text-tactical-amber" />
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Perfil de Unidade</div>
              {editing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="font-header text-4xl font-bold text-white uppercase tracking-wider bg-transparent border-b border-tactical-amber/50 focus:outline-none w-full"
                />
              ) : (
                <h1 className="font-header text-4xl font-bold text-white uppercase tracking-wider">{timeName}</h1>
              )}
              <div className="flex items-center gap-4 mt-2">
                {editing ? (
                  <input
                    type="text"
                    value={editData.tag}
                    onChange={e => setEditData(prev => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                    maxLength={10}
                    placeholder="TAG"
                    className="font-mono text-xs text-tactical-amber uppercase tracking-widest bg-transparent border-b border-tactical-amber/30 focus:outline-none w-24"
                  />
                ) : (
                  <span className="font-mono text-xs text-tactical-amber uppercase tracking-widest">[{timeTag}]</span>
                )}
                <span className="font-mono text-xs text-zinc-500 uppercase">
                  Líder: <span className="text-vision-green">{leaderName}</span>
                </span>
              </div>
            </div>

            {/* Edit button for commander */}
            {isCommander && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 border border-tactical-amber/50 px-4 py-2 text-tactical-amber font-mono text-xs uppercase hover:bg-tactical-amber hover:text-black transition-all clip-corner-br"
              >
                <Edit3 className="w-4 h-4" /> Editar
              </button>
            )}
            {editing && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-tactical-amber text-black px-4 py-2 font-mono text-xs uppercase hover:bg-white transition-all clip-corner-br disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    if (squadApi) setEditData({ name: squadApi.name, tag: squadApi.tag || '', description: squadApi.description || '', specialty: squadApi.specialty });
                  }}
                  className="flex items-center gap-2 border border-white/20 px-4 py-2 text-zinc-400 font-mono text-xs uppercase hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6">
          <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
            Briefing da Unidade
          </div>
          {editing ? (
            <textarea
              value={editData.description}
              onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full font-mono text-sm text-zinc-300 leading-relaxed bg-transparent border border-white/10 p-4 focus:border-tactical-amber/50 focus:outline-none resize-none"
              placeholder="Descrição da unidade..."
            />
          ) : (
            <p className="font-mono text-sm text-zinc-300 leading-relaxed border-l-2 border-tactical-amber/30 pl-4">
              {timeDesc || 'Sem descrição registrada.'}
            </p>
          )}
          {editing && (
            <div className="mt-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Especialidade</div>
              <select
                value={editData.specialty}
                onChange={e => setEditData(prev => ({ ...prev, specialty: e.target.value }))}
                className="bg-black/40 border border-white/10 px-4 py-2 text-white font-mono text-sm focus:border-tactical-amber focus:outline-none appearance-none"
              >
                <option value="ASSALTO">Assalto</option>
                <option value="RECONHECIMENTO">Reconhecimento</option>
                <option value="SUPORTE">Suporte</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Users className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Membros</div>
            <div className="font-header text-3xl font-bold text-white">{timeMembrosCount}</div>
          </div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Trophy className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Pontos</div>
            <div className="font-header text-3xl font-bold text-tactical-amber">{timePontos}</div>
          </div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Crosshair className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Operações</div>
            <div className="font-header text-3xl font-bold text-white">{timeOps}</div>
          </div>
        </div>
      </div>

      {/* Join Requests - Commander Only */}
      {isCommander && (
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-6">
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="w-full flex items-center justify-between"
            >
              <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
                Solicitações de Ingresso
                {joinRequests.length > 0 && (
                  <span className="ml-2 bg-critical-red text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm animate-pulse">
                    {joinRequests.length}
                  </span>
                )}
              </div>
              <Bell className={`w-4 h-4 transition-colors ${joinRequests.length > 0 ? 'text-critical-red' : 'text-zinc-600'}`} />
            </button>

            {showRequests && (
              <div className="mt-4 space-y-2">
                {loadingRequests ? (
                  <div className="font-mono text-xs text-zinc-500 uppercase text-center py-4 animate-pulse">
                    Carregando solicitações...
                  </div>
                ) : joinRequests.length === 0 ? (
                  <div className="font-mono text-xs text-zinc-600 uppercase text-center py-6 border border-dashed border-white/10">
                    Nenhuma solicitação pendente
                  </div>
                ) : (
                  joinRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center bg-zinc-800">
                          {req.operator.avatarUrl ? (
                            <img src={req.operator.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-header text-sm font-bold text-white uppercase">
                            {req.operator.nickname}
                          </div>
                          <div className="font-mono text-[10px] text-zinc-500 uppercase">
                            Solicitado em {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          {req.message && (
                            <div className="font-mono text-xs text-zinc-400 mt-1 italic">"{req.message}"</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleJoinRequest(req.id, true)}
                          className="flex items-center gap-1.5 bg-vision-green/20 border border-vision-green/40 text-vision-green px-3 py-2 font-mono text-[10px] uppercase tracking-wider hover:bg-vision-green hover:text-black transition-all"
                          title="Aceitar"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Aceitar
                        </button>
                        <button
                          onClick={() => handleJoinRequest(req.id, false)}
                          className="flex items-center gap-1.5 bg-critical-red/20 border border-critical-red/40 text-critical-red px-3 py-2 font-mono text-[10px] uppercase tracking-wider hover:bg-critical-red hover:text-white transition-all"
                          title="Rejeitar"
                        >
                          <UserX className="w-3.5 h-3.5" /> Rejeitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Membros */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-6">
          <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-tactical-amber"></div>
            Efetivo da Unidade ({membros.length})
          </div>

          {membros.length === 0 ? (
            <div className="font-mono text-xs text-zinc-600 uppercase text-center py-6 border border-dashed border-white/10">
              Nenhum operador registrado nesta unidade
            </div>
          ) : (
            <div className="space-y-2">
              {membros.map((op) => (
                <Link
                  to={`/operadores/${op.id}`}
                  key={op.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 hover:border-tactical-amber/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center bg-zinc-800">
                      <User className="w-5 h-5 text-zinc-500 group-hover:text-tactical-amber transition-colors" />
                    </div>
                    <div>
                      <div className="font-header text-lg font-bold text-white group-hover:text-tactical-amber transition-colors">
                        {op.apelido}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">{op.patente}</span>
                        <span className={`font-mono text-[10px] uppercase ${
                          op.status === 'ONLINE' ? 'text-vision-green' :
                          op.status === 'EM_COMBATE' ? 'text-critical-red' :
                          'text-zinc-600'
                        }`}>
                          ● {op.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-[9px] font-mono text-zinc-500 uppercase">Pontos</div>
                      <div className="font-mono text-sm text-tactical-amber font-bold">{op.pontos}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-tactical-amber transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 pt-4">
        <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest text-center">
          Registro de Unidade · PLAY12 TACTICAL SYSTEMS · ID: {timeTag}-{id}
        </div>
      </div>
    </div>
  );
};

export default PerfilTime;
