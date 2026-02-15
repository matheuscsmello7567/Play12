import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { GameType, GameStatus } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGameDto, userId: number) {
    // Ensure user is ORGANIZER or ADMIN
    const user = await this.prisma.operator.findUnique({ where: { id: userId } });
    if (!user || !['ORGANIZER', 'ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Apenas organizadores podem criar eventos');
    }

    return this.prisma.game.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        description: dto.description,
        location: dto.location,
        locationCoords: dto.locationCoords,
        locationMapsUrl: dto.locationMapsUrl,
        maxPlayers: dto.maxPlayers,
        gameType: (dto.gameType as GameType) || 'MILSIM',
        registrationFee: dto.registrationFee || 0,
        status: 'SCHEDULED',
      },
    });
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    if (status) where.status = status;

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        include: {
          _count: { select: { gameSquads: true } },
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.game.count({ where }),
    ]);

    return {
      data: games,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        gameSquads: {
          select: {
            joinedAt: true,
            squad: {
              select: { id: true, name: true, tag: true, totalMembers: true },
            },
          },
        },
      },
    });

    if (!game) throw new NotFoundException('Evento não encontrado');
    return game;
  }

  async update(id: number, dto: UpdateGameDto) {
    await this.ensureExists(id);

    return this.prisma.game.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status as GameStatus | undefined,
      },
    });
  }

  async registerSquad(gameId: number, squadId: number) {
    const game = await this.ensureExists(gameId);

    if (game.status !== 'REGISTRATION_OPEN' && game.status !== 'SCHEDULED') {
      throw new BadRequestException('Inscrições não estão abertas para este evento');
    }

    // Check if already registered
    const existing = await this.prisma.gameSquad.findUnique({
      where: { gameId_squadId: { gameId, squadId } },
    });
    if (existing) throw new BadRequestException('Squad já inscrito neste evento');

    // Check max players
    const squad = await this.prisma.squad.findUnique({ where: { id: squadId } });
    if (!squad) throw new NotFoundException('Squad não encontrado');

    if (game.maxPlayers && (game.currentPlayers + squad.totalMembers) > game.maxPlayers) {
      throw new BadRequestException('Evento lotado, não há vagas suficientes');
    }

    await this.prisma.gameSquad.create({
      data: { gameId, squadId },
    });

    await this.prisma.game.update({
      where: { id: gameId },
      data: { currentPlayers: { increment: squad.totalMembers } },
    });

    return { message: 'Squad inscrito com sucesso no evento' };
  }

  async unregisterSquad(gameId: number, squadId: number) {
    const game = await this.ensureExists(gameId);

    const squad = await this.prisma.squad.findUnique({ where: { id: squadId } });
    if (!squad) throw new NotFoundException('Squad não encontrado');

    await this.prisma.gameSquad.delete({
      where: { gameId_squadId: { gameId, squadId } },
    });

    await this.prisma.game.update({
      where: { id: gameId },
      data: { currentPlayers: { decrement: squad.totalMembers } },
    });

    return { message: 'Inscrição do squad cancelada' };
  }

  // ── Individual Operator registration ──

  async registerOperator(gameId: number, operatorId: number) {
    const game = await this.ensureExists(gameId);

    if (game.status !== 'REGISTRATION_OPEN' && game.status !== 'SCHEDULED') {
      throw new BadRequestException('Inscrições não estão abertas para este evento');
    }

    const existing = await this.prisma.gameOperator.findUnique({
      where: { gameId_operatorId: { gameId, operatorId } },
    });
    if (existing) throw new BadRequestException('Operador já inscrito neste evento');

    const operator = await this.prisma.operator.findUnique({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operador não encontrado');

    if (game.maxPlayers && game.currentPlayers + 1 > game.maxPlayers) {
      throw new BadRequestException('Evento lotado, não há vagas suficientes');
    }

    await this.prisma.gameOperator.create({ data: { gameId, operatorId } });

    await this.prisma.game.update({
      where: { id: gameId },
      data: { currentPlayers: { increment: 1 } },
    });

    return { message: 'Operador inscrito com sucesso no evento' };
  }

  async unregisterOperator(gameId: number, operatorId: number) {
    await this.ensureExists(gameId);

    const operator = await this.prisma.operator.findUnique({ where: { id: operatorId } });
    if (!operator) throw new NotFoundException('Operador não encontrado');

    await this.prisma.gameOperator.delete({
      where: { gameId_operatorId: { gameId, operatorId } },
    });

    await this.prisma.game.update({
      where: { id: gameId },
      data: { currentPlayers: { decrement: 1 } },
    });

    return { message: 'Inscrição do operador cancelada' };
  }

  async listGameOperators(gameId: number) {
    await this.ensureExists(gameId);

    return this.prisma.gameOperator.findMany({
      where: { gameId },
      select: {
        operatorId: true,
        joinedAt: true,
        operator: {
          select: { id: true, nickname: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  private async ensureExists(id: number) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Evento não encontrado');
    return game;
  }
}
