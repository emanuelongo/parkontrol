import { Module } from '@nestjs/common';
import { ParqueaderosController } from './parqueaderos.controller';
import { ParqueaderosService } from './parqueaderos.service';
import { Parqueadero } from './entities/parqueadero.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature([Parqueadero]),
    ],
  controllers: [ParqueaderosController],
  providers: [ParqueaderosService]
})
export class ParqueaderosModule {}
