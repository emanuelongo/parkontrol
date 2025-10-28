import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { EmpresaValidator } from './validators/empresa.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa]),
  ],
  controllers: [EmpresasController],
  providers: [EmpresasService, EmpresaValidator],
  exports: [EmpresasService]
})
export class EmpresasModule {}
