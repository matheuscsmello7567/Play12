import React, { useEffect, useMemo, useState } from 'react';
import './Loja.css';
import { apiFetch } from '../services/api';

export default function Loja() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.categoria)))];

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/produtos')
      .then((data) => setProducts(data))
      .catch((err) => {
        setProducts([]);
        setError(err.message || 'Erro ao carregar produtos');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchTerm = term ? p.nome.toLowerCase().includes(term) : true;
      const matchCategory = category === 'Todos' ? true : p.categoria === category;
      return matchTerm && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="loja-page">
      <div className="loja-header">
        <h1>Loja</h1>
        <p>Equipamentos e acessórios para operadores</p>
      </div>

      <div className="loja-content">

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

      {error && <div className="loja-error">{error === 'Servidor offline' ? 'Servidor offline. Tente novamente mais tarde.' : error}</div>}
      {loading && <div className="loja-loading">Carregando produtos...</div>}

      <div className="loja-grid">
        {filtered.length === 0 && <p>Nenhum produto encontrado.</p>}
        {filtered.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-thumb" style={p.imagemUrl ? { backgroundImage: `url(${p.imagemUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
            <h3>{p.nome}</h3>
            <span className="product-category">{p.categoria}</span>
            <span className="product-price">R$ {Number(p.preco).toFixed(2)}</span>
            <button className="hero-btn">Ver produto</button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
