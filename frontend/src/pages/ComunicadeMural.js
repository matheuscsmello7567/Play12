import React, { useState } from 'react';
import './ComunicadeMural.css';

const images = [
  '/images/MilSim_1.jpeg',
  '/images/MilSim_2.jpg',
  '/images/MilSim_3.jpg',
  '/images/MilSim_4.jpeg',
  '/images/MilSim_5.webp',
  '/images/MilSim_6_License.jpg',
  '/images/MilSim_7_License.webp'
];

export default function ComunicadeMural() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="mural-page">
      <h1 className="mural-title">Últimos jogos</h1>
      <div className="mural-grid">
        {images.map((src, idx) => (
          <button className="mural-photo" key={idx} onClick={() => setSelected(src)}>
            <img src={src} alt={`Mural ${idx+1}`} />
          </button>
        ))}
      </div>

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
