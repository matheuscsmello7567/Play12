import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen, MapPin, Clock, ArrowRight, Target, Activity, ShieldAlert, Crosshair } from 'lucide-react';

const API = 'http://localhost:3333/api/v1';

interface NextGame {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  locationCoords: string | null;
  locationMapsUrl: string | null;
  maxPlayers: number | null;
  currentPlayers: number;
  status: string;
  gameType: string;
  registrationFee: number;
  description: string | null;
}

const Home: React.FC = () => {
  const [nextEvent, setNextEvent] = useState<NextGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const res = await fetch(`${API}/games?limit=50`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          const games: NextGame[] = Array.isArray(json) ? json : json.data ?? [];
          const now = new Date();
          const upcoming = games
            .filter(g => new Date(g.startDate) >= now && ['SCHEDULED', 'REGISTRATION_OPEN'].includes(g.status))
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          setNextEvent(upcoming[0] ?? null);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchNext();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}${m}H`;
  };

  const pct = nextEvent && nextEvent.maxPlayers
    ? Math.round((nextEvent.currentPlayers / nextEvent.maxPlayers) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Hero / Mission Control */}
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-armor-gray clip-corner-br min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0 opacity-20">
             <img src="https://picsum.photos/seed/tacticalmap/1920/1080" alt="Map" className="w-full h-full object-cover grayscale invert" />
             <div className="absolute inset-0 bg-ops-black/60"></div>
        </div>
        
        <div className="scan-beam"></div>

        <div className="relative z-10 w-full px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-end gap-12">
          {loading ? (
            <div className="w-full text-center py-16 font-mono text-sm text-zinc-500 uppercase animate-pulse">
              Buscando próxima operação...
            </div>
          ) : nextEvent ? (
            <>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-tactical-amber/50 bg-tactical-dim text-tactical-amber text-xs font-mono font-bold tracking-widest uppercase">
                   <Target className="w-3 h-3 animate-pulse" />
                   Próxima Incursão
                </div>
                
                <h1 className="text-4xl md:text-6xl font-header font-bold text-white mb-2 leading-none uppercase">
                  {nextEvent.name}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-hud-blue font-mono text-sm mb-8">
                   <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {formatDate(nextEvent.startDate)} - {formatTime(nextEvent.startDate)}</span>
                   {nextEvent.location && (
                     nextEvent.locationMapsUrl ? (
                       <a 
                         href={nextEvent.locationMapsUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-2 hover:text-tactical-amber transition-colors"
                         title="Abrir localização no Google Maps"
                       >
                          <MapPin className="w-4 h-4" /> {nextEvent.location}
                       </a>
                     ) : (
                       <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {nextEvent.location}</span>
                     )
                   )}
                   {nextEvent.locationCoords && (
                     <span className="text-zinc-500">// {nextEvent.locationCoords}</span>
                   )}
                </div>

                <div className="flex gap-4">
                  <Link to={`/inscricao/${nextEvent.id}`} className="bg-tactical-amber text-black hover:bg-white px-8 py-3 font-header font-bold uppercase tracking-widest clip-corner-br transition-all flex items-center gap-2 group">
                    Confirmar Deslocamento
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="hidden md:block w-64 border-l border-white/10 pl-8 space-y-6">
                 <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Status do Jogo</div>
                    <div className="text-vision-green font-mono font-bold text-xl flex items-center gap-2">
                       <Activity className="w-4 h-4" /> {pct}% CONFIRMADOS
                    </div>
                    <div className="text-zinc-500 font-mono text-xs mt-1">
                       {nextEvent.currentPlayers} de {nextEvent.maxPlayers ?? '∞'} participantes
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Tipo de Operação</div>
                    <div className="text-hud-blue font-mono font-bold text-xl uppercase">
                       {nextEvent.gameType}
                    </div>
                 </div>
                 {nextEvent.registrationFee > 0 && (
                   <div>
                      <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Taxa de Inscrição</div>
                      <div className="text-tactical-amber font-mono font-bold text-xl">
                         R$ {nextEvent.registrationFee.toFixed(2)}
                      </div>
                   </div>
                 )}
              </div>
            </>
          ) : (
            <div className="w-full text-center py-16">
              <Crosshair className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="font-mono text-sm text-zinc-500 uppercase">Nenhuma operação agendada</p>
              <p className="font-mono text-xs text-zinc-600 mt-1">Fique atento ao quadro de missões</p>
            </div>
          )}
        </div>
      </section>

      {/* Grid Menu */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/eventos" className="group relative h-48 bg-armor-gray border border-white/10 p-6 flex flex-col justify-end hover:border-tactical-amber/50 transition-all clip-corner-br overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-24 h-24" />
           </div>
           <div className="relative z-10">
              <h3 className="font-header text-2xl font-bold text-white mb-1 group-hover:text-tactical-amber transition-colors">QUADRO DE OPERAÇÕES</h3>
              <p className="font-mono text-xs text-zinc-500">Acessar briefing e inscrições</p>
           </div>
        </Link>

        <Link to="/times" className="group relative h-48 bg-armor-gray border border-white/10 p-6 flex flex-col justify-end hover:border-hud-blue/50 transition-all clip-corner-br overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24" />
           </div>
           <div className="relative z-10">
              <h3 className="font-header text-2xl font-bold text-white mb-1 group-hover:text-hud-blue transition-colors">UNIDADES TÁTICAS</h3>
              <p className="font-mono text-xs text-zinc-500">Gerenciamento de squad e membros</p>
           </div>
        </Link>

        <Link to="/manual-airsoft" className="group relative h-48 bg-armor-gray border border-white/10 p-6 flex flex-col justify-end hover:border-vision-green/50 transition-all clip-corner-br overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="w-24 h-24" />
           </div>
           <div className="relative z-10">
              <h3 className="font-header text-2xl font-bold text-white mb-1 group-hover:text-vision-green transition-colors">PROTOCOLO DE CAMPO</h3>
              <p className="font-mono text-xs text-zinc-500">Regras de engajamento e FPS</p>
           </div>
        </Link>
      </section>
    </div>
  );
};

export default Home;
