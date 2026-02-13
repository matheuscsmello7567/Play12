import { Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { Roles } from '../common/decorators';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('rankings')
@Controller('rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}

  @Get()
  @ApiOperation({ summary: 'Ranking completo de squads' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.rankingsService.getFullRanking(page || 1, limit || 20);
  }

  @Get('squad/:squadId')
  @ApiOperation({ summary: 'Ranking de um squad específico' })
  findBySquad(@Param('squadId', ParseIntPipe) squadId: number) {
    return this.rankingsService.getSquadRanking(squadId);
  }

  @Post('recalculate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recalcular ranking (Admin)' })
  recalculate() {
    return this.rankingsService.recalculate();
  }
}
