import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSquadDto {
  @ApiProperty({ example: 'Bravo Team' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'BRV' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  tag?: string;

  @ApiPropertyOptional({ example: 'Unidade de reconhecimento e assalto tático.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Semper Fidelis' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  motto?: string;

  @ApiPropertyOptional({ enum: ['ASSALTO', 'RECONHECIMENTO', 'SUPORTE'], example: 'ASSALTO' })
  @IsOptional()
  @IsEnum(['ASSALTO', 'RECONHECIMENTO', 'SUPORTE'])
  specialty?: string;

  @ApiPropertyOptional({ example: 'MG', description: 'Estado brasileiro (UF)' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @ApiPropertyOptional({ example: [2, 3, 5], description: 'IDs dos operadores para incluir' })
  @IsOptional()
  @IsArray()
  memberIds?: number[];
}

export class UpdateSquadDto {
  @ApiPropertyOptional({ example: 'Bravo Team Elite' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'BRV' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  tag?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: ['ASSALTO', 'RECONHECIMENTO', 'SUPORTE'] })
  @IsOptional()
  @IsEnum(['ASSALTO', 'RECONHECIMENTO', 'SUPORTE'])
  specialty?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;
}

export class AddMemberDto {
  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  operatorId!: number;
}
