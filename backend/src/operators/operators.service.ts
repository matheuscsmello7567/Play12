import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [operators, total] = await Promise.all([
      this.prisma.operator.findMany({
        where: { isActive: true },
        select: {
          id: true,
          nickname: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          totalGames: true,
          engagementScore: true,
          createdAt: true,
          squads: {
            select: {
              squad: { select: { id: true, name: true, tag: true } },
            },
          },
        },
        orderBy: { engagementScore: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.operator.count({ where: { isActive: true } }),
    ]);

    return {
      data: operators,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        totalGames: true,
        engagementScore: true,
        verified: true,
        createdAt: true,
        squads: {
          select: {
            joinedAt: true,
            squad: { select: { id: true, name: true, tag: true } },
          },
        },
      },
    });

    if (!operator || !(await this.isActive(id))) {
      throw new NotFoundException('Operador não encontrado');
    }

    return operator;
  }

  async update(id: number, dto: UpdateOperatorDto) {
    await this.ensureExists(id);

    return this.prisma.operator.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        nickname: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
      },
    });
  }

  async deactivate(id: number) {
    await this.ensureExists(id);

    return this.prisma.operator.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async search(query: string) {
    return this.prisma.operator.findMany({
      where: {
        isActive: true,
        OR: [
          { nickname: { contains: query, mode: 'insensitive' } },
          { fullName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        nickname: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
      take: 10,
    });
  }

  private async ensureExists(id: number) {
    const op = await this.prisma.operator.findUnique({ where: { id } });
    if (!op) throw new NotFoundException('Operador não encontrado');
    return op;
  }

  private async isActive(id: number): Promise<boolean> {
    const op = await this.prisma.operator.findUnique({ where: { id }, select: { isActive: true } });
    return op?.isActive ?? false;
  }
}
