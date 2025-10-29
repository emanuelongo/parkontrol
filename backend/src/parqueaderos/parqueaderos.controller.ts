import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { GetUser, Roles } from 'src/shared/decorators';
import { RoleEnum } from 'src/shared/entities/rol.entity';
import type { JwtUsuario } from 'src/auth/interfaces';
import { CreateParqueaderoDto } from './entities/dto/crear-parqueadero.dto';
import { ParqueaderoResponseDto } from './entities/dto/parqueadero-response.dto';

@Controller('parking-lots')
export class ParqueaderosController {
    
    constructor(private readonly parqueaderosService: ParqueaderosService){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async crear(
        @Body() createParqueaderoDto: CreateParqueaderoDto,
        @GetUser() user: JwtUsuario
    ): Promise<ParqueaderoResponseDto> {
        // Ensure the authenticated admin belongs to the same company as the target company
        if (createParqueaderoDto.idEmpresa && createParqueaderoDto.idEmpresa !== user.idEmpresa) {
            // explicit denial: admin cannot create parking lots for other companies
            throw new ForbiddenException('You are not allowed to create parking lots for another company');
        }

        // Force the company to the user's company (defensive)
        createParqueaderoDto.idEmpresa = user.idEmpresa!;

        return this.parqueaderosService.crear(createParqueaderoDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async findAll(@GetUser() user: JwtUsuario): Promise<ParqueaderoResponseDto[]> {
        return this.parqueaderosService.findByEmpresa(user.idEmpresa!);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.OPERADOR)
    async obtenerDetalle(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: JwtUsuario
    ): Promise<ParqueaderoResponseDto> {
        return this.parqueaderosService.obtenerDetalle(id);
    }
}
