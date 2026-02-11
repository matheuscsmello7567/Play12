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

        <div className="rules-additional">
          <h2>INFORMAÇÕES IMPORTANTES</h2>
          <div className="info-box">
            <h3>Verificação de Equipamento</h3>
            <p>
              Todo equipamento deve ser inspecionado antes de cada evento. Equipamentos com irregularidades não serão permitidas na área de jogo.
            </p>
          </div>



          <div className="info-box">
            <h3>Processo de Reclamação</h3>
            <p>
              Reclamações sobre outro operador ou outra equipe devem ser feitas imediatamente a um ranger. Decisões finais são tomadas pela organização do evento.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
