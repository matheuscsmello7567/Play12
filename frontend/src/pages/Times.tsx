import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, Crosshair, BarChart, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { times } from '../services/data';

// Fotos de operações das unidades
const allUnitPhotos = [
  { src: 'https://picsum.photos/seed/unit_bravo01/800/400', caption: 'BRAVO TEAM — Reconhecimento Noturno' },
  { src: 'https://picsum.photos/seed/unit_bravo02/800/400', caption: 'BRAVO TEAM — Assalto Tático Sector 3' },
  { src: 'https://picsum.photos/seed/unit_pmt01/800/400', caption: 'PIMENTA MAIORAL — Supressão Pesada' },
  { src: 'https://picsum.photos/seed/unit_pmt02/800/400', caption: 'PIMENTA MAIORAL — Defesa de Perímetro' },
  { src: 'https://picsum.photos/seed/unit_nst01/800/400', caption: 'NIGHT STALKERS — Infiltração Silenciosa' },
  { src: 'https://picsum.photos/seed/unit_nst02/800/400', caption: 'NIGHT STALKERS — Emboscada Noturna' },
  { src: 'https://picsum.photos/seed/unit_eco01/800/400', caption: 'ECHO SQUAD — Treino de Formação' },
  { src: 'https://picsum.photos/seed/unit_eco02/800/400', caption: 'ECHO SQUAD — Exercício CQB' },
  { src: 'https://picsum.photos/seed/unit_gen01/800/400', caption: 'OPERAÇÃO CONJUNTA — Todas as Unidades' },
  { src: 'https://picsum.photos/seed/unit_gen02/800/400', caption: 'CERIMÔNIA DE GRADUAÇÃO — Base Play12' },
];

const shufflePhotos = (arr: typeof allUnitPhotos, count: number) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const Times: React.FC = () => {
  const [photos] = useState(() => shufflePhotos(allUnitPhotos, 10));
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="space-y-8">
       
       <div className="flex justify-between items-end border-b border-white/10 pb-6">
         <div>
            <h1 className="font-header text-3xl font-bold text-white uppercase tracking-widest">Unidades Táticas</h1>
            <p className="font-mono text-xs text-zinc-500 uppercase mt-1">Squads registrados e ativos</p>
         </div>
         <button className="bg-tactical-amber text-black px-6 py-2 font-mono text-xs font-bold uppercase tracking-widest clip-corner-br hover:bg-white transition-colors">
            + Nova Unidade
         </button>
       </div>

       {/* Carousel de Fotos das Unidades */}
       <div className="relative bg-armor-gray border border-white/10 overflow-hidden group/carousel">
         <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 border border-white/10">
           <Camera className="w-3 h-3 text-tactical-amber" />
           <span className="text-[10px] font-mono text-tactical-amber uppercase tracking-widest">Registros das Unidades</span>
         </div>

         <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 border border-white/10">
           <span className="text-[10px] font-mono text-zinc-400">
             {String(currentSlide + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
           </span>
         </div>

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

           <div className="absolute bottom-4 left-4 z-10">
             <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Operação Registrada</div>
             <div className="font-header text-lg font-bold text-white">{photos[currentSlide]?.caption}</div>
           </div>
         </div>

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

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {times.map((time) => (
             <Link to={`/times/${time.id}`} key={time.id} className="bg-armor-gray border border-white/10 p-1 group hover:border-tactical-amber/50 transition-all block cursor-pointer">
                <div className="bg-ops-black/50 p-6 h-full flex flex-col relative overflow-hidden">
                   
                   <div className="absolute right-0 top-0 text-[80px] font-header font-bold text-white/5 leading-none -mr-4 -mt-4 select-none">
                      {time.tag}
                   </div>

                   <div className="relative z-10 flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-zinc-900">
                            <Users className="w-6 h-6 text-zinc-500" />
                         </div>
                         <div>
                            <h3 className="font-header text-2xl font-bold text-white">{time.nome}</h3>
                            <div className="text-[10px] font-mono text-vision-green uppercase tracking-wider">UNIT ID: {time.tag}-0{time.id.replace(/\D/g,'')}</div>
                         </div>
                      </div>
                      
                      <p className="font-mono text-xs text-zinc-400 mb-6 border-l-2 border-white/10 pl-3">
                         {time.descricao}
                      </p>
                   </div>

                   <div className="grid grid-cols-3 gap-1 mt-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Membros</div>
                         <div className="font-bold text-white font-mono">{time.membros_count}</div>
                      </div>
                      <div className="text-center border-l border-white/10">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Pontos</div>
                         <div className="font-bold text-tactical-amber font-mono">{time.pontos_totais}</div>
                      </div>
                      <div className="text-center border-l border-white/10">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase">Ops</div>
                         <div className="font-bold text-white font-mono">{time.jogos_participados}</div>
                      </div>
                   </div>

                </div>
             </Link>
          ))}
       </div>

    </div>
  );
};

export default Times;
