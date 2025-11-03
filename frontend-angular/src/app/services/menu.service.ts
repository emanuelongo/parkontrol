import { Injectable } from '@angular/core';
import { RolUsuario } from '../models/shared.model';

export interface ElementoMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
  roles: RolUsuario[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private readonly elementosMenu: ElementoMenu[] = [
    {
      etiqueta: 'Dashboard Administrador',
      ruta: '/dashboard',
      icono: 'dashboard',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Dashboard Operador',
      ruta: '/operador-dashboard',
      icono: 'desktop_mac',
      roles: [RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Parqueaderos',
      ruta: '/parqueaderos',
      icono: 'business',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Celdas',
      ruta: '/celdas',
      icono: 'local_parking',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Vehículos',
      ruta: '/vehiculos',
      icono: 'directions_car',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Usuarios',
      ruta: '/usuarios',
      icono: 'people',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Tarifas',
      ruta: '/tarifas',
      icono: 'attach_money',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Reservas',
      ruta: '/reservas',
      icono: 'event',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Pagos',
      ruta: '/pagos',
      icono: 'payment',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Facturación',
      ruta: '/facturacion',
      icono: 'receipt',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Reportes',
      ruta: '/reportes',
      icono: 'bar_chart',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Vistas',
      ruta: '/vistas',
      icono: 'visibility',
      roles: [RolUsuario.ADMINISTRADOR]
    }
  ];

  /**
   * Obtiene todos los elementos del menú
   */
  obtenerTodosLosElementos(): ElementoMenu[] {
    return [...this.elementosMenu];
  }

  /**
   * Filtra elementos del menú por rol de usuario
   */
  obtenerMenuPorRol(rol: RolUsuario): ElementoMenu[] {
    return this.elementosMenu.filter(elemento => 
      elemento.roles.includes(rol)
    );
  }

  /**
   * Obtiene elemento del menú por ruta
   */
  obtenerElementoPorRuta(ruta: string): ElementoMenu | undefined {
    return this.elementosMenu.find(elemento => elemento.ruta === ruta);
  }

  /**
   * Obtiene la etiqueta de una ruta específica
   */
  obtenerEtiquetaPorRuta(ruta: string): string {
    const elemento = this.obtenerElementoPorRuta(ruta);
    return elemento?.etiqueta || 'Dashboard';
  }
}