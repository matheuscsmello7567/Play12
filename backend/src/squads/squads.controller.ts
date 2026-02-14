import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SquadsService } from './squads.service';
import { CreateSquadDto, UpdateSquadDto, AddMemberDto } from './dto/squad.dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('squads')
@Controller('squads')
export class SquadsController {
  constructor(private squadsService: SquadsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as unidades' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.squadsService.findAll(page || 1, limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma unidade' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.squadsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova unidade' })
  create(@Body() dto: CreateSquadDto, @CurrentUser('id') userId: number) {
    return this.squadsService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar unidade' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSquadDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.update(id, dto, userId);
  }

  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar membro à unidade' })
  addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMemberDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.addMember(id, dto.operatorId, userId);
  }

  @Delete(':id/members/:operatorId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover membro da unidade' })
  removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('operatorId', ParseIntPipe) operatorId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.removeMember(id, operatorId, userId);
  }

  // ==================== Join Requests ====================

  @Post(':id/join-requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Solicitar ingresso na unidade' })
  createJoinRequest(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.createJoinRequest(id, userId);
  }

  @Get(':id/join-requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar solicitações pendentes (apenas líder)' })
  getJoinRequests(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.getJoinRequests(id, userId);
  }

  @Patch('join-requests/:requestId/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aceitar solicitação de ingresso' })
  acceptJoinRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.respondJoinRequest(requestId, userId, true);
  }

  @Patch('join-requests/:requestId/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeitar solicitação de ingresso' })
  rejectJoinRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.squadsService.respondJoinRequest(requestId, userId, false);
  }
}
