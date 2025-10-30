import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../../services/session";


export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const sessionService = inject(SessionService);
    const token = sessionService.obtenerToken();

    if (token) {
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }
    return next(req);
}