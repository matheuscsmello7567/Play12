export interface Operador {
  id: string;
  apelido: string; // Callsign
  nome_completo: string;
  patente: string; // New: Recruta, Soldado, Cabo, etc.
  squad_id: string | null;
  squad_nome?: string;
  jogos_participados: number;
  pontos: number; // XP
  email: string;
  data_cadastro: string;
  loadout: string[]; // New: List of weapons
  status: 'ONLINE' | 'OFFLINE' | 'EM_COMBATE';
}

export interface Time {
  id: string;
  nome: string;
  descricao: string;
  membros_count: number;
  pontos_totais: number;
  jogos_participados: number;
  lider_id: string;
  tag: string; // New: e.g. [BRAVO]
}

export enum EventoStatus {
  BRIEFING = 'BRIEFING', // Inscrições abertas
  MOBILIZACAO = 'MOBILIZAÇÃO', // Dia do jogo
  COMBATE = 'EM COMBATE', // Rolando
  DEBRIEFING = 'DEBRIEFING', // Encerrado
  CANCELADO = 'ABORTADO'
}

export enum EventoTipo {
  MILSIM = 'MILSIM',
  CQB = 'CQB',
  WOODLAND = 'WOODLAND'
}

export interface Evento {
  id: string;
  nome: string; // Operation Name
  data: string; // ISO date string YYYY-MM-DD
  horario: string;
  tipo: EventoTipo;
  status: EventoStatus;
  local: {
    endereco: string;
    coords: string; // GPS Coordinates visual
    maps_url: string;
  };
  confirmados: number;
  intel?: string; // Briefing text
}

export interface RankingEntry {
  posicao: number;
  time: Time;
  operadores_count: number;
  jogos_jogados: number;
  pontos: number;
}
