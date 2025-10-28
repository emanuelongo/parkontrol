import { Empresa } from "src/empresas/entities/empresa.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('PARQUEADERO')
export class Parqueadero {

  @PrimaryGeneratedColumn({ name: 'ID_PARQUEADERO' })
  id: number;

  @Column({ name: 'NOMBRE', length: 100 })
  nombre: string;

  @Column({ name: 'CAPACIDAD_TOTAL', type: 'number' })
  capacidadTotal: number;

  @Column({ name: 'UBICACION', length: 255 })
  ubicacion: string;


  @ManyToOne(() => Empresa, (empresa) => empresa.parqueaderos, { 
    nullable: false,
  })
  @JoinColumn({ name: 'ID_EMPRESA' })
  empresa: Empresa;

}