import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'ID do operador' })
  @IsNumber()
  @IsNotEmpty()
  operatorId!: number;

  @ApiPropertyOptional({ example: 1, description: 'ID do evento (se aplicável)' })
  @IsOptional()
  @IsNumber()
  gameId?: number;

  @ApiProperty({ example: 80.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: ['PIX', 'CREDIT_CARD', 'BOLETO', 'CASH'], example: 'PIX' })
  @IsEnum(['PIX', 'CREDIT_CARD', 'BOLETO', 'CASH'])
  method!: string;
}
