import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto } from './entities/dto/crear-pago.dto';
import { ReservasService } from 'src/reservas/reservas.service';
import { MetodoPago } from 'src/shared/entities/metodo-pago.entity';
import { TarifasService } from 'src/tarifas/tarifas.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
    private readonly reservasService: ReservasService,
    private readonly tarifasService: TarifasService,
  ) {}

  async crear(createPagoDto: CreatePagoDto): Promise<Pago> {
    const reserva = await this.reservasService.findReservaById(createPagoDto.idReserva);
    
    if (!reserva.fechaSalida) {
      throw new BadRequestException('La reserva debe estar finalizada para procesar el pago');
    }

    const pagoExistente = await this.pagoRepository.findOne({
      where: { reserva: { id: reserva.id } },
    });
    if (pagoExistente) {
      throw new BadRequestException('Ya existe un pago registrado para esta reserva');
    }

    const metodoPago = await this.metodoPagoRepository.findOne({
      where: { id: createPagoDto.idMetodoPago },
    });
    if (!metodoPago) {
      throw new NotFoundException(`No existe método de pago con id: ${createPagoDto.idMetodoPago}`);
    }

    const idParqueadero = reserva.celda.parqueadero.id;
    const idTipoVehiculo = reserva.vehiculo.tipoVehiculo.id;

    const tarifa = await this.tarifasService.findByParqueaderoYTipo(idParqueadero, idTipoVehiculo);
    if (!tarifa) {
      throw new NotFoundException(`No existe tarifa configurada para este parqueadero y tipo de vehículo`);
    }

    const horasTotales = this.calcularHoras(reserva.fechaEntrada, reserva.fechaSalida);
    const monto = this.calcularMonto(horasTotales, tarifa.precioFraccionHora, tarifa.precioHoraAdicional);

    const pago = this.pagoRepository.create({
      reserva,
      metodoPago,
      monto,
      fechaPago: new Date(),
    });

    return await this.pagoRepository.save(pago);
  }

  private calcularHoras(fechaEntrada: Date, fechaSalida: Date): number {
    const milisegundos = new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime();
    const horas = milisegundos / (1000 * 60 * 60);
    return Math.ceil(horas);
  }

  private calcularMonto(horas: number, precioFraccionHora: number, precioHoraAdicional?: number): number {
    if (horas <= 1) {
      return precioFraccionHora;
    }
    
    const horasAdicionales = horas - 1;
    const precioAdicional = precioHoraAdicional ?? precioFraccionHora;
    return precioFraccionHora + (horasAdicionales * precioAdicional);
  }

  async findByReserva(idReserva: number): Promise<Pago | null> {
    return await this.pagoRepository.findOne({
      where: { reserva: { id: idReserva } },
      relations: ['reserva', 'metodoPago'],
    });
  }

  async findPagoById(id: number): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: ['reserva', 'reserva.vehiculo', 'reserva.celda', 'metodoPago'],
    });
    if (!pago) {
      throw new NotFoundException(`No existe pago con id: ${id}`);
    }
    return pago;
  }

  async findByParqueadero(idParqueadero: number): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { reserva: { celda: { parqueadero: { id: idParqueadero } } } },
      relations: ['reserva', 'reserva.vehiculo', 'metodoPago'],
      order: { fechaPago: 'DESC' },
    });
  }
}
