import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Target, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { eventos } from '../services/data';
import { EventoStatus } from '../types';

const Eventos: React.FC = () => {
  
  const getStatusStyle = (status: EventoStatus) => {
    switch(status) {
      case EventoStatus.BRIEFING: return 'border-hud-blue text-hud-blue';
      case EventoStatus.MOBILIZACAO: return 'border-tactical-amber text-tactical-amber animate-pulse';
      case EventoStatus.COMBATE: return 'border-critical-red text-critical-red';
      default: return 'border-zinc-600 text-zinc-600';
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="border-l-4 border-tactical-amber pl-6 py-2">
         <h1 className="font-header text-4xl font-bold text-white uppercase">Quadro de Missões</h1>
         <p className="font-mono text-sm text-zinc-500 uppercase mt-1">Operações ativas e histórico de combate</p>
      </div>

      <div className="grid gap-8">
         {eventos.map((evt) => (
            <div key={evt.id} className="relative bg-armor-gray border border-white/10 overflow-hidden group">
               
               {/* Decorative Background Number */}
               <div className="absolute -right-4 -top-6 text-[120px] font-header font-bold text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                  0{eventos.indexOf(evt) + 1}
               </div>

               <div className="flex flex-col md:flex-row">
                  
                  {/* Status Strip */}
                  <div className="md:w-16 bg-black flex items-center justify-center border-r border-white/10 py-4 md:py-0">
                     <div className="md:-rotate-90 whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
                        {evt.tipo} PROTOCOL
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow p-6 md:p-8">
                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                           <div className={`inline-block px-2 py-0.5 border text-[10px] font-mono font-bold uppercase mb-3 ${getStatusStyle(evt.status)}`}>
                              STATUS: {evt.status}
                           </div>
                           <h2 className="font-header text-3xl font-bold text-white mb-2">{evt.nome}</h2>
                           <div className="flex flex-wrap gap-4 text-sm font-mono text-zinc-400">
                              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-tactical-amber" /> {evt.horario} // {evt.data}</span>
                              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-tactical-amber" /> {evt.local.endereco}</span>
                           </div>
                        </div>
                        
                        <Link 
                          to={evt.status === EventoStatus.BRIEFING ? '/inscricao' : '#'}
                          className="bg-white/5 hover:bg-tactical-amber hover:text-black border border-white/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all clip-corner-tl inline-block"
                        >
                           {evt.status === EventoStatus.BRIEFING ? 'INICIAR INSCRIÇÃO' : 'VER RELATÓRIO'}
                        </Link>
                     </div>

                     {/* Intel Box */}
                     <div className="bg-black/40 border border-white/5 p-4 relative">
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="w-4 h-4 text-hud-blue mt-0.5" />
                           <div>
                              <div className="text-[10px] font-mono text-hud-blue uppercase mb-1">Mission Intel</div>
                              <p className="font-mono text-sm text-zinc-300 leading-relaxed">
                                 {evt.intel}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
               
               {/* Coordinates footer */}
               <div className="bg-black px-6 py-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                  <span>COORDS: {evt.local.coords}</span>
                  <span className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span className={evt.confirmados > 0 ? 'text-vision-green' : ''}>
                      {evt.confirmados}
                    </span>
                    <span>OPERADORES CONFIRMADOS</span>
                    {evt.confirmados > 0 && <CheckCircle className="w-3 h-3 text-vision-green" />}
                  </span>
               </div>
            </div>
         ))}
      </div>

    </div>
  );
};

export default Eventos;
