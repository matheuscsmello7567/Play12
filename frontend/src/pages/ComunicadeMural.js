import React, { useEffect, useRef, useState } from 'react';
import './ComunicadeMural.css';
import { apiFetch } from '../services/api';

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Highlights Play12' },
  { id: 'M7lc1UVf-VE', title: 'Treino tático' },
  { id: 'aqz-KE-bpKQ', title: 'Campeonato regional' },
  { id: 'ysz5S6PUM-U', title: 'Operação noturna' }
];

export default function ComunicadeMural() {
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const amount = direction === 'left' ? -360 : 360;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch('/comunidade/fotos')
      .then((data) => setImages(data.map((p) => p.imagemUrl)))
      .catch((err) => {
        setImages([]);
        setError(err.message || 'Erro ao carregar fotos');
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="mural-page">
      <h1 className="mural-title">Últimos jogos</h1>
      {error && <div className="mural-error">{error === 'Servidor offline' ? 'Servidor offline. Tente novamente mais tarde.' : error}</div>}
      {loading && <div className="mural-loading">Carregando fotos...</div>}
      <div className="mural-grid">
        {images.map((src, idx) => (
          <button className="mural-photo" key={idx} onClick={() => setSelected(src)}>
            <img src={src} alt={`Mural ${idx+1}`} />
          </button>
        ))}
      </div>

      <section className="news-section">
        <div className="news-header">
          <h2>Novidades</h2>
          <div className="news-controls">
            <button type="button" onClick={() => scrollCarousel('left')}>◀</button>
            <button type="button" onClick={() => scrollCarousel('right')}>▶</button>
          </div>
        </div>
        <div className="news-carousel" ref={carouselRef}>
          {videos.map((video) => (
            <div className="news-card" key={video.id}>
              <div className="news-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h3>{video.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="mural-modal" onClick={() => setSelected(null)}>
          <div className="mural-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="mural-close" onClick={() => setSelected(null)}>×</button>
            <img src={selected} alt="Foto ampliada" />
          </div>
        </div>
      )}
    </div>
  );
}
