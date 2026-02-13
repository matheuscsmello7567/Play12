import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Target, Activity, Calendar, Mail, Users, ArrowLeft, Crosshair, Zap, Award, UserPlus, CheckCircle } from 'lucide-react';
import { operadores } from '../services/data';
import { times } from '../services/data';

const formatDateBR = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

const PerfilOperador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [alistamentoPendente, setAlistamentoPendente] = useState(false);
  const operador = operadores.find(op => op.id === id);

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

      {/* Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Arsenal */}
        <div className="bg-armor-gray border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
            <Crosshair className="w-4 h-4 text-tactical-amber" />
            <h3 className="font-header text-sm font-bold text-white uppercase tracking-widest">Arsenal Registrado</h3>
          </div>
          <div className="space-y-3">
            {operador.loadout.map((arma, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/30 p-3 border-l-2 border-tactical-amber/50">
                <div className="text-[10px] font-mono text-zinc-600 w-6">{String(idx + 1).padStart(2, '0')}</div>
                <div className="font-mono text-sm text-zinc-200">{arma}</div>
                <div className="text-[9px] font-mono text-zinc-600 ml-auto uppercase">
                  {idx === 0 ? 'PRIMÁRIA' : 'SECUNDÁRIA'}
                </div>
              </div>
            ))}
          </div>
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="w-10 h-10 text-zinc-700 mb-3" />
              <p className="font-mono text-xs text-zinc-500 uppercase">Sem vínculo a unidade</p>
              <p className="font-mono text-[10px] text-zinc-600 mt-1">Operador independente</p>
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
