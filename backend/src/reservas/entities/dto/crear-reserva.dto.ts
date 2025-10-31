import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsNumber()
  idVehiculo: number;

  @IsNotEmpty()
  @IsNumber()
  idCelda: number;

  @IsNotEmpty()
  @IsString()
  estado: string;
}
