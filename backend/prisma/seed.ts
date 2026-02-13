import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Play12 database...');

  // ── Operators ─────────────────────────────────────
  const password = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.operator.upsert({
    where: { email: 'admin@play12.com' },
    update: {},
    create: {
      nickname: 'OVERLORD',
      email: 'admin@play12.com',
      password,
      fullName: 'Administrador Play12',
      role: 'ADMIN',
      verified: true,
    },
  });

  const leader1 = await prisma.operator.upsert({
    where: { email: 'maverick@play12.com' },
    update: {},
    create: {
      nickname: 'Maverick',
      email: 'maverick@play12.com',
      password,
      fullName: 'Carlos Silva',
      role: 'SQUAD_LEADER',
      verified: true,
      totalGames: 12,
      engagementScore: 87.5,
    },
  });

  const leader2 = await prisma.operator.upsert({
    where: { email: 'venom@play12.com' },
    update: {},
    create: {
      nickname: 'Venom',
      email: 'venom@play12.com',
      password,
      fullName: 'Rafael Santos',
      role: 'SQUAD_LEADER',
      verified: true,
      totalGames: 8,
      engagementScore: 72.0,
    },
  });

  const op1 = await prisma.operator.upsert({
    where: { email: 'ghost@play12.com' },
    update: {},
    create: {
      nickname: 'Ghost',
      email: 'ghost@play12.com',
      password,
      fullName: 'Pedro Almeida',
      role: 'PLAYER',
      totalGames: 5,
      engagementScore: 60.0,
    },
  });

  const op2 = await prisma.operator.upsert({
    where: { email: 'shadow@play12.com' },
    update: {},
    create: {
      nickname: 'Shadow',
      email: 'shadow@play12.com',
      password,
      fullName: 'Ana Oliveira',
      role: 'PLAYER',
      totalGames: 3,
      engagementScore: 45.0,
    },
  });

  const op3 = await prisma.operator.upsert({
    where: { email: 'raptor@play12.com' },
    update: {},
    create: {
      nickname: 'Raptor',
      email: 'raptor@play12.com',
      password,
      fullName: 'Lucas Mendes',
      role: 'PLAYER',
      totalGames: 7,
      engagementScore: 65.0,
    },
  });

  const organizer = await prisma.operator.upsert({
    where: { email: 'commander@play12.com' },
    update: {},
    create: {
      nickname: 'COMMANDER',
      email: 'commander@play12.com',
      password,
      fullName: 'Organizador Oficial',
      role: 'ORGANIZER',
      verified: true,
    },
  });

  console.log('✅ Operadores criados');

  // ── Squads ────────────────────────────────────────
  const bravoTeam = await prisma.squad.upsert({
    where: { name: 'Bravo Team' },
    update: {},
    create: {
      name: 'Bravo Team',
      tag: 'BRV',
      description: 'Unidade de reconhecimento e assalto tático.',
      specialty: 'ASSALTO',
      state: 'MG',
      leaderId: leader1.id,
      totalMembers: 4,
      totalGamesPlayed: 3,
      totalWins: 2,
    },
  });

  const nightStalkers = await prisma.squad.upsert({
    where: { name: 'Night Stalkers' },
    update: {},
    create: {
      name: 'Night Stalkers',
      tag: 'NST',
      description: 'Especialistas em operações noturnas e furtividade.',
      specialty: 'RECONHECIMENTO',
      state: 'SP',
      leaderId: leader2.id,
      totalMembers: 3,
      totalGamesPlayed: 2,
      totalWins: 1,
    },
  });

  console.log('✅ Squads criados');

  // ── Squad Members ─────────────────────────────────
  const memberPairs = [
    { squadId: bravoTeam.id, operatorId: leader1.id },
    { squadId: bravoTeam.id, operatorId: op1.id },
    { squadId: bravoTeam.id, operatorId: op2.id },
    { squadId: bravoTeam.id, operatorId: op3.id },
    { squadId: nightStalkers.id, operatorId: leader2.id },
    { squadId: nightStalkers.id, operatorId: admin.id },
    { squadId: nightStalkers.id, operatorId: organizer.id },
  ];

  for (const pair of memberPairs) {
    await prisma.squadMember.upsert({
      where: { squadId_operatorId: pair },
      update: {},
      create: pair,
    });
  }

  console.log('✅ Membros associados');

  // ── Games ─────────────────────────────────────────
  const game1 = await prisma.game.create({
    data: {
      name: 'OPERAÇÃO RED WINGS',
      startDate: new Date('2026-03-15T09:00:00Z'),
      endDate: new Date('2026-03-15T17:00:00Z'),
      description: 'Operação de reconhecimento em terreno montanhoso com objetivos múltiplos.',
      location: 'Serra do Rola Moça, Sector 7',
      locationCoords: '20°03\'22"S 44°02\'03"W',
      locationMapsUrl: 'https://google.com/maps',
      maxPlayers: 40,
      currentPlayers: 7,
      gameType: 'MILSIM',
      status: 'REGISTRATION_OPEN',
      registrationFee: 80.0,
    },
  });

  await prisma.game.create({
    data: {
      name: 'OPERAÇÃO BLACK MAMBA',
      startDate: new Date('2026-04-20T08:00:00Z'),
      endDate: new Date('2026-04-20T16:00:00Z'),
      description: 'CQB intensivo em área urbana simulada.',
      location: 'Campo CQB Central, BH',
      maxPlayers: 24,
      gameType: 'CQB',
      status: 'SCHEDULED',
      registrationFee: 60.0,
    },
  });

  console.log('✅ Eventos criados');

  // ── Game Squads ───────────────────────────────────
  await prisma.gameSquad.create({
    data: { gameId: game1.id, squadId: bravoTeam.id },
  });

  // ── Rankings ──────────────────────────────────────
  await prisma.ranking.upsert({
    where: { squadId: bravoTeam.id },
    update: {},
    create: {
      squadId: bravoTeam.id,
      position: 1,
      totalPoints: 150,
      gamesPlayed: 3,
      gamesWon: 2,
      gamesLost: 1,
      winRate: 66.7,
      totalEliminations: 45,
      averageEliminationsPerGame: 15.0,
    },
  });

  await prisma.ranking.upsert({
    where: { squadId: nightStalkers.id },
    update: {},
    create: {
      squadId: nightStalkers.id,
      position: 2,
      totalPoints: 100,
      gamesPlayed: 2,
      gamesWon: 1,
      gamesLost: 1,
      winRate: 50.0,
      totalEliminations: 22,
      averageEliminationsPerGame: 11.0,
    },
  });

  console.log('✅ Rankings criados');
  console.log('🎯 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
