import { Controller, Get, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles, CurrentUser } from '../common/decorators';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard stats (Admin)' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('operators')
  @ApiOperation({ summary: 'Listar operadores com detalhes admin' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  listOperators(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.listOperators(page || 1, limit || 50, search, role);
  }

  @Get('squads')
  @ApiOperation({ summary: 'Listar unidades para admin' })
  @ApiQuery({ name: 'search', required: false })
  listSquads(@Query('search') search?: string) {
    return this.adminService.listSquads(search);
  }

  @Get('is-first-admin')
  @ApiOperation({ summary: 'Verificar se é o admin principal' })
  isFirstAdmin(@CurrentUser('id') userId: number) {
    return this.adminService.isFirstAdmin(userId);
  }

  @Patch('operators/:id/role')
  @ApiOperation({ summary: 'Alterar cargo do operador (apenas admin principal)' })
  changeRole(
    @Param('id', ParseIntPipe) targetId: number,
    @Body('role') newRole: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.adminService.changeRole(userId, targetId, newRole);
  }

  @Patch('operators/:id/points')
  @ApiOperation({ summary: 'Alterar pontos do operador (apenas admin principal)' })
  updatePoints(
    @Param('id', ParseIntPipe) targetId: number,
    @Body('points') points: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.adminService.updateOperatorPoints(userId, targetId, points);
  }

  @Patch('operators/:id/toggle-active')
  @ApiOperation({ summary: 'Ativar/desativar operador (apenas admin principal)' })
  toggleActive(
    @Param('id', ParseIntPipe) targetId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.adminService.toggleActive(userId, targetId);
  }

  @Patch('operators/:id/toggle-verified')
  @ApiOperation({ summary: 'Verificar/desverificar operador (apenas admin principal)' })
  toggleVerified(
    @Param('id', ParseIntPipe) targetId: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.adminService.toggleVerified(userId, targetId);
  }
}
