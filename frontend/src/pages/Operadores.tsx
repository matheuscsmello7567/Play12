import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, Target, MoreHorizontal, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { operadores as mockOperadores } from '../services/data';
import { Operador } from '../types';

// Fotos aleatórias de jogos anteriores (seeds garantem imagens consistentes)
const allGamePhotos = [
  { src: 'https://picsum.photos/seed/milsim01/800/400', caption: 'OP. RED WINGS — Serra do Rola Moça' },
  { src: 'https://picsum.photos/seed/milsim02/800/400', caption: 'CQB TRAINING — Fábrica Contagem' },
  { src: 'https://picsum.photos/seed/milsim03/800/400', caption: 'OP. IRON RAIN — Arena Play12 HQ' },
  { src: 'https://picsum.photos/seed/milsim04/800/400', caption: 'WOODLAND — Mata do Jambreiro' },
  { src: 'https://picsum.photos/seed/milsim05/800/400', caption: 'OP. GHOST RECON — Sector 5' },
  { src: 'https://picsum.photos/seed/milsim06/800/400', caption: 'NIGHT OPS — Serra da Piedade' },
  { src: 'https://picsum.photos/seed/milsim07/800/400', caption: 'OP. VALKYRIE — Fazenda Velha' },
  { src: 'https://picsum.photos/seed/milsim08/800/400', caption: 'CQB ELITE — Galpão Industrial' },
  { src: 'https://picsum.photos/seed/milsim09/800/400', caption: 'OP. SILENT ECHO — Complexo Delta' },
  { src: 'https://picsum.photos/seed/milsim10/800/400', caption: 'BENEFICENTE — Arena Central' },
];

// Seleciona N fotos aleatórias
const shufflePhotos = (arr: typeof allGamePhotos, count: number) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const Operadores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos] = useState(() => shufflePhotos(allGamePhotos, 10));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [operadores, setOperadores] = useState<Operador[]>(mockOperadores);

  // Fetch real operators from API and merge with mock
  useEffect(() => {
    fetch('http://localhost:3333/api/v1/operators', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(result => {
        if (result?.data) {
          const apiOps: Operador[] = result.data.map((op: any) => ({
            id: String(op.id),
            apelido: op.nickname,
            nome_completo: op.fullName || op.nickname,
            email: op.email,
            patente: op.role === 'SQUAD_LEADER' ? 'Líder de Squad' : op.role === 'ADMIN' ? 'Administrador' : 'Recruta',
            squad_id: null,
            jogos_participados: op.totalGames || 0,
            pontos: Math.round(op.engagementScore || 0),
            data_cadastro: op.createdAt,
            loadout: [],
            status: 'ONLINE' as const,
          }));
          // Merge: API ops + mock ops (avoid ID collisions)
          const apiIds = new Set(apiOps.map((o: Operador) => o.id));
          const merged = [...apiOps, ...mockOperadores.filter(m => !apiIds.has(m.id))];
          setOperadores(merged);
        }
      })
      .catch(() => { /* keep mock data */ });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);
  
  const filteredOperadores = operadores.filter((op: Operador) => {
    const term = searchTerm.toLowerCase();
    return (
      op.apelido.toLowerCase().includes(term) ||
      op.nome_completo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
         <div>
            <h1 className="font-header text-3xl font-bold text-white uppercase tracking-widest">Dossiê de Operadores</h1>
            <p className="font-mono text-xs text-zinc-500 uppercase mt-1">Base de dados ativa: {operadores.length} registros</p>
         </div>
         
         <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-tactical-amber transition-colors" />
            </div>
            <input
               type="text"
               className="w-full bg-black border border-white/10 text-white font-mono text-sm pl-10 pr-4 py-2 focus:border-tactical-amber focus:outline-none transition-colors"
               placeholder="BUSCAR CALLSIGN..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 group-focus-within:border-tactical-amber transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700 group-focus-within:border-tactical-amber transition-colors"></div>
         </div>
      </div>

      {/* Carousel de Fotos de Jogos */}
      <div className="relative bg-armor-gray border border-white/10 overflow-hidden group/carousel">
        
        {/* Label */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 border border-white/10">
          <Camera className="w-3 h-3 text-tactical-amber" />
          <span className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest">Registros de Campo</span>
        </div>

        {/* Contador */}
        <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400">
            {String(currentSlide + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
        </div>

        {/* Imagens */}
        <div className="relative h-56 md:h-72 w-full">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover grayscale-[30%] brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}

          {/* Caption */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Missão Registrada</div>
            <div className="font-header text-lg font-bold text-white">{photos[currentSlide]?.caption}</div>
          </div>
        </div>

        {/* Controles */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-tactical-amber hover:border-tactical-amber/50 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-tactical-amber hover:border-tactical-amber/50 transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-tactical-amber' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredOperadores.map((op) => (
            <Link to={`/operadores/${op.id}`} key={op.id} className="bg-armor-gray border border-white/10 p-6 relative group hover:border-tactical-amber/50 transition-all clip-corner-br cursor-pointer block">
               
               <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
                  op.status === 'ONLINE' ? 'bg-vision-green shadow-[0_0_8px_#00FF94]' : 
                  op.status === 'EM_COMBATE' ? 'bg-critical-red shadow-[0_0_8px_#FF2A2A] animate-pulse' : 
                  'bg-zinc-700'
               }`}></div>

               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center border border-white/10">
                        <Shield className="w-8 h-8 text-zinc-600" />
                     </div>
                     <div>
                        <div className="text-[10px] font-mono text-tactical-amber uppercase mb-1">{op.patente}</div>
                        <h3 className="font-header text-2xl font-bold text-white leading-none">{op.apelido}</h3>
                        <p className="font-mono text-xs text-zinc-500 uppercase">{op.nome_completo}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-black/50 p-2 border-l-2 border-hud-blue">
                     <div className="text-[9px] font-mono text-zinc-500 uppercase">XP Total</div>
                     <div className="text-hud-blue font-bold font-mono">{op.pontos}</div>
                  </div>
                  <div className="bg-black/50 p-2 border-l-2 border-vision-green">
                     <div className="text-[9px] font-mono text-zinc-500 uppercase">Missões</div>
                     <div className="text-vision-green font-bold font-mono">{op.jogos_participados}</div>
                  </div>
               </div>

               <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Target className="w-3 h-3 text-zinc-500" />
                     <span className="text-[10px] font-mono uppercase text-zinc-500">Armamento Principal</span>
                  </div>
                  <div className="font-mono text-xs text-zinc-300">
                     {op.loadout && op.loadout[0] ? op.loadout[0] : 'NÃO REGISTRADO'}
                  </div>
               </div>

               {op.squad_nome && (
                  <div className="absolute bottom-0 right-0 bg-white/5 px-3 py-1 text-[10px] font-mono font-bold uppercase text-zinc-500 border-t border-l border-white/10">
                     UNIT: {op.squad_nome}
                  </div>
               )}

            </Link>
         ))}
      </div>

    </div>
  );
};

export default Operadores;
