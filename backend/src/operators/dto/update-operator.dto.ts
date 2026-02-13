import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOperatorDto {
  @ApiPropertyOptional({ example: 'Ghost_Recon_v2' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nickname?: string;

  @ApiPropertyOptional({ example: 'João Carlos Silva' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ example: '31999998888' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}
