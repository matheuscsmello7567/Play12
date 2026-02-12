import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen, MapPin, Clock, ArrowRight, Target, Activity, ShieldAlert } from 'lucide-react';

const Home: React.FC = () => {
  const nextEvent = {
    nome: 'OPERAÇÃO RED WINGS',
    data: '15/02/2026',
    horario: '0100Z',
    local: 'Serra do Rola Moça',
    coord: '20°03\'22"S 44°02\'03"W',
    mapsUrl: 'https://google.com/maps',
    tipo: 'MILSIM'
  };

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
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-tactical-amber/50 bg-tactical-dim text-tactical-amber text-xs font-mono font-bold tracking-widest uppercase">
               <Target className="w-3 h-3 animate-pulse" />
               Próxima Incursão
            </div>
            
            <h1 className="text-4xl md:text-6xl font-header font-bold text-white mb-2 leading-none uppercase">
              {nextEvent.nome}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-hud-blue font-mono text-sm mb-8">
               <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {nextEvent.data} - {nextEvent.horario}</span>
               <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {nextEvent.local}</span>
               <span className="text-zinc-500">// {nextEvent.coord}</span>
            </div>

            <div className="flex gap-4">
              <Link to="/eventos" className="bg-tactical-amber text-black hover:bg-white px-8 py-3 font-header font-bold uppercase tracking-widest clip-corner-br transition-all flex items-center gap-2 group">
                Confirmar Deslocamento
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="hidden md:block w-64 border-l border-white/10 pl-8 space-y-6">
             <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Status do Squad</div>
                <div className="text-vision-green font-mono font-bold text-xl flex items-center gap-2">
                   <Activity className="w-4 h-4" /> 92% PRONTO
                </div>
             </div>
             <div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Intel Disponível</div>
                <div className="text-hud-blue font-mono font-bold text-xl">
                   NVG REQUIRED
                </div>
             </div>
          </div>
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
