import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Crosshair, Trophy, Shield, User, ChevronRight } from 'lucide-react';
import { times, operadores } from '../services/data';

const PerfilTime: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const time = times.find((t) => t.id === id);

  if (!time) {
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

  const membros = operadores.filter((op) => op.squad_id === time.id);
  const lider = operadores.find((op) => op.id === time.lider_id);

  return (
    <div className="space-y-8">
      {/* Navegação */}
      <Link to="/times" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-tactical-amber transition-colors uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Voltar às Unidades
      </Link>

      {/* Header */}
      <div className="bg-armor-gray border border-white/10 p-1">
        <div className="bg-ops-black/50 p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-[120px] font-header font-bold text-white/5 leading-none -mr-4 -mt-8 select-none">
            {time.tag}
          </div>

          <div className="relative z-10 flex items-start gap-6">
            <div className="w-20 h-20 border-2 border-tactical-amber/50 flex items-center justify-center bg-zinc-900 shrink-0">
              <Shield className="w-10 h-10 text-tactical-amber" />
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Perfil de Unidade</div>
              <h1 className="font-header text-4xl font-bold text-white uppercase tracking-wider">{time.nome}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-mono text-xs text-tactical-amber uppercase tracking-widest">[{time.tag}]</span>
                {lider && (
                  <span className="font-mono text-xs text-zinc-500 uppercase">
                    Líder: <span className="text-vision-green">{lider.apelido}</span>
                  </span>
                )}
              </div>
            </div>
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
          <p className="font-mono text-sm text-zinc-300 leading-relaxed border-l-2 border-tactical-amber/30 pl-4">
            {time.descricao}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Users className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Membros</div>
            <div className="font-header text-3xl font-bold text-white">{time.membros_count}</div>
          </div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Trophy className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Pontos</div>
            <div className="font-header text-3xl font-bold text-tactical-amber">{time.pontos_totais}</div>
          </div>
        </div>
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-5 text-center">
            <Crosshair className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Operações</div>
            <div className="font-header text-3xl font-bold text-white">{time.jogos_participados}</div>
          </div>
        </div>
      </div>

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
          Registro de Unidade · PLAY12 TACTICAL SYSTEMS · ID: {time.tag}-0{time.id.replace(/\D/g,'')}
        </div>
      </div>
    </div>
  );
};

export default PerfilTime;
