import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Target, Activity, Calendar, Mail, Users, ArrowLeft, Crosshair, Zap, Award, UserPlus, CheckCircle, Plus, X, Search, ChevronRight, AlertTriangle } from 'lucide-react';
import { operadores } from '../services/data';
import { times } from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { Operador } from '../types';

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return '--';
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  }
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const PerfilOperador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [alistamentoPendente, setAlistamentoPendente] = useState(false);
  const { operator: authOperator } = useAuth();
  const isOwnProfile = authOperator && String(authOperator.id) === id;

  // Weapon management
  const storageKey = `bm_loadout_${id}`;
  const [weapons, setWeapons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [addingWeapon, setAddingWeapon] = useState(false);
  const [newWeapon, setNewWeapon] = useState('');

  // Unit search
  const [searchingUnit, setSearchingUnit] = useState(false);
  const [unitSearch, setUnitSearch] = useState('');
  const [unitResults, setUnitResults] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const saveWeapon = () => {
    if (!newWeapon.trim()) return;
    const updated = [...weapons, newWeapon.trim()];
    setWeapons(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewWeapon('');
    setAddingWeapon(false);
  };

  const removeWeapon = (idx: number) => {
    const updated = weapons.filter((_, i) => i !== idx);
    setWeapons(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const searchUnits = async (term: string) => {
    setUnitSearch(term);
    if (term.length < 2) { setUnitResults([]); return; }
    setLoadingUnits(true);
    try {
      const res = await fetch(`http://localhost:3333/api/v1/squads?limit=50`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const squads = json.data || json;
      setUnitResults(
        (Array.isArray(squads) ? squads : []).filter((s: any) =>
          s.name.toLowerCase().includes(term.toLowerCase()) ||
          (s.tag && s.tag.toLowerCase().includes(term.toLowerCase()))
        ).slice(0, 6)
      );
    } catch { setUnitResults([]); }
    finally { setLoadingUnits(false); }
  };

  const requestJoin = async (squadId: number, squadName: string) => {
    try {
      const res = await fetch(`http://localhost:3333/api/v1/squads/${squadId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ operatorId: authOperator!.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Falha ao solicitar ingresso');
      }
      showToast('success', `Você ingressou na unidade "${squadName}"!`);
      setSearchingUnit(false);
      setUnitSearch('');
      setUnitResults([]);
    } catch (err: any) {
      showToast('error', err?.message || 'Erro ao solicitar ingresso na unidade.');
    }
  };

  // Try mock data first, then check if it's the logged-in user
  let operador: Operador | undefined = operadores.find(op => op.id === id);

  // If not found in mock data but matches logged-in user, build from auth data
  if (!operador && authOperator && String(authOperator.id) === id) {
    operador = {
      id: String(authOperator.id),
      apelido: authOperator.nickname,
      nome_completo: authOperator.fullName || authOperator.nickname,
      email: authOperator.email,
      patente: 'Recruta',
      squad_id: null,
      jogos_participados: 0,
      pontos: 0,
      data_cadastro: new Date().toISOString(),
      loadout: [],
      status: 'ONLINE' as const,
    };
  }

  if (!operador) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Crosshair className="w-16 h-16 text-critical-red animate-pulse" />
        <h2 className="font-header text-2xl font-bold text-white uppercase tracking-widest">Operador Não Encontrado</h2>
        <p className="font-mono text-xs text-zinc-500 uppercase">ID de registro inválido ou removido da base</p>
        <Link to="/operadores" className="mt-4 flex items-center gap-2 text-tactical-amber font-mono text-sm hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> RETORNAR AO DOSSIÊ
        </Link>
      </div>
    );
  }

  const squad = operador.squad_id ? times.find(t => t.id === operador.squad_id) : null;

  const statusConfig = {
    ONLINE: { label: 'ONLINE', color: 'text-vision-green', dot: 'bg-vision-green shadow-[0_0_12px_#00FF94]' },
    EM_COMBATE: { label: 'EM COMBATE', color: 'text-critical-red', dot: 'bg-critical-red shadow-[0_0_12px_#FF2A2A] animate-pulse' },
    OFFLINE: { label: 'OFFLINE', color: 'text-zinc-500', dot: 'bg-zinc-600' },
  };

  const status = statusConfig[operador.status];

  const handleAlistamento = () => {
    // TODO: Quando o sistema de notificações for implementado, enviar para o líder do squad
    setAlistamentoPendente(true);
    alert(`Solicitação de alistamento enviada para o líder(a) de ${squad?.nome}. Você receberá uma notificação em breve.`);
    
    // Simular resetar após alguns segundos
    setTimeout(() => setAlistamentoPendente(false), 3000);
  };

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <Link to="/operadores" className="inline-flex items-center gap-2 text-zinc-500 hover:text-tactical-amber font-mono text-xs uppercase tracking-widest transition-colors group">
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
        OPERADORES // {operador.apelido}
      </Link>

      {/* Header do Perfil */}
      <div className="relative bg-armor-gray border border-white/10 overflow-hidden">
        
        {/* Número decorativo */}
        <div className="absolute -right-8 -top-8 text-[200px] font-header font-bold text-white/[0.03] select-none pointer-events-none leading-none">
          {operador.apelido.substring(0, 2)}
        </div>

        <div className="flex flex-col md:flex-row">
          
          {/* Status Strip */}
          <div className="md:w-16 bg-black flex items-center justify-center border-r border-white/10 py-4 md:py-0">
            <div className="md:-rotate-90 whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
              {operador.patente}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-grow p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              
              {/* Avatar + Info */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-zinc-800 flex items-center justify-center border border-white/10 relative flex-shrink-0">
                  <Shield className="w-12 h-12 text-zinc-600" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${status.dot} border-2 border-armor-gray`}></div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${status.color} border-current`}>
                      {status.label}
                    </div>
                  </div>
                  <h1 className="font-header text-4xl font-bold text-white leading-none mb-1">{operador.apelido}</h1>
                  <p className="font-mono text-sm text-zinc-400 uppercase">{operador.nome_completo}</p>
                  <div className="text-[10px] font-mono text-tactical-amber uppercase mt-2 tracking-wider">
                    PATENTE: {operador.patente}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-armor-gray border border-white/10 p-5 relative clip-corner-br">
          <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3 text-hud-blue" /> XP Total
          </div>
          <div className="text-2xl font-bold text-hud-blue font-mono">{operador.pontos}</div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-5 relative clip-corner-br">
          <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
            <Target className="w-3 h-3 text-vision-green" /> Missões
          </div>
          <div className="text-2xl font-bold text-vision-green font-mono">{operador.jogos_participados}</div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-5 relative clip-corner-br">
          <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
            <Calendar className="w-3 h-3 text-tactical-amber" /> Alistamento
          </div>
          <div className="text-lg font-bold text-tactical-amber font-mono">{formatDateBR(operador.data_cadastro)}</div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-5 relative clip-corner-br">
          <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
            <Activity className="w-3 h-3 text-white" /> Média XP/Missão
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {operador.jogos_participados > 0 ? Math.round(operador.pontos / operador.jogos_participados) : 0}
          </div>
        </div>
      </div>

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

      {/* Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Arsenal */}
        <div className="bg-armor-gray border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-tactical-amber" />
              <h3 className="font-header text-sm font-bold text-white uppercase tracking-widest">Arsenal Registrado</h3>
            </div>
            {isOwnProfile && !addingWeapon && (
              <button
                onClick={() => setAddingWeapon(true)}
                className="flex items-center gap-1.5 text-tactical-amber font-mono text-[10px] uppercase tracking-wider hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            )}
          </div>

          {/* Add weapon form */}
          {addingWeapon && (
            <div className="mb-4 p-3 border border-tactical-amber/30 bg-tactical-amber/5 space-y-3">
              <div className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest">Novo Armamento</div>
              <input
                type="text"
                value={newWeapon}
                onChange={e => setNewWeapon(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveWeapon()}
                placeholder="Ex: M4A1, AK-47, Glock 17..."
                className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white font-mono text-sm focus:border-tactical-amber focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveWeapon}
                  disabled={!newWeapon.trim()}
                  className="flex-1 bg-tactical-amber text-black py-2 font-mono text-xs uppercase font-bold hover:bg-white transition-all disabled:opacity-30 clip-corner-br"
                >
                  Registrar
                </button>
                <button
                  onClick={() => { setAddingWeapon(false); setNewWeapon(''); }}
                  className="px-4 py-2 border border-white/10 text-zinc-400 font-mono text-xs uppercase hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Weapon list */}
          {(() => {
            const allWeapons = operador.loadout.length > 0 ? operador.loadout : weapons;
            if (allWeapons.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <Crosshair className="w-10 h-10 text-zinc-700" />
                  <p className="font-mono text-xs text-zinc-500 uppercase">Nenhum armamento registrado</p>
                  {isOwnProfile && !addingWeapon && (
                    <button
                      onClick={() => setAddingWeapon(true)}
                      className="mt-2 flex items-center gap-2 bg-tactical-amber/10 border border-tactical-amber/30 text-tactical-amber px-4 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-tactical-amber hover:text-black transition-all clip-corner-br"
                    >
                      <Plus className="w-4 h-4" /> Incluir Armamento
                    </button>
                  )}
                </div>
              );
            }
            return (
              <div className="space-y-3">
                {allWeapons.map((arma, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-black/30 p-3 border-l-2 border-tactical-amber/50 group">
                    <div className="text-[10px] font-mono text-zinc-600 w-6">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="font-mono text-sm text-zinc-200">{arma}</div>
                    <div className="text-[9px] font-mono text-zinc-600 ml-auto uppercase flex items-center gap-2">
                      {idx === 0 ? 'PRIMÁRIA' : idx === 1 ? 'SECUNDÁRIA' : 'EXTRA'}
                      {isOwnProfile && operador.loadout.length === 0 && (
                        <button
                          onClick={() => removeWeapon(idx)}
                          className="opacity-0 group-hover:opacity-100 text-critical-red hover:text-red-400 transition-all"
                          title="Remover"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Unidade */}
        <div className="bg-armor-gray border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
            <Users className="w-4 h-4 text-tactical-amber" />
            <h3 className="font-header text-sm font-bold text-white uppercase tracking-widest">Unidade Tática</h3>
          </div>
          
          {squad ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 border border-white/20 flex items-center justify-center bg-zinc-900">
                  <Users className="w-7 h-7 text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-header text-xl font-bold text-white">{squad.nome}</h4>
                  <div className="text-[10px] font-mono text-vision-green uppercase tracking-wider">TAG: [{squad.tag}]</div>
                </div>
              </div>
              <p className="font-mono text-xs text-zinc-400 border-l-2 border-white/10 pl-3">{squad.descricao}</p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-black/30 p-2 text-center">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Membros</div>
                  <div className="font-bold text-white font-mono">{squad.membros_count}</div>
                </div>
                <div className="bg-black/30 p-2 text-center">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Pontos</div>
                  <div className="font-bold text-tactical-amber font-mono">{squad.pontos_totais}</div>
                </div>
                <div className="bg-black/30 p-2 text-center">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Ops</div>
                  <div className="font-bold text-white font-mono">{squad.jogos_participados}</div>
                </div>
              </div>

              {/* Botão de Alistamento */}
              <button
                onClick={handleAlistamento}
                disabled={alistamentoPendente}
                className={`
                  w-full mt-4 py-3 px-4 font-header font-bold uppercase tracking-widest transition-all clip-corner-br flex items-center justify-center gap-2
                  ${alistamentoPendente 
                    ? 'bg-vision-green text-black' 
                    : 'bg-tactical-amber text-black hover:bg-white'
                  }
                `}
              >
                {alistamentoPendente ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Solicitação Enviada
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Alistar-se nesta Unidade
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              {!searchingUnit ? (
                <>
                  <Shield className="w-10 h-10 text-zinc-700" />
                  <p className="font-mono text-xs text-zinc-500 uppercase">Sem vínculo a unidade</p>
                  <p className="font-mono text-[10px] text-zinc-600">Operador independente</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setSearchingUnit(true)}
                      className="mt-2 flex items-center gap-2 bg-hud-blue/10 border border-hud-blue/30 text-hud-blue px-4 py-2.5 font-mono text-xs uppercase tracking-wider hover:bg-hud-blue hover:text-black transition-all clip-corner-br"
                    >
                      <Search className="w-4 h-4" /> Procurar Unidade
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full text-left space-y-3">
                  <div className="text-[10px] font-mono text-hud-blue uppercase tracking-widest">Buscar Unidade Tática</div>
                  <div className="flex items-center bg-black/40 border border-white/10 px-3 py-2 focus-within:border-hud-blue/50 transition-colors">
                    <Search className="w-4 h-4 text-zinc-500 mr-2" />
                    <input
                      type="text"
                      value={unitSearch}
                      onChange={e => searchUnits(e.target.value)}
                      placeholder="Nome ou tag da unidade..."
                      className="bg-transparent border-none outline-none text-white w-full font-mono text-sm placeholder:text-zinc-600"
                      autoFocus
                    />
                    <button onClick={() => { setSearchingUnit(false); setUnitSearch(''); setUnitResults([]); }} className="text-zinc-500 hover:text-white ml-2">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {loadingUnits && (
                    <div className="font-mono text-[10px] text-zinc-500 uppercase animate-pulse py-2">Buscando unidades...</div>
                  )}

                  {unitResults.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {unitResults.map((sq: any) => (
                        <div key={sq.id} className="flex items-center justify-between p-3 bg-black/30 border border-white/5 hover:border-hud-blue/30 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center bg-zinc-900">
                              <Shield className="w-4 h-4 text-zinc-500 group-hover:text-hud-blue transition-colors" />
                            </div>
                            <div>
                              <div className="font-header text-sm font-bold text-white group-hover:text-hud-blue transition-colors">{sq.name}</div>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                                {sq.tag && <span className="text-tactical-amber">[{sq.tag}]</span>}
                                <span>{sq._count?.members ?? sq.totalMembers ?? '?'} membros</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => requestJoin(sq.id, sq.name)}
                            className="flex items-center gap-1.5 bg-hud-blue/10 border border-hud-blue/30 text-hud-blue px-3 py-1.5 font-mono text-[10px] uppercase hover:bg-hud-blue hover:text-black transition-all"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Ingressar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {unitSearch.length >= 2 && !loadingUnits && unitResults.length === 0 && (
                    <div className="text-center py-4">
                      <p className="font-mono text-xs text-zinc-500 uppercase">Nenhuma unidade encontrada</p>
                      <Link to="/times/criar" className="inline-flex items-center gap-2 mt-3 text-tactical-amber font-mono text-xs uppercase hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Criar Nova Unidade
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black border border-white/10 px-6 py-3 flex flex-wrap justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
        <span>ID: {operador.id}</span>
        <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {operador.email}</span>
        <span>REGISTRO: {formatDateBR(operador.data_cadastro)}</span>
      </div>

    </div>
  );
};

export default PerfilOperador;
