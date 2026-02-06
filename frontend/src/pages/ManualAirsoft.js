import React from 'react';
import './ManualAirsoft.css';

export default function ManualAirsoft() {
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
      title: "Informações de Energia",
      items: [
        "Pistola até 350 (sem limite mínimo de distância)",
        "Rifles até 400 (Sem limite mínimo de distância)",
        "DMR até 450 (Mínimo de 10m+)",
        "Sniper até 500 (Mínimo de 20m+)"
      ]
    }
  ];

  return (
    <div className="manual-page">
      <div className="manual-header">
        <h1>MANUAL DO AIRSOFT</h1>
        <p>Regulamentação, diretrizes e legislação para participação em eventos Play12</p>
      </div>

      <div className="manual-container">
        <div className="manual-grid">
          {sections.map((section, index) => (
            <div key={index} className="manual-section">
              <h2>{section.title}</h2>
              <ul className="manual-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="manual-additional">
          <h2>INFORMAÇÕES IMPORTANTES</h2>
          <div className="info-box">
            <h3>Verificação de Equipamento</h3>
            <p>
              Todo equipamento deve ser inspecionado antes de cada evento. Equipamentos com irregularidades não serão permitidas na área de jogo.
            </p>
          </div>

          <div className="info-box">
            <h3>Limites de Energia</h3>
            <p>
              <strong>Pistola:</strong> até 350 (Sem limite mínimo de distância)<br/>
              <strong>Rifles:</strong> até 400 (Sem limite mínimo de distância)<br/>
              <strong>DMR:</strong> até 450 (Mínimo de 10m+)<br/>
              <strong>Sniper:</strong> até 500 (Mínimo de 20m+)
            </p>
          </div>

          <div className="info-box">
            <h3>Processo de Reclamação</h3>
            <p>
              Reclamações sobre outro operador ou outra equipe devem ser feitas imediatamente a um ranger. Decisões finais são tomadas pela organização do evento.
            </p>
          </div>
        </div>

        <div className="legislacao-section">
          <h2>LEGISLAÇÃO DO AIRSOFT</h2>
          <div className="legislacao-content">
            <div className="legislacao-box">
              <h3>Lei Federal (Brasil)</h3>
              <p>
                O airsoft é regulado pela Lei nº 12.446/2011 que dispõe sobre a importação e comercialização de réplicas e modelos de armas de fogo.
                Essas réplicas possuem cores diferentes das armas reais conforme determinado pela lei.
              </p>
            </div>

            <div className="legislacao-box">
              <h3>Regulamentação de Uso</h3>
              <p>
                Airsoft deverá ser praticado somente em locais autorizados e privados. O transporte de réplicas deve estar em malas ou estojos adequados.
                O porte de réplicas em vias públicas é proibido.
              </p>
            </div>

            <div className="legislacao-box">
              <h3>Classificação de Energia</h3>
              <p>
                Réplicas com fps (feet per second) agressivos não são permitidas conforme regulamentação do evento.
                A verificação técnica é obrigatória antes de cada jogo.
              </p>
            </div>

            <div className="legislacao-box">
              <h3>Segurança Pessoal</h3>
              <p>
                O uso de equipamento de proteção é imprescindível: óculos de proteção, colete tático (recomendado) e proteção facial.
                Operadores menores de idade devem estar acompanhados por responsáveis legais.
              </p>
            </div>

            <div className="legislacao-box">
              <h3>Responsabilidade Civil</h3>
              <p>
                Todo participante é responsável por seus equipamentos e pela sua conduta. Acidentes causados por negligência serão de responsabilidade do operador.
                A organização não se responsabiliza por acidentes durante a prática.
              </p>
            </div>

            <div className="legislacao-box">
              <h3>Direitos e Deveres</h3>
              <p>
                Todos os operadores têm direito a um ambiente seguro e respeitoso. Qualquer violação das regras pode resultar em expulsão
                e possível banimento das futuras atividades da Play12.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
