// Mock data para uso offline/desenvolvimento local
export const mockGames = [
  {
    id: 1,
    titulo: "Operação Hotel Betim",
    data: "2026-02-10",
    horario: "14:00",
    tipo: "MILSIM",
    local: "Hotel Betim Lda",
    confirmados: 32,
    status: "Próximo"
  },
  {
    id: 2,
    titulo: "Encontro de Entusiastas do Airsoft",
    data: "2026-02-15",
    horario: "10:00",
    tipo: "TREINO",
    local: "Clube dos Guerreiros RJ",
    confirmados: 18,
    status: "Próximo"
  },
  {
    id: 3,
    titulo: "Operação Hotel Betim",
    data: "2026-02-20",
    horario: "14:00",
    tipo: "MILSIM",
    local: "Hotel Betim Lda",
    confirmados: 45,
    status: "Próximo"
  }
];

export const mockOperadores = [
  {
    id: 1,
    nickname: "Player1",
    nomeCompleto: "João Silva",
    squadNome: "Alfa Squad",
    pontos: 150
  },
  {
    id: 2,
    nickname: "Player2",
    nomeCompleto: "Maria Santos",
    squadNome: "Bravo Team",
    pontos: 120
  }
];

export const mockSquads = [
  {
    id: 1,
    nome: "Alfa Squad",
    descricao: "Squad principal",
    membros: 5
  },
  {
    id: 2,
    nome: "Bravo Team",
    descricao: "Segunda equipe",
    membros: 4
  }
];

export const mockDashboard = {
  totalJogadores: 45,
  confirmados: 32,
  jogosAgendados: 12,
  proximosJogos: mockGames
};
