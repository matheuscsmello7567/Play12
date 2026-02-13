import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

/**
 * PaymentsService
 * 
 * Preparado para integração com Asaas (https://docs.asaas.com).
 * Em desenvolvimento: os métodos de criação simulam a resposta do gateway.
 * Quando a API key do Asaas estiver configurada, os métodos enviarão
 * requisições reais para https://sandbox.asaas.com/api/v3.
 */
@Injectable()
export class PaymentsService {
  private asaasBaseUrl: string;
  private asaasApiKey: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.asaasBaseUrl = this.config.get('ASAAS_BASE_URL', 'https://sandbox.asaas.com/api/v3');
    this.asaasApiKey = this.config.get('ASAAS_API_KEY', '');
  }

  private isAsaasConfigured(): boolean {
    return !!this.asaasApiKey;
  }

  async createPayment(dto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        operatorId: dto.operatorId,
        gameId: dto.gameId,
        amount: dto.amount,
        method: dto.method as PaymentMethod,
        status: 'PENDING',
      },
    });

    // TODO: When Asaas is configured, create the charge via API
    if (this.isAsaasConfigured()) {
      // const asaasPayment = await this.createAsaasCharge(payment);
      // Update payment with external ID, invoice URL, PIX data, etc.
    }

    return {
      ...payment,
      gateway: this.isAsaasConfigured() ? 'asaas' : 'mock',
      message: this.isAsaasConfigured()
        ? 'Pagamento criado no Asaas'
        : 'Pagamento registrado (gateway não configurado)',
    };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count(),
    ]);

    return {
      data: payments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByOperator(operatorId: number) {
    return this.prisma.payment.findMany({
      where: { operatorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    return payment;
  }

  async updateStatus(id: number, status: PaymentStatus) {
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'CONFIRMED' || status === 'RECEIVED' ? new Date() : undefined,
      },
    });
  }

  /**
   * Webhook handler para notificações do Asaas.
   * Recebe eventos como PAYMENT_RECEIVED, PAYMENT_OVERDUE, etc.
   */
  async handleWebhook(payload: any) {
    if (!payload?.payment?.id) return { received: true };

    const externalId = payload.payment.id;
    const payment = await this.prisma.payment.findFirst({
      where: { externalId },
    });

    if (!payment) return { received: true, found: false };

    const statusMap: Record<string, PaymentStatus> = {
      PAYMENT_RECEIVED: 'RECEIVED',
      PAYMENT_CONFIRMED: 'CONFIRMED',
      PAYMENT_OVERDUE: 'OVERDUE',
      PAYMENT_REFUNDED: 'REFUNDED',
    };

    const newStatus = statusMap[payload.event];
    if (newStatus) {
      await this.updateStatus(payment.id, newStatus);
    }

    return { received: true, processed: !!newStatus };
  }
}
