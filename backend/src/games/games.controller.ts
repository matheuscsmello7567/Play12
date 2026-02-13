import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.gamesService.findAll(page || 1, limit || 20, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um evento' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ORGANIZER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo evento (Organizador/Admin)' })
  create(@Body() dto: CreateGameDto, @CurrentUser('id') userId: number) {
    return this.gamesService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ORGANIZER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar evento' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }

  @Post(':id/register/:squadId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrever squad em um evento' })
  registerSquad(
    @Param('id', ParseIntPipe) gameId: number,
    @Param('squadId', ParseIntPipe) squadId: number,
  ) {
    return this.gamesService.registerSquad(gameId, squadId);
  }

  @Delete(':id/register/:squadId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar inscrição do squad' })
  unregisterSquad(
    @Param('id', ParseIntPipe) gameId: number,
    @Param('squadId', ParseIntPipe) squadId: number,
  ) {
    return this.gamesService.unregisterSquad(gameId, squadId);
  }
}
