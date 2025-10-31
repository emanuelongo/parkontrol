import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './entities/dto/crear-vehiculo.dto';
import { TipoVehiculo } from 'src/shared/entities/tipo-vehiculo.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(TipoVehiculo)
    private readonly tipoVehiculoRepository: Repository<TipoVehiculo>,
  ) {}

  async crear(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const existeVehiculo = await this.vehiculoRepository.findOne({
      where: { placa: createVehiculoDto.placa },
    });
    if (existeVehiculo) {
      throw new ConflictException(`Ya existe un vehículo con placa: ${createVehiculoDto.placa}`);
    }

    const tipoVehiculo = await this.tipoVehiculoRepository.findOne({
      where: { id: createVehiculoDto.idTipoVehiculo },
    });
    if (!tipoVehiculo) {
      throw new NotFoundException(`No existe tipo de vehículo con id: ${createVehiculoDto.idTipoVehiculo}`);
    }

    const vehiculo = this.vehiculoRepository.create({
      placa: createVehiculoDto.placa.toUpperCase(),
      tipoVehiculo,
    });

    return await this.vehiculoRepository.save(vehiculo);
  }

  async findByPlaca(placa: string): Promise<Vehiculo | null> {
    return await this.vehiculoRepository.findOne({
      where: { placa: placa.toUpperCase() },
      relations: ['tipoVehiculo'],
    });
  }

  async findVehiculoById(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: ['tipoVehiculo'],
    });
    if (!vehiculo) {
      throw new NotFoundException(`No existe vehículo con id: ${id}`);
    }
    return vehiculo;
  }
}
