import React, { useMemo, useState } from 'react';
import '../styles/Scoreboard.css';

const SQUAD_NAMES = {
  BLUFOR: ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
  OPFOR: ['ECHO', 'FOXTROT', 'GOLF', 'HOTEL']
};

const ARMY_NAMES = {
  BLUFOR: 'BLUFOR\n(Exército Azul)',
  OPFOR: 'OPFOR\n(Exército Amarelo)'
};

export default function Scoreboard({ gameId, operadores = [], gameOperadores = [] }) {
  const [collapsedSquads, setCollapsedSquads] = useState(new Set());

  const toggleSquadCollapse = (key) => {
    const newCollapsed = new Set(collapsedSquads);
    if (newCollapsed.has(key)) {
      newCollapsed.delete(key);
    } else {
      newCollapsed.add(key);
    }
    setCollapsedSquads(newCollapsed);
  };

  // Organizar operadores em 2 exércitos e squads
  const { bluforSquads, opforSquads } = useMemo(() => {
    // Se temos gameOperadores (dados da API com team/squad), usar esses
    if (gameOperadores && gameOperadores.length > 0) {
      const createSquadsFromAPI = (teamName) => {
        const teamOps = gameOperadores.filter(go => go.team === teamName);
        return SQUAD_NAMES[teamName].map((squadName) => {
          const squadOps = teamOps.filter(go => go.squad === squadName);
          return {
            name: squadName,
            operadores: squadOps.map(go => ({
              id: go.operadorId,
              nickname: go.nickname || go.nomeCompleto,
              pontos: go.pontos || 0
            })),
            points: squadOps.reduce((sum, go) => sum + (go.pontos || 0), 0),
            count: squadOps.length
          };
        });
      };
      return {
        bluforSquads: createSquadsFromAPI('BLUFOR'),
        opforSquads: createSquadsFromAPI('OPFOR')
      };
    }

    // Fallback: distribuir operadores igualmente (comportamento antigo)
    const ops = operadores || [];
    const half = Math.ceil(ops.length / 2);
    
    const bluforOps = ops.slice(0, half);
    const opforOps = ops.slice(half);

    const createSquads = (opsArray, names) => {
      return names.map((name, idx) => {
        const opsPerSquad = Math.ceil(opsArray.length / 4);
        const start = idx * opsPerSquad;
        const end = start + opsPerSquad;
        const squadOps = opsArray.slice(start, end);
        
        return {
          name,
          operadores: squadOps,
          points: squadOps.reduce((sum, op) => sum + (op.pontos || 0), 0),
          count: squadOps.length
        };
      });
    };

    return {
      bluforSquads: createSquads(bluforOps, SQUAD_NAMES.BLUFOR),
      opforSquads: createSquads(opforOps, SQUAD_NAMES.OPFOR)
    };
  }, [operadores, gameOperadores]);

  const totalBlufor = bluforSquads.reduce((sum, sq) => sum + sq.points, 0);
  const totalOpfor = opforSquads.reduce((sum, sq) => sum + sq.points, 0);
  const totalBluforOps = bluforSquads.reduce((sum, sq) => sum + sq.count, 0);
  const totalOpforOps = opforSquads.reduce((sum, sq) => sum + sq.count, 0);

  const renderTeam = (armyKey, name, squads, totalPoints, totalOps) => (
    <div className={`scoreboard-team scoreboard-${armyKey}`}>
      <div className="team-header">
        <h2>{name}</h2>
        <div className="team-stats">
          <span><strong>4</strong> Squads</span>
          <span><strong>{totalOps}</strong> Operadores</span>
          <span className="total-points"><strong>{totalPoints}</strong> Pontos</span>
        </div>
      </div>

      <div className="squads-container">
        {squads.map((squad, idx) => {
          const squadKey = `${armyKey}-${idx}`;
          const isCollapsed = collapsedSquads.has(squadKey);
          
          return (
            <div key={idx} className={`squad-section ${isCollapsed ? 'collapsed' : ''}`}>
              <div className="squad-header">
                <button 
                  className="collapse-btn"
                  onClick={() => toggleSquadCollapse(squadKey)}
                  title={isCollapsed ? 'Expandir' : 'Colapsar'}
                >
                  {isCollapsed ? '▶' : '▼'}
                </button>
                <span className="squad-badge">{squad.name}</span>
                <div className="squad-info">
                  <span className="squad-meta">{squad.count} ops</span>
                  <span className="squad-points">{squad.points} pts</span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="operadores-list">
                  {squad.operadores.length === 0 ? (
                    <div className="empty-squad">Sem operadores</div>
                  ) : (
                    squad.operadores.map((op, opIdx) => (
                      <div key={op.id || opIdx} className="operador-item">
                        <span className="op-position">{opIdx + 1}</span>
                        <span className="op-nickname">{op.nickname}</span>
                        <span className="op-points">{op.pontos || 0}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-content">
        {renderTeam('blufor', ARMY_NAMES.BLUFOR, bluforSquads, totalBlufor, totalBluforOps)}
        
        <div className="scoreboard-divider">
          <div className="divider-line"></div>
          <span className="divider-text">VS</span>
          <div className="divider-line"></div>
        </div>

        {renderTeam('opfor', ARMY_NAMES.OPFOR, opforSquads, totalOpfor, totalOpforOps)}
      </div>
    </div>
  );
}
