import React, { useMemo, useState } from 'react';
import './Loja.css';

const products = [
  { id: 1, name: 'Colete Tático', category: 'Equipamentos', price: 249.9 },
  { id: 2, name: 'Óculos de Proteção', category: 'Proteção', price: 89.9 },
  { id: 3, name: 'Bateria LiPo 11.1V', category: 'Acessórios', price: 129.9 },
  { id: 4, name: 'Rádio Comunicador', category: 'Comunicação', price: 199.9 },
  { id: 5, name: 'Bota Tática', category: 'Vestuário', price: 279.9 },
  { id: 6, name: 'Máscara Facial', category: 'Proteção', price: 59.9 }
];

const categories = ['Todos', 'Equipamentos', 'Proteção', 'Acessórios', 'Comunicação', 'Vestuário'];

export default function Loja() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchTerm = term ? p.name.toLowerCase().includes(term) : true;
      const matchCategory = category === 'Todos' ? true : p.category === category;
      return matchTerm && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="loja-page">
      <h1 className="loja-title">Loja</h1>

      <div className="loja-filters">
        <input
          type="text"
          placeholder="Buscar produtos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="loja-grid">
        {filtered.length === 0 && <p>Nenhum produto encontrado.</p>}
        {filtered.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-thumb" />
            <h3>{p.name}</h3>
            <span className="product-category">{p.category}</span>
            <span className="product-price">R$ {p.price.toFixed(2)}</span>
            <button className="hero-btn nav-login">Ver produto</button>
          </div>
        ))}
      </div>
    </div>
  );
}
