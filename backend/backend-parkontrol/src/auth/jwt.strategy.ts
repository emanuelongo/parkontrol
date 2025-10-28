import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtUsuario } from "./interfaces/jwt-usuario.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor (
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') || "",
            ignoreExpiration: false
        })
    }

    validate(payload: JwtPayload): JwtUsuario{
        return {
            id: payload.id, 
            correo: payload.correo,
            nombreRol: payload.nombreRol,
            idEmpresa: payload.idEmpresa,
            idParqueadero: payload.idParqueadero,
        }
    }
}
