import { Operador, Time, Evento, EventoStatus, EventoTipo, RankingEntry } from '../types';

// Mock Times
export const times: Time[] = [
  {
    id: 't1',
    nome: 'Bravo Team',
    tag: 'BRV',
    descricao: 'Unidade de reconhecimento e assalto tático.',
    membros_count: 5,
    pontos_totais: 1500,
    jogos_participados: 3,
    lider_id: 'op1'
  },
  {
    id: 't2',
    nome: 'Pimenta Maioral',
    tag: 'PMT',
    descricao: 'Força de supressão e infantaria pesada.',
    membros_count: 8,
    pontos_totais: 1200,
    jogos_participados: 2,
    lider_id: 'op3'
  },
  {
    id: 't3',
    nome: 'Night Stalkers',
    tag: 'NST',
    descricao: 'Especialistas em operações noturnas e furtividade.',
    membros_count: 4,
    pontos_totais: 800,
    jogos_participados: 4,
    lider_id: 'op4'
  },
  {
    id: 't4',
    nome: 'Echo Squad',
    tag: 'ECO',
    descricao: 'Unidade de treinamento e recrutamento.',
    membros_count: 2,
    pontos_totais: 100,
    jogos_participados: 1,
    lider_id: 'op5'
  }
];

// Mock Operadores
export const operadores: Operador[] = [
  {
    id: 'op1',
    apelido: 'SANDMAN',
    nome_completo: 'Carlos Silva',
    patente: 'CAPITÃO',
    squad_id: 't1',
    squad_nome: 'Bravo Team',
    jogos_participados: 12,
    pontos: 1500,
    email: 'carlos@exemplo.com',
    data_cadastro: '2025-01-10',
    loadout: ['M4A1 SOPMOD', 'Glock 17'],
    status: 'ONLINE'
  },
  {
    id: 'op2',
    apelido: 'VIPER',
    nome_completo: 'Mariana Costa',
    patente: 'TENENTE',
    squad_id: 't1',
    squad_nome: 'Bravo Team',
    jogos_participados: 10,
    pontos: 1200,
    email: 'mari@exemplo.com',
    data_cadastro: '2025-01-15',
    loadout: ['MP5 SD6', '1911 Tac'],
    status: 'OFFLINE'
  },
  {
    id: 'op3',
    apelido: 'PIMENTA',
    nome_completo: 'João Pimenta',
    patente: 'SARGENTO',
    squad_id: 't2',
    squad_nome: 'Pimenta Maioral',
    jogos_participados: 5,
    pontos: 400,
    email: 'pimenta@exemplo.com',
    data_cadastro: '2025-02-01',
    loadout: ['PKM', 'Desert Eagle'],
    status: 'EM_COMBATE'
  },
  {
    id: 'op4',
    apelido: 'GHOST',
    nome_completo: 'Admin User',
    patente: 'COMANDANTE',
    squad_id: null,
    squad_nome: undefined,
    jogos_participados: 0,
    pontos: 0,
    email: 'admin@play12.com',
    data_cadastro: '2024-12-01',
    loadout: ['Classified'],
    status: 'ONLINE'
  }
];

// Mock Eventos
export const eventos: Evento[] = [
  {
    id: 'evt1',
    nome: 'OPERAÇÃO RED WINGS',
    data: '2026-02-15',
    horario: '0100H',
    tipo: EventoTipo.MILSIM,
    status: EventoStatus.BRIEFING,
    local: {
      endereco: 'Serra do Rola Moça, Sector 7',
      coords: '20°03\'22"S 44°02\'03"W',
      maps_url: 'https://google.com/maps'
    },
    confirmados: 6,
    intel: 'Reconhecimento de área hostil. Presença confirmada de insurgentes. Engajamento autorizado.'
  },
  {
    id: 'evt2',
    nome: 'TREINO TÁTICO: C.Q.B.',
    data: '2026-02-22',
    horario: '0800H',
    tipo: EventoTipo.CQB,
    status: EventoStatus.BRIEFING,
    local: {
      endereco: 'Fábrica Abandonada, Contagem',
      coords: '19°55\'12"S 43°58\'10"W',
      maps_url: 'https://google.com/maps'
    },
    confirmados: 1,
    intel: 'Treinamento de progressão em ambiente confinado. Uso obrigatório de tracer.'
  },
  {
    id: 'evt3',
    nome: 'BENEFICENTE: IRON RAIN',
    data: '2026-01-15',
    horario: '0900H',
    tipo: EventoTipo.WOODLAND,
    status: EventoStatus.DEBRIEFING,
    local: {
      endereco: 'Arena Play12 HQ',
      coords: '19°50\'00"S 43°50\'00"W',
      maps_url: 'https://google.com/maps'
    },
    confirmados: 45,
    intel: 'Operação concluída com sucesso. Arrecadação de 200kg de alimentos.'
  }
];

// Mock Ranking
export const ranking: RankingEntry[] = times.map((time, index) => ({
  posicao: index + 1,
  time: time,
  operadores_count: time.membros_count,
  jogos_jogados: time.jogos_participados,
  pontos: time.pontos_totais
})).sort((a, b) => b.pontos - a.pontos);
