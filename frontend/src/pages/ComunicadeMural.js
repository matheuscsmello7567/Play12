import React from 'react';
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
  return (
    <div className="mural-page">
      <h1 className="mural-title">Últimos jogos</h1>
      <div className="mural-grid">
        {images.map((src, idx) => (
          <div className="mural-photo" key={idx}>
            <img src={src} alt={`Mural ${idx+1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
