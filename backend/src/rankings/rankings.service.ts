import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private prisma: PrismaService) {}

  async getFullRanking(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [rankings, total] = await Promise.all([
      this.prisma.ranking.findMany({
        where: { isActive: true },
        include: {
          squad: {
            select: {
              id: true,
              name: true,
              tag: true,
              totalMembers: true,
              totalGamesPlayed: true,
              leader: { select: { id: true, nickname: true } },
            },
          },
        },
        orderBy: { position: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.ranking.count({ where: { isActive: true } }),
    ]);

    return {
      data: rankings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSquadRanking(squadId: number) {
    const ranking = await this.prisma.ranking.findUnique({
      where: { squadId },
      include: {
        squad: {
          select: { id: true, name: true, tag: true, totalMembers: true },
        },
      },
    });

    if (!ranking) throw new NotFoundException('Ranking não encontrado para esta unidade');
    return ranking;
  }

  /**
   * Recalcula o ranking inteiro baseado nos pontos.
   * Deve ser chamado após a conclusão de um jogo.
   */
  async recalculate() {
    const rankings = await this.prisma.ranking.findMany({
      where: { isActive: true },
      orderBy: { totalPoints: 'desc' },
    });

    const updates = rankings.map((r, index) =>
      this.prisma.ranking.update({
        where: { id: r.id },
        data: {
          position: index + 1,
          winRate: r.gamesPlayed > 0 ? (r.gamesWon / r.gamesPlayed) * 100 : 0,
          averageEliminationsPerGame: r.gamesPlayed > 0
            ? r.totalEliminations / r.gamesPlayed
            : 0,
        },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Ranking recalculado', totalSquads: rankings.length };
  }
}
