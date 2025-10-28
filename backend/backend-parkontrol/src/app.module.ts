import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasModule } from './empresas/empresas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ParqueaderosModule } from './parqueaderos/parqueaderos.module';
import { SharedModule } from './shared/shared.module';
import { Rol } from './shared/entities/rol.entity';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Empresa } from './empresas/entities/empresa.entity';
import { Parqueadero } from './parqueaderos/entities/parqueadero.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        sid: configService.get<string>('DB_SID'),
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
        extra: {
          poolMin: 1,
          poolMax: 1,
          poolIncrement: 0,
        },
      }),
    }),
    //Aca cargar entidades para la db
    SharedModule,
    EmpresasModule,
    UsuariosModule,
    ParqueaderosModule,
    AuthModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
