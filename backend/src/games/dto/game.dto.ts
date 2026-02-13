import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({ example: 'OPERAÇÃO RED WINGS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: '2026-03-15T09:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-03-15T17:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ example: 'Operação de reconhecimento em terreno montanhoso.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'Serra do Rola Moça, Sector 7' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional({ example: '20°03\'22"S 44°02\'03"W' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCoords?: string;

  @ApiPropertyOptional({ example: 'https://google.com/maps/...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  locationMapsUrl?: string;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPlayers?: number;

  @ApiPropertyOptional({ enum: ['MILSIM', 'CQB', 'WOODLAND', 'SKIRMISH', 'SCENARIO', 'CTF'] })
  @IsOptional()
  @IsEnum(['MILSIM', 'CQB', 'WOODLAND', 'SKIRMISH', 'SCENARIO', 'CTF'])
  gameType?: string;

  @ApiPropertyOptional({ example: 80.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  registrationFee?: number;
}

export class UpdateGameDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCoords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  locationMapsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPlayers?: number;

  @ApiPropertyOptional({ enum: ['SCHEDULED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['SCHEDULED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  registrationFee?: number;
}
