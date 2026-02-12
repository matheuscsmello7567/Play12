import React, { useState } from 'react';
import { ShoppingCart, Search, Package } from 'lucide-react';

const Loja: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="bg-zinc-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wide">Loja Play12</h1>
            <p className="text-zinc-400 mt-2">Equipamentos, ingressos e merchandise oficial.</p>
          </div>

          <div className="flex w-full md:w-auto gap-4">
             <div className="relative flex-grow md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="text"
                  className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-3"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-white border border-zinc-700 relative">
               <ShoppingCart className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 bg-orange-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
             </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
          {['Todos', 'Ingressos', 'Patches', 'Vestuário', 'Consumíveis'].map((cat, idx) => (
             <button 
               key={cat} 
               className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${idx === 0 ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
             >
               {cat}
             </button>
          ))}
        </div>

        <div className="bg-zinc-900 rounded-xl p-20 text-center border border-zinc-800 border-dashed">
           <Package className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
           <h2 className="text-2xl font-bold text-white mb-2">Loja em Manutenção</h2>
           <p className="text-zinc-500 max-w-md mx-auto">
             Estamos atualizando nosso estoque para a temporada 2026. Volte em breve para adquirir os melhores equipamentos.
           </p>
           {searchTerm && (
             <p className="mt-4 text-orange-500 text-sm">
               Resultado da busca para: "{searchTerm}" (0 itens)
             </p>
           )}
        </div>

      </div>
    </div>
  );
};

export default Loja;
