import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { Roles, CurrentUser } from '../common/decorators';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('operators')
@Controller('operators')
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os operadores' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.operatorsService.findAll(page || 1, limit || 20);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar operadores por codinome' })
  @ApiQuery({ name: 'q', required: true, type: String })
  search(@Query('q') query: string) {
    return this.operatorsService.search(query || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar operador por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.operatorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do operador' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOperatorDto,
    @CurrentUser() user: any,
  ) {
    return this.operatorsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desativar operador (Admin)' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.operatorsService.deactivate(id);
  }
}
