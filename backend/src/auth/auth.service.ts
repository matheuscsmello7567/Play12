import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly COOKIE_NAME = 'play12_token';

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    // Check if email or nickname already exist
    const existing = await this.prisma.operator.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { nickname: dto.nickname },
        ],
      },
    });

    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException('E-mail já registrado');
      }
      throw new ConflictException('Codinome já em uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const operator = await this.prisma.operator.create({
      data: {
        nickname: dto.nickname,
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        phone: dto.phone,
      },
    });

    const token = this.generateToken(operator.id, operator.role);
    this.setTokenCookie(res, token);

    return {
      operator: this.sanitize(operator),
    };
  }

  async login(dto: LoginDto, res: Response) {
    const operator = await this.prisma.operator.findUnique({
      where: { email: dto.email },
    });

    if (!operator || !operator.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, operator.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateToken(operator.id, operator.role);
    this.setTokenCookie(res, token);

    return {
      operator: this.sanitize(operator),
    };
  }

  logout(res: Response) {
    res.clearCookie(this.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return { message: 'Logout realizado com sucesso' };
  }

  async validateOperator(id: number) {
    const operator = await this.prisma.operator.findUnique({ where: { id } });
    if (!operator || !operator.isActive) {
      throw new UnauthorizedException('Operador não encontrado ou inativo');
    }
    return operator;
  }

  private generateToken(operatorId: number, role: string) {
    return this.jwtService.sign({
      sub: operatorId,
      role,
    });
  }

  private setTokenCookie(res: Response, token: string) {
    const expiration = this.configService.get<string>('JWT_EXPIRATION', '7d');
    const maxAgeMs = this.parseExpirationToMs(expiration);

    res.cookie(this.COOKIE_NAME, token, {
      httpOnly: true,                                    // JS não consegue ler
      secure: process.env.NODE_ENV === 'production',     // HTTPS only em prod
      sameSite: 'strict',                                // Protege contra CSRF
      path: '/',
      maxAge: maxAgeMs,
    });
  }

  private parseExpirationToMs(exp: string): number {
    const match = exp.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback 7 dias
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] || 24 * 60 * 60 * 1000);
  }

  private sanitize(operator: any) {
    const { password, ...result } = operator;
    return result;
  }
}
