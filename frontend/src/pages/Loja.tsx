import React, { useState } from 'react';
import { ShoppingCart, Search, Package, Tag, Crosshair, Shield, Zap, Coffee, Ticket, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { key: 'todos', label: 'TODOS', icon: Crosshair },
  { key: 'ingressos', label: 'INGRESSOS', icon: Ticket },
  { key: 'patches', label: 'PATCHES', icon: Shield },
  { key: 'vestuario', label: 'VESTUÁRIO', icon: Tag },
  { key: 'consumiveis', label: 'CONSUMÍVEIS', icon: Coffee },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'INGRESSO — OP RED WINGS', category: 'ingressos', price: 85.00, status: 'DISPONÍVEL', img: 'https://picsum.photos/seed/ticket1/400/300' },
  { id: 2, name: 'PATCH BATTLE MANAGER V1', category: 'patches', price: 35.00, status: 'DISPONÍVEL', img: 'https://picsum.photos/seed/patch1/400/300' },
  { id: 3, name: 'CAMISETA TACTICAL OPS', category: 'vestuario', price: 120.00, status: 'ESGOTADO', img: 'https://picsum.photos/seed/shirt1/400/300' },
  { id: 4, name: 'PATCH OPERADOR ELITE', category: 'patches', price: 45.00, status: 'DISPONÍVEL', img: 'https://picsum.photos/seed/patch2/400/300' },
  { id: 5, name: 'KIT HIDRATAÇÃO CAMPO', category: 'consumiveis', price: 25.00, status: 'DISPONÍVEL', img: 'https://picsum.photos/seed/water1/400/300' },
  { id: 6, name: 'BONÉ TÁTICO BM', category: 'vestuario', price: 75.00, status: 'DISPONÍVEL', img: 'https://picsum.photos/seed/cap1/400/300' },
];

const Loja: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [cart, setCart] = useState<number[]>([]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'todos' || p.category === activeCategory;
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id]);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="border-l-4 border-tactical-amber pl-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-header text-4xl font-bold text-white uppercase tracking-wider">Suprimentos</h1>
              <p className="font-mono text-sm text-zinc-500 uppercase mt-1">
                Centro de aquisição de equipamentos e ingressos
              </p>
            </div>

            {/* Cart */}
            <button className="relative border border-white/10 bg-armor-gray hover:border-tactical-amber/50 p-4 transition-all group">
              <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-tactical-amber transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-critical-red text-white text-[10px] font-mono font-bold w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search + Categories */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <div className="flex items-center bg-armor-gray border border-white/10 px-4 py-3 focus-within:border-tactical-amber/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-500 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no inventário..."
              className="bg-transparent border-none outline-none text-white w-full font-mono text-sm placeholder:text-zinc-600"
            />
            {searchTerm && (
              <span className="font-mono text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                {filteredProducts.length} RESULTADO{filteredProducts.length !== 1 ? 'S' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 border-b border-white/5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-tactical-amber text-tactical-amber bg-tactical-amber/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.status === 'ESGOTADO';
            const isInCart = cart.includes(product.id);
            return (
              <div
                key={product.id}
                className={`group relative bg-armor-gray border border-white/10 overflow-hidden hover:border-tactical-amber/30 transition-all ${
                  isOutOfStock ? 'opacity-60' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ops-black via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isOutOfStock
                      ? 'border-critical-red/50 text-critical-red bg-critical-red/10'
                      : 'border-vision-green/50 text-vision-green bg-vision-green/10'
                  }`}>
                    {product.status}
                  </div>

                  {/* Category Tag */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 border border-white/20 text-[10px] font-mono text-zinc-400 uppercase bg-black/40 backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-header text-lg font-bold text-white uppercase tracking-wide group-hover:text-tactical-amber transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Valor</div>
                      <div className="font-header text-2xl font-bold text-tactical-amber">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    {!isOutOfStock && (
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={isInCart}
                        className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all clip-corner-br ${
                          isInCart
                            ? 'bg-vision-green/10 border border-vision-green/30 text-vision-green cursor-default'
                            : 'bg-tactical-amber text-black hover:bg-white font-bold'
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Zap className="w-3.5 h-3.5" /> Adicionado
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Adquirir
                          </>
                        )}
                      </button>
                    )}

                    {isOutOfStock && (
                      <div className="font-mono text-[10px] text-critical-red uppercase tracking-wider border border-critical-red/30 px-3 py-2">
                        Indisponível
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`h-0.5 w-full transition-all duration-300 ${
                  isInCart ? 'bg-vision-green' : 'bg-transparent group-hover:bg-tactical-amber/50'
                }`} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-armor-gray border border-white/10 p-1">
          <div className="bg-ops-black/50 p-16 text-center space-y-4">
            <Package className="w-16 h-16 text-zinc-700 mx-auto" />
            <div>
              <h2 className="font-header text-xl font-bold text-white uppercase tracking-wider mb-2">
                {searchTerm ? 'Nenhum item encontrado' : 'Setor vazio'}
              </h2>
              <p className="font-mono text-sm text-zinc-500 max-w-md mx-auto">
                {searchTerm
                  ? `Nenhum suprimento corresponde a "${searchTerm}" nesta categoria.`
                  : 'Nenhum item disponível nesta categoria no momento.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Intel */}
      <div className="border-t border-white/5 pt-4">
        <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest text-center">
          Central de Suprimentos · BATTLE MANAGER TACTICAL SYSTEMS · {MOCK_PRODUCTS.length} ITENS CATALOGADOS
        </div>
      </div>
    </div>
  );
};

export default Loja;
