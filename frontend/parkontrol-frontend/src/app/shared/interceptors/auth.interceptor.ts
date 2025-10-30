import {  HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../../services/session";

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn){
    const sessionService = inject(SessionService);

    if(sessionService.obtenerToken()){
        req = req.clone({
            headers: req.headers.set('Autorization', `Bearer ${sessionService.obtenerToken()}`)
        });
    }
    return next(req);
}