import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        //autenticacion
        children: [
            {
                path: 'registro',
                loadComponent: () =>
                    import('./pages/auth/registro/registro').then((c) => c.RegistroComponent),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/auth/login/login').then((c) => c.LoginComponent),
            },
            {
                path: '**',
                redirectTo: 'login',
            }
        ]
    },
    {
        path: 'dashboard',
        //Vista principal administrador
        loadComponent: () => 
            import('./pages/dashboard/dashboard').then((c) => c.DashboardComponent)
    },
    {
        path: 'parqueadero/:id',
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/parqueadero/parqueadero-detalles/parqueadero-detalles').then((c) =>c.ParqueaderoDetallesComponent),
            },
            {
                path: 'reservas',
                loadComponent: () =>
                    import('./pages/parqueadero/parqueadero-reservas/parqueadero-reservas').then((c) =>c.ParqueaderoReservasComponent),
            },
            {
                path: 'pagos',
                loadComponent: () =>
                    import('./pages/parqueadero/parqueadero-pagos/parqueadero-pagos').then((c) =>c.ParqueaderoPagosComponent), 
            },
            {
                path: 'estadisticas',
                loadComponent: () =>
                    import('./pages/parqueadero/parqueadero-estadisticas/parqueadero-estadisticas').then((c) =>c.ParqueaderoEstadisticasComponent), 
            }
        ]
    },
    {
        path:'**',
        redirectTo: 'dashboard',
    },
];
