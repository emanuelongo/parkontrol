import { Parqueadero } from 'src/parqueaderos/entities/parqueadero.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'EMPRESA' }) 
export class Empresa {

  @PrimaryGeneratedColumn({ name: 'ID_EMPRESA', type: 'number' })
  id: number;

  @Column({ name: 'NIT', length: 100, nullable: false })
  nit: string;

  @Column({ name: 'NOMBRE', length: 100, nullable: false })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.empresa, {
    cascade: ['insert', 'update'],
  })
  usuarios: Usuario[] //Un admin y muchos operadores

  @OneToMany(() => Parqueadero, (parqueadero) => parqueadero.empresa, {
    cascade: ['insert', 'update'],
  })
  parqueaderos: Parqueadero[]; 


}
