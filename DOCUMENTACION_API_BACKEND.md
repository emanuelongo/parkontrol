# Documentación de la API Backend - ParkControl

## Resumen de Correcciones Realizadas

Este documento detalla la estructura del backend y las correcciones realizadas en el frontend para asegurar la correcta integración.

## Estructura de Endpoints del Backend

### Prefijo Global
Todos los endpoints tienen el prefijo: `http://localhost:3000/api`

---

## 📋 Endpoints por Módulo

### 1. **Autenticación** (`/auth`)

#### POST `/auth/register`
Registra un nuevo usuario (Cliente por defecto).
```typescript
Body: {
  nombre: string;
  correo: string;
  contrasena: string; // mínimo 6 caracteres
  idEmpresa: number;
}
Response: UsuarioResponseDto
```

#### POST `/auth/login`
Inicia sesión.
```typescript
Body: {
  correo: string;
  contrasena: string;
}
Response: {
  access_token: string;
  usuario: UsuarioResponseDto;
}
```

---

### 2. **Usuarios** (`/users`)

#### POST `/users`
Crea un usuario operador.
```typescript
Body: {
  nombre: string;
  correo: string;
  contrasena: string;
  idEmpresa: number;
}
Response: UsuarioResponseDto {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  idEmpresa: number;
}
```

#### GET `/users/empresa/:idEmpresa`
Obtiene todos los usuarios de una empresa.

#### GET `/users/:id`
Obtiene un usuario por ID.

#### DELETE `/users/:id`
Elimina un usuario operador.
```typescript
Response: { mensaje: string }
```

---

### 3. **Empresas** (`/companies`)

#### GET `/companies/:id`
Obtiene el detalle de una empresa.
```typescript
Response: {
  id: number;
  nombre: string;
}
```

---

### 4. **Parqueaderos** (`/parking-lots`)

#### POST `/parking-lots`
Crea un nuevo parqueadero.
```typescript
Body: {
  nombre: string; // mínimo 3 caracteres
  capacidadTotal: number;
  ubicacion: string; // mínimo 5 caracteres
  idEmpresa: number;
}
Response: {
  id: number;
  nombre: string;
  capacidadTotal: number;
  ubicacion: string;
  idEmpresa: number;
}
```

#### GET `/parking-lots/empresa/:idEmpresa`
Obtiene parqueaderos de una empresa.

#### GET `/parking-lots/:id`
Obtiene detalle de un parqueadero.

---

### 5. **Celdas** (`/cells`)

#### POST `/cells`
Crea una nueva celda.
```typescript
Body: {
  idParqueadero: number;
  idTipoCelda: number;
  idSensor: number;
  estado: string; // 'DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO'
}
Response: Celda
```

#### GET `/cells/parqueadero/:idParqueadero`
Obtiene celdas de un parqueadero.

#### GET `/cells/:id`
Obtiene una celda por ID.

#### PATCH `/cells/:id/estado`
Actualiza el estado de una celda.
```typescript
Body: { estado: string }
```

---

### 6. **Vehículos** (`/vehicles`)

#### POST `/vehicles`
Registra un nuevo vehículo.
```typescript
Body: {
  placa: string; // 3-10 caracteres
  idTipoVehiculo: number;
}
Response: Vehiculo {
  id: number;
  placa: string;
  idTipoVehiculo: number;
}
```

#### GET `/vehicles/placa/:placa`
Busca un vehículo por placa.

#### GET `/vehicles/:id`
Obtiene un vehículo por ID.

---

### 7. **Reservas** (`/reservations`)

#### POST `/reservations`
Crea una nueva reserva.
```typescript
Body: {
  idVehiculo: number;
  idCelda: number;
  estado: string; // 'ACTIVA', 'FINALIZADA', 'CANCELADA'
}
Response: Reserva {
  id: number;
  idCelda: number;
  idVehiculo: number;
  fechaEntrada: string;
  fechaSalida?: string;
  estado: string;
  monto?: number;
}
```

#### PATCH `/reservations/:id/finalizar`
Finaliza una reserva (calcula el monto automáticamente).

#### GET `/reservations/activas`
Obtiene todas las reservas activas.

#### GET `/reservations/parqueadero/:idParqueadero`
Obtiene reservas de un parqueadero.

#### GET `/reservations/:id`
Obtiene una reserva por ID.

---

### 8. **Tarifas** (`/rates`)

#### POST `/rates`
Crea una nueva tarifa.
```typescript
Body: {
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number; // >= 0
  precioHoraAdicional?: number; // >= 0, opcional
}
Response: Tarifa
```

#### GET `/rates/parqueadero/:idParqueadero`
Obtiene tarifas de un parqueadero.

#### PATCH `/rates/:id`
Actualiza una tarifa.

---

### 9. **Pagos** (`/payments`)

#### POST `/payments`
Crea un nuevo pago.
```typescript
Body: {
  idReserva: number;
  idMetodoPago: number;
}
// ⚠️ NO enviar 'monto', se calcula automáticamente
Response: Pago {
  id: number;
  idReserva: number;
  idMetodoPago: number;
  monto: number; // calculado por el backend
  fechaPago: string;
}
```

#### GET `/payments/parqueadero/:idParqueadero`
Obtiene pagos de un parqueadero.

#### GET `/payments/reserva/:idReserva`
Obtiene el pago de una reserva.

#### GET `/payments/:id`
Obtiene un pago por ID.

---

### 10. **Facturación** (`/invoicing`)

#### POST `/invoicing/clientes`
Crea un cliente para facturación.
```typescript
Body: {
  tipoDocumento: string; // 2-10 caracteres
  numeroDocumento: string; // 5-20 caracteres
  correo: string;
}
Response: ClienteFactura
```

#### POST `/invoicing/facturas`
Crea una factura electrónica.
```typescript
Body: {
  idPago: number;
  idClienteFactura: number;
  cufe: string;
  urlPdf?: string; // OPCIONAL
}
Response: FacturaElectronica
```

#### PATCH `/invoicing/facturas/:id/enviar`
Marca una factura como enviada.

#### GET `/invoicing/facturas/pago/:idPago`
Obtiene la factura de un pago.

---

### 11. **Reportes** (`/reports`)

#### POST `/reports`
Crea un nuevo reporte.
```typescript
Body: {
  idParqueadero: number;
  idPeriodo: number; // ID del periodo (ej: 1=Diario, 2=Semanal, 3=Mensual)
  urlArchivo?: string; // opcional
}
Response: Reporte
```

#### GET `/reports/parqueadero/:idParqueadero`
Obtiene reportes de un parqueadero.

#### GET `/reports/:id`
Obtiene un reporte por ID.

#### PATCH `/reports/:id/url`
Actualiza la URL del archivo de reporte.
```typescript
Body: { urlArchivo: string }
```

---

### 12. **Vistas** (`/views`)

#### GET `/views/ocupacion`
Obtiene ocupación de todos los parqueaderos.
```
Query params: ?idEmpresa=1 (opcional)
```

#### GET `/views/ocupacion/:idParqueadero`
Obtiene ocupación de un parqueadero específico.

#### GET `/views/historial-reservas`
Obtiene historial de reservas.
```
Query params: ?idEmpresa=1 (opcional)
```

#### GET `/views/historial-reservas/parqueadero/:idParqueadero/placa/:placa`
Obtiene historial por placa y parqueadero.

#### GET `/views/facturacion`
Obtiene información completa de facturación.
```
Query params: ?idEmpresa=1 (opcional)
```

#### GET `/views/facturacion/documento/:numeroDocumento`
Obtiene facturación por número de documento del cliente.
```
Query params: ?idEmpresa=1 (opcional)
```

#### GET `/views/ingresos`
Obtiene ingresos mensuales.
```
Query params: ?idEmpresa=1 (opcional)
```

#### GET `/views/ingresos/parqueadero/:idParqueadero`
Obtiene ingresos de un parqueadero.

#### POST `/views/procesar-pago`
Procesa un pago (crea pago y finaliza reserva en una transacción).
```typescript
Body: {
  idReserva: number;
  idMetodoPago: number;
}
```

#### GET `/views/buscar-vehiculo/:placa`
Busca información completa de un vehículo por placa.

---

## 🔧 Cambios Realizados en el Frontend

### 1. **API Clients**
- ✅ Actualizado `usuarios.ts` - eliminados campos `telefono` e `idRol`
- ✅ Actualizado `pagos.ts` - eliminado campo `monto` del create
- ✅ Actualizado `facturacion.ts` - `urlPdf` ahora es opcional
- ✅ Actualizado `reportes.ts` - usa `idParqueadero` e `idPeriodo`
- ✅ Actualizado `vistas.ts` - corregidos endpoints
- ✅ Creado `auth.ts` - nuevo módulo de autenticación

### 2. **Tipos TypeScript**
- ✅ Todos los IDs ahora usan `id` en lugar de `idNombre`
- ✅ Actualizadas interfaces de `Usuario`, `Empresa`, `Parqueadero`, etc.
- ✅ Simplificados tipos según respuestas reales del backend

### 3. **Componentes React**
- ✅ **Parqueaderos**: Usa `ubicacion` en lugar de `direccion/horarios`
- ✅ **Celdas**: Agregados campos `idTipoCelda` e `idSensor`
- ✅ **Vehículos**: Eliminados campos `modelo` y `color`
- ✅ **Reservas**: Agregado campo `estado` obligatorio en creación
- ✅ **Pagos**: Eliminado campo `monto` del formulario
- ✅ **Dashboard**: Actualizado para usar estructuras correctas

---

## ⚠️ Puntos Importantes

1. **IDs en Respuestas**: El backend devuelve `id` (no `idUsuario`, `idParqueadero`, etc.)

2. **Cálculos Automáticos**:
   - El `monto` de reservas y pagos se calcula automáticamente en el backend
   - NO enviar campo `monto` al crear un pago

3. **Campos Opcionales**:
   - `urlPdf` en facturas
   - `urlArchivo` en reportes
   - `precioHoraAdicional` en tarifas

4. **Estados Comunes**:
   - Celdas: `'DISPONIBLE'`, `'OCUPADA'`, `'MANTENIMIENTO'`
   - Reservas: `'ACTIVA'`, `'FINALIZADA'`, `'CANCELADA'`

5. **Validaciones**:
   - Placa: 3-10 caracteres
   - Contraseña: mínimo 6 caracteres
   - Nombres: mínimo 3 caracteres
   - Ubicación: mínimo 5 caracteres

---

## 🚀 Próximos Pasos

1. Iniciar el backend: `cd backend && npm run start:dev`
2. Iniciar el frontend: `cd frontend && npm run dev`
3. Probar cada endpoint desde el frontend
4. Verificar que los datos se guardan correctamente
5. Revisar la consola del navegador para errores

---

## 📝 Notas de Desarrollo

- El backend NO usa autenticación JWT actualmente (BackendSinAuth branch)
- Todos los endpoints están abiertos para desarrollo
- IDs de empresa por defecto: usar `1` para pruebas
- Los tipos de vehículo, celdas, sensores deben existir en la BD antes de crear registros

---

**Fecha de Última Actualización**: 30 de Octubre, 2025
**Versión Backend**: BackendSinAuth branch
**Autor**: GitHub Copilot
