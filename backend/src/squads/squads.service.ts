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

    // Check if operator already leads a squad
    const alreadyLeads = await this.prisma.squad.findFirst({ where: { leaderId, isActive: true } });
    if (alreadyLeads) throw new ConflictException('Você já é líder de uma unidade. Cada operador só pode liderar uma unidade.');

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

  // ==================== Join Requests ====================

  async createJoinRequest(squadId: number, operatorId: number) {
    const squad = await this.ensureExists(squadId);

    // Can't request to join own squad as leader
    if (squad.leaderId === operatorId) {
      throw new ConflictException('Você já é o líder desta unidade');
    }

    // Check if already a member
    const existingMember = await this.prisma.squadMember.findUnique({
      where: { squadId_operatorId: { squadId, operatorId } },
    });
    if (existingMember) throw new ConflictException('Você já é membro desta unidade');

    // Check if already has a pending request
    const existingRequest = await this.prisma.joinRequest.findUnique({
      where: { squadId_operatorId: { squadId, operatorId } },
    });
    if (existingRequest && existingRequest.status === 'PENDING') {
      throw new ConflictException('Você já tem uma solicitação pendente para esta unidade');
    }

    // Upsert: if rejected before, allow re-requesting
    if (existingRequest) {
      return this.prisma.joinRequest.update({
        where: { id: existingRequest.id },
        data: { status: 'PENDING', updatedAt: new Date() },
      });
    }

    return this.prisma.joinRequest.create({
      data: { squadId, operatorId },
    });
  }

  async getJoinRequests(squadId: number, userId: number) {
    const squad = await this.ensureExists(squadId);
    if (squad.leaderId !== userId) {
      throw new ForbiddenException('Apenas o comandante pode ver solicitações');
    }

    return this.prisma.joinRequest.findMany({
      where: { squadId, status: 'PENDING' },
      include: {
        operator: {
          select: { id: true, nickname: true, fullName: true, avatarUrl: true, totalGames: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respondJoinRequest(requestId: number, userId: number, accept: boolean) {
    const request = await this.prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { squad: true },
    });

    if (!request) throw new NotFoundException('Solicitação não encontrada');
    if (request.squad.leaderId !== userId) {
      throw new ForbiddenException('Apenas o comandante pode responder solicitações');
    }
    if (request.status !== 'PENDING') {
      throw new ConflictException('Esta solicitação já foi processada');
    }

    if (accept) {
      // Add as member
      await this.prisma.squadMember.create({
        data: { squadId: request.squadId, operatorId: request.operatorId },
      });
      await this.prisma.squad.update({
        where: { id: request.squadId },
        data: { totalMembers: { increment: 1 } },
      });
    }

    return this.prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: accept ? 'ACCEPTED' : 'REJECTED' },
    });
  }
}
