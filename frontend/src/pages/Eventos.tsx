import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, AlertTriangle, Users, CheckCircle, ExternalLink, Crosshair, ChevronLeft, ChevronRight, Target } from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

interface Game {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string | null;
  location: string | null;
  locationCoords: string | null;
  locationMapsUrl: string | null;
  maxPlayers: number | null;
  currentPlayers: number;
  status: string;
  gameType: string;
  registrationFee: number;
  _count?: { gameSquads: number };
}

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  SCHEDULED: { label: 'BRIEFING', style: 'border-hud-blue text-hud-blue' },
  REGISTRATION_OPEN: { label: 'INSCRIÇÕES ABERTAS', style: 'border-tactical-amber text-tactical-amber animate-pulse' },
  REGISTRATION_CLOSED: { label: 'INSCRIÇÕES ENCERRADAS', style: 'border-zinc-400 text-zinc-400' },
  IN_PROGRESS: { label: 'EM COMBATE', style: 'border-critical-red text-critical-red' },
  COMPLETED: { label: 'DEBRIEFING', style: 'border-vision-green text-vision-green' },
  CANCELLED: { label: 'ABORTADO', style: 'border-zinc-600 text-zinc-600' },
};

const canRegister = (status: string) => ['SCHEDULED', 'REGISTRATION_OPEN'].includes(status);

const Eventos: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
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
    fetchGames();
  }, []);

  // Map of "YYYY-MM-DD" → game ids for this month
  const gameDateMap = useMemo(() => {
    const map = new Map<string, Game[]>();
    games.forEach(g => {
      const d = new Date(g.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    });
    return map;
  }, [games]);

  // Filtered games
  const displayedGames = useMemo(() => {
    if (!selectedDate) return games;
    return gameDateMap.get(selectedDate) ?? [];
  }, [games, selectedDate, gameDateMap]);

  // Calendar helpers
  const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

  const calendarDays = useMemo(() => {
    const { year, month } = calMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const days: { day: number; current: boolean; key: string }[] = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      days.push({ day: d, current: false, key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        current: true,
        key: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      });
    }

    // Next month padding
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = month + 2 > 12 ? 1 : month + 2;
        const y = month + 2 > 12 ? year + 1 : year;
        days.push({ day: d, current: false, key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
      }
    }

    return days;
  }, [calMonth]);

  const today = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  }, []);

  const prevMonth = () => setCalMonth(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 });
  const nextMonth = () => setCalMonth(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div className="border-l-4 border-tactical-amber pl-6 py-2">
        <h1 className="font-header text-4xl font-bold text-white uppercase">Quadro de Missões</h1>
        <p className="font-mono text-sm text-zinc-500 uppercase mt-1">Operações ativas e histórico de combate</p>
      </div>

      {/* Tactical Calendar */}
      <div className="bg-armor-gray border border-white/10 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-ops-black/50">
          <button onClick={prevMonth} className="text-zinc-500 hover:text-tactical-amber transition-colors p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-header text-lg font-bold text-white uppercase tracking-widest">
            {MONTHS[calMonth.month]} <span className="text-tactical-amber">{calMonth.year}</span>
          </div>
          <button onClick={nextMonth} className="text-zinc-500 hover:text-tactical-amber transition-colors p-1">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-center py-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              {w}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((d, i) => {
            const hasGame = gameDateMap.has(d.key);
            const gamesOnDay = gameDateMap.get(d.key);
            const isToday = d.key === today;
            const isSelected = d.key === selectedDate;

            return (
              <button
                key={`${d.key}-${i}`}
                onClick={() => {
                  if (hasGame) setSelectedDate(isSelected ? null : d.key);
                }}
                className={`
                  relative py-3 text-center font-mono text-sm transition-all border-b border-r border-white/5
                  ${!d.current ? 'text-zinc-700' : 'text-zinc-400'}
                  ${hasGame && d.current ? 'cursor-pointer hover:bg-tactical-amber/10' : 'cursor-default'}
                  ${isSelected ? 'bg-tactical-amber/20 text-tactical-amber' : ''}
                  ${isToday && !isSelected ? 'bg-white/5' : ''}
                `}
              >
                <span className={`${isToday ? 'border-b-2 border-tactical-amber pb-0.5' : ''}`}>
                  {d.day}
                </span>
                {hasGame && d.current && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {(gamesOnDay ?? []).slice(0, 3).map((g, gi) => (
                      <div
                        key={gi}
                        className={`w-1.5 h-1.5 rounded-full ${
                          g.status === 'COMPLETED' ? 'bg-vision-green' :
                          g.status === 'CANCELLED' ? 'bg-critical-red' :
                          g.status === 'IN_PROGRESS' ? 'bg-critical-red animate-pulse' :
                          'bg-tactical-amber'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-6 py-2 border-t border-white/10 flex items-center gap-6 font-mono text-[10px] text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-tactical-amber"></span> AGENDADA</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-critical-red"></span> EM COMBATE</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-vision-green"></span> CONCLUÍDA</span>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="ml-auto text-tactical-amber hover:text-white transition-colors uppercase tracking-wider">
              Limpar filtro
            </button>
          )}
        </div>
      </div>

      {/* Filter indicator */}
      {selectedDate && (
        <div className="flex items-center gap-2 font-mono text-xs text-tactical-amber border border-tactical-amber/30 bg-tactical-amber/5 px-4 py-2">
          <Target className="w-3 h-3" />
          Exibindo operações de {selectedDate.split('-').reverse().join('/')}
          <span className="text-zinc-500">({displayedGames.length} resultado{displayedGames.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 font-mono text-sm text-zinc-500 uppercase animate-pulse">
          Carregando operações...
        </div>
      ) : games.length === 0 ? (
        <div className="bg-armor-gray border border-white/10 p-12 text-center">
          <Crosshair className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <p className="font-mono text-sm text-zinc-500 uppercase">Nenhuma operação registrada</p>
          <p className="font-mono text-xs text-zinc-600 mt-1">Operações criadas no Dashboard aparecerão aqui</p>
        </div>
      ) : displayedGames.length === 0 ? (
        <div className="bg-armor-gray border border-white/10 p-12 text-center">
          <Crosshair className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <p className="font-mono text-sm text-zinc-500 uppercase">Nenhuma operação nesta data</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {displayedGames.map((game, idx) => {
            const statusInfo = STATUS_MAP[game.status] ?? { label: game.status, style: 'border-zinc-600 text-zinc-600' };
            return (
              <div key={game.id} className="relative bg-armor-gray border border-white/10 overflow-hidden group">

                {/* Decorative Background Number */}
                <div className="absolute -right-4 -top-6 text-[120px] font-header font-bold text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="flex flex-col md:flex-row">

                  {/* Status Strip */}
                  <div className="md:w-16 bg-black flex items-center justify-center border-r border-white/10 py-4 md:py-0">
                    <div className="md:-rotate-90 whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {game.gameType} PROTOCOL
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className={`inline-block px-2 py-0.5 border text-[10px] font-mono font-bold uppercase mb-3 ${statusInfo.style}`}>
                          STATUS: {statusInfo.label}
                        </div>
                        <h2 className="font-header text-3xl font-bold text-white mb-2">{game.name}</h2>
                        <div className="flex flex-wrap gap-4 text-sm font-mono text-zinc-400">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-tactical-amber" />
                            {formatTime(game.startDate)} // {formatDate(game.startDate)}
                          </span>
                          {game.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-tactical-amber" /> {game.location}
                            </span>
                          )}
                          {game.registrationFee > 0 && (
                            <span className="text-tactical-amber font-bold">R$ {game.registrationFee.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={canRegister(game.status) ? `/inscricao/${game.id}` : '#'}
                        className="bg-white/5 hover:bg-tactical-amber hover:text-black border border-white/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all clip-corner-tl inline-block"
                      >
                        {canRegister(game.status) ? 'INICIAR INSCRIÇÃO' : 'VER RELATÓRIO'}
                      </Link>
                    </div>

                    {/* Intel Box */}
                    {game.description && (
                      <div className="bg-black/40 border border-white/5 p-4 relative">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-hud-blue mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[10px] font-mono text-hud-blue uppercase mb-1">Mission Intel</div>
                            <p className="font-mono text-sm text-zinc-300 leading-relaxed">
                              {game.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer */}
                <div className="bg-black px-6 py-2 border-t border-white/10 flex flex-wrap justify-between items-center gap-2 text-[10px] font-mono text-zinc-600">
                  <div className="flex items-center gap-4">
                    {game.locationCoords && <span>COORDS: {game.locationCoords}</span>}
                    {game.locationMapsUrl && (
                      <a
                        href={game.locationMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-hud-blue hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> MAPA
                      </a>
                    )}
                    <span className="bg-zinc-800 px-2 py-0.5 text-zinc-400 uppercase">{game.gameType}</span>
                  </div>
                  <span className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span className={game.currentPlayers > 0 ? 'text-vision-green' : ''}>
                      {game.currentPlayers}{game.maxPlayers ? `/${game.maxPlayers}` : ''}
                    </span>
                    <span>OPERADORES CONFIRMADOS</span>
                    {game.currentPlayers > 0 && <CheckCircle className="w-3 h-3 text-vision-green" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Eventos;
