import React, { useState, useEffect } from 'react';
import { Search, Shield, ChevronDown, ChevronUp, Users, Star } from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

interface SquadMember {
  id: number;
  role: string;
  operator: {
    id: number;
    nickname: string;
    fullName: string;
    engagementScore: number;
  };
}

interface Squad {
  id: number;
  name: string;
  tag: string | null;
  totalMembers: number;
  leader: { id: number; nickname: string; fullName: string } | null;
  members: SquadMember[];
  ranking: { score: number; wins: number; losses: number } | null;
}

const DashboardTimes: React.FC = () => {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSquads = async (q?: string) => {
    try {
      const url = q ? `${API}/admin/squads?search=${encodeURIComponent(q)}` : `${API}/admin/squads`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSquads(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchSquads(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header count */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
          Total de times registrados: <span className="text-tactical-amber font-bold">{squads.length}</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-ops-black/70 border border-white/10 pl-10 pr-4 py-2.5 font-mono text-sm text-white placeholder-zinc-600 focus:border-tactical-amber/50 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-sm text-zinc-500 uppercase animate-pulse">
          Carregando times...
        </div>
      ) : (
        <div className="space-y-2">
          {squads.map((squad) => (
            <div key={squad.id} className="bg-armor-gray border border-white/10 p-1">
              <button
                onClick={() => toggleExpand(squad.id)}
                className="w-full bg-ops-black/50 px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <div className="text-left">
                    <span className="font-mono text-sm text-white font-bold">
                      {squad.tag ? `[${squad.tag}] ` : ''}{squad.name}
                    </span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        <Users className="w-3 h-3 inline mr-1" />{squad.totalMembers} membros
                      </span>
                      {squad.ranking && (
                        <span className="font-mono text-[10px] text-tactical-amber uppercase">
                          <Star className="w-3 h-3 inline mr-1" />{squad.ranking.score} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {expanded.has(squad.id) ? (
                  <ChevronUp className="w-4 h-4 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                )}
              </button>

              {expanded.has(squad.id) && (
                <div className="bg-ops-black/30 border-t border-white/5 p-4 space-y-3">
                  {/* Leader */}
                  {squad.leader && (
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      Líder: <span className="text-hud-blue">{squad.leader.nickname}</span>
                      <span className="text-zinc-600 ml-2">({squad.leader.fullName})</span>
                    </div>
                  )}

                  {/* Ranking */}
                  {squad.ranking && (
                    <div className="flex gap-4 font-mono text-[10px] text-zinc-500 uppercase">
                      <span>Vitórias: <span className="text-vision-green">{squad.ranking.wins}</span></span>
                      <span>Derrotas: <span className="text-critical-red">{squad.ranking.losses}</span></span>
                      <span>Score: <span className="text-tactical-amber">{squad.ranking.score}</span></span>
                    </div>
                  )}

                  {/* Members table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          {['APELIDO', 'NOME', 'FUNÇÃO', 'PONTOS'].map((h) => (
                            <th key={h} className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest px-3 py-2 text-left border-b border-white/5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {squad.members.map((m) => (
                          <tr key={m.id} className="border-b border-white/[0.03]">
                            <td className="px-3 py-2 font-mono text-xs text-white">{m.operator.nickname}</td>
                            <td className="px-3 py-2 font-mono text-xs text-zinc-400">{m.operator.fullName}</td>
                            <td className="px-3 py-2">
                              <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 ${
                                m.role === 'LEADER' ? 'bg-hud-blue/20 text-hud-blue' : 'bg-zinc-800 text-zinc-500'
                              }`}>
                                {m.role === 'LEADER' ? 'Líder' : 'Membro'}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-tactical-amber">{m.operator.engagementScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {squads.length === 0 && (
            <div className="text-center py-8 font-mono text-xs text-zinc-600 uppercase border border-dashed border-white/10">
              Nenhum time encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardTimes;
