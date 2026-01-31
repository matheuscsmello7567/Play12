import React from 'react';
import './Rules.css';

export default function Rules() {
  const sections = [
    {
      title: "Regras Gerais",
      items: [
        "O respeito é imprescindível entre operadores",
        "Nunca remover os equipamentos de segurança durante o jogo",
        "Seguir as instruções do ranger",
        "Respeitar os limites de fps das armas"
      ]
    },
    {
      title: "Equipamento",
      items: [
        "Armas devem estar desmuniciadas e travadas fora do limite do jogo",
        "Seguir as orientações de granadas",
        "Proibido armas com projéteis de metal",
        "Inspeção técnica antes de cada jogo"
      ]
    },
    {
      title: "Conduta",
      items: [
        "Qualquer tipo de agressão resultará em desqualificação",
        "Respeitar as desisões do ranger",
        "Zero tolerância a assédio",
        "Violações graves: banimento permanente"
      ]
    },
    {
      title: "Informações",
      items: [
        "Pistola até 350 (sem limite mínimo de distância)",
        "Rifles até 400 (Sem limite mínimo de distância)",
        "DMR até 450 (Mínimo de 10m+)",
        "Sniper até 500 (Mínimo de 20m+)"
      ]
    }
  ];

  return (
    <div className="rules-page">
      <div className="rules-header">
        <h1>REGRAS</h1>
        <p>Regulamentação e diretrizes para participação em eventos Play12</p>
      </div>

      <div className="rules-container">
        <div className="rules-grid">
          {sections.map((section, index) => (
            <div key={index} className="rule-section">
              <h2>{section.title}</h2>
              <ul className="rule-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
