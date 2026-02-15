import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns the first admin (lowest ID with ADMIN role).
   * Only this user can promote/demote operators.
   */
  private async getFirstAdminId(): Promise<number | null> {
    const firstAdmin = await this.prisma.operator.findFirst({
      where: { role: 'ADMIN', isActive: true },
      orderBy: { id: 'asc' },
      select: { id: true },
    });
    return firstAdmin?.id ?? null;
  }

  /**
   * Verifies the requesting user is the first admin.
   */
  private async ensureFirstAdmin(userId: number): Promise<void> {
    const firstAdminId = await this.getFirstAdminId();
    if (firstAdminId !== userId) {
      throw new ForbiddenException('Apenas o administrador principal pode realizar esta ação');
    }
  }

  /**
   * Dashboard stats for admin panel.
   */
  async getStats() {
    const [totalOperators, activeOperators, totalSquads, activeSquads, totalGames, totalPayments, confirmedPayments] = await Promise.all([
      this.prisma.operator.count(),
      this.prisma.operator.count({ where: { isActive: true } }),
      this.prisma.squad.count(),
      this.prisma.squad.count({ where: { isActive: true } }),
      this.prisma.game.count(),
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: { in: ['CONFIRMED', 'RECEIVED'] } } }),
    ]);

    // Next upcoming game
    const nextGame = await this.prisma.game.findFirst({
      where: { isActive: true, startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      include: {
        gameSquads: {
          select: { squad: { select: { id: true, name: true, tag: true, totalMembers: true } } },
        },
        gameOperators: {
          select: {
            operator: { select: { id: true, nickname: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });

    return {
      totalOperators,
      activeOperators,
      inactiveOperators: totalOperators - activeOperators,
      totalSquads,
      activeSquads,
      totalGames,
      totalPayments,
      confirmedPayments,
      nextGame,
    };
  }

  /**
   * List all operators with full details (admin view).
   */
  async listOperators(page = 1, limit = 20, search?: string, role?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { nickname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [operators, total] = await Promise.all([
      this.prisma.operator.findMany({
        where,
        select: {
          id: true,
          nickname: true,
          email: true,
          fullName: true,
          phone: true,
          avatarUrl: true,
          role: true,
          totalGames: true,
          engagementScore: true,
          verified: true,
          isActive: true,
          createdAt: true,
          squads: {
            select: {
              squad: { select: { id: true, name: true, tag: true } },
            },
          },
          ledSquads: {
            select: { id: true, name: true, tag: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.operator.count({ where }),
    ]);

    return {
      data: operators,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Change an operator's role. Only the first admin can do this.
   */
  async changeRole(userId: number, targetId: number, newRole: string) {
    await this.ensureFirstAdmin(userId);

    if (userId === targetId) {
      throw new ConflictException('Você não pode alterar seu próprio cargo');
    }

    const validRoles = ['PLAYER', 'SQUAD_LEADER', 'ORGANIZER', 'ADMIN'];
    if (!validRoles.includes(newRole)) {
      throw new ConflictException(`Cargo inválido. Use: ${validRoles.join(', ')}`);
    }

    const target = await this.prisma.operator.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('Operador não encontrado');

    return this.prisma.operator.update({
      where: { id: targetId },
      data: { role: newRole as any },
      select: {
        id: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  /**
   * Toggle operator active status. Only the first admin can do this.
   */
  async toggleActive(userId: number, targetId: number) {
    await this.ensureFirstAdmin(userId);

    if (userId === targetId) {
      throw new ConflictException('Você não pode desativar sua própria conta');
    }

    const target = await this.prisma.operator.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('Operador não encontrado');

    return this.prisma.operator.update({
      where: { id: targetId },
      data: { isActive: !target.isActive },
      select: {
        id: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  /**
   * Toggle operator verified status. Only the first admin can do this.
   */
  async toggleVerified(userId: number, targetId: number) {
    await this.ensureFirstAdmin(userId);

    const target = await this.prisma.operator.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('Operador não encontrado');

    return this.prisma.operator.update({
      where: { id: targetId },
      data: { verified: !target.verified },
      select: {
        id: true,
        nickname: true,
        verified: true,
      },
    });
  }

  /**
   * Check if a user is the first admin (for frontend UI control).
   */
  async isFirstAdmin(userId: number): Promise<boolean> {
    const firstAdminId = await this.getFirstAdminId();
    return firstAdminId === userId;
  }

  /**
   * Update operator engagement score (points). Admin only.
   */
  async updateOperatorPoints(userId: number, targetId: number, points: number) {
    await this.ensureFirstAdmin(userId);

    const target = await this.prisma.operator.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('Operador não encontrado');

    return this.prisma.operator.update({
      where: { id: targetId },
      data: { engagementScore: points },
      select: { id: true, nickname: true, engagementScore: true },
    });
  }

  /**
   * List all squads with admin details.
   */
  async listSquads(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tag: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.squad.findMany({
      where,
      select: {
        id: true,
        name: true,
        tag: true,
        totalMembers: true,
        totalWins: true,
        status: true,
        leader: { select: { id: true, nickname: true } },
        members: {
          select: {
            operator: { select: { id: true, nickname: true, fullName: true, avatarUrl: true } },
          },
        },
        ranking: { select: { totalPoints: true, position: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
}
