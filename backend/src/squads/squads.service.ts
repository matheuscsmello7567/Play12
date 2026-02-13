import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSquadDto, UpdateSquadDto } from './dto/squad.dto';
import { Specialty } from '@prisma/client';

@Injectable()
export class SquadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSquadDto, leaderId: number) {
    // Check unique name
    const existing = await this.prisma.squad.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Nome de unidade já existe');

    const squad = await this.prisma.squad.create({
      data: {
        name: dto.name,
        tag: dto.tag,
        description: dto.description,
        specialty: (dto.specialty as Specialty) || 'ASSALTO',
        state: dto.state,
        leaderId,
        totalMembers: 1 + (dto.memberIds?.length || 0),
        members: {
          create: [
            { operatorId: leaderId }, // Leader is always a member
            ...(dto.memberIds?.map(id => ({ operatorId: id })) || []),
          ],
        },
      },
      include: {
        leader: { select: { id: true, nickname: true } },
        members: {
          select: {
            operator: { select: { id: true, nickname: true } },
          },
        },
      },
    });

    // Promote leader role
    await this.prisma.operator.update({
      where: { id: leaderId },
      data: { role: 'SQUAD_LEADER' },
    });

    return squad;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [squads, total] = await Promise.all([
      this.prisma.squad.findMany({
        where: { isActive: true },
        include: {
          leader: { select: { id: true, nickname: true } },
          _count: { select: { members: true } },
        },
        orderBy: { totalGamesPlayed: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.squad.count({ where: { isActive: true } }),
    ]);

    return {
      data: squads,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const squad = await this.prisma.squad.findUnique({
      where: { id },
      include: {
        leader: { select: { id: true, nickname: true, avatarUrl: true } },
        members: {
          select: {
            joinedAt: true,
            operator: {
              select: { id: true, nickname: true, fullName: true, avatarUrl: true, role: true, totalGames: true },
            },
          },
        },
        ranking: true,
        gameSquads: {
          select: {
            game: { select: { id: true, name: true, startDate: true, status: true } },
          },
          orderBy: { game: { startDate: 'desc' } },
          take: 10,
        },
      },
    });

    if (!squad) throw new NotFoundException('Unidade não encontrada');
    return squad;
  }

  async update(id: number, dto: UpdateSquadDto, userId: number) {
    const squad = await this.ensureExists(id);
    if (squad.leaderId !== userId) {
      throw new ForbiddenException('Apenas o comandante pode editar a unidade');
    }

    return this.prisma.squad.update({
      where: { id },
      data: {
        ...dto,
        specialty: dto.specialty ? (dto.specialty as Specialty) : undefined,
      },
    });
  }

  async addMember(squadId: number, operatorId: number, userId: number) {
    const squad = await this.ensureExists(squadId);
    if (squad.leaderId !== userId) {
      throw new ForbiddenException('Apenas o comandante pode adicionar membros');
    }

    // Check if already a member
    const existing = await this.prisma.squadMember.findUnique({
      where: { squadId_operatorId: { squadId, operatorId } },
    });
    if (existing) throw new ConflictException('Operador já é membro desta unidade');

    await this.prisma.squadMember.create({
      data: { squadId, operatorId },
    });

    await this.prisma.squad.update({
      where: { id: squadId },
      data: { totalMembers: { increment: 1 } },
    });

    return { message: 'Operador adicionado à unidade' };
  }

  async removeMember(squadId: number, operatorId: number, userId: number) {
    const squad = await this.ensureExists(squadId);
    if (squad.leaderId !== userId && operatorId !== userId) {
      throw new ForbiddenException('Sem permissão para remover este membro');
    }

    await this.prisma.squadMember.delete({
      where: { squadId_operatorId: { squadId, operatorId } },
    });

    await this.prisma.squad.update({
      where: { id: squadId },
      data: { totalMembers: { decrement: 1 } },
    });

    return { message: 'Operador removido da unidade' };
  }

  private async ensureExists(id: number) {
    const squad = await this.prisma.squad.findUnique({ where: { id } });
    if (!squad) throw new NotFoundException('Unidade não encontrada');
    return squad;
  }
}
