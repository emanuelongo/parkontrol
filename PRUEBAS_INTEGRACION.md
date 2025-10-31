# ✅ CHECKLIST DE PRUEBAS - Frontend + Backend

## 🎯 Verificación Rápida de Integración

### Pre-requisitos
- [ ] Backend corriendo en http://localhost:3000
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Base de datos Oracle conectada
- [ ] Al menos 1 empresa, 1 parqueadero y algunas celdas creadas

---

## 📋 Pruebas por Módulo

### 1. Dashboard ✅
**URL:** http://localhost:5173/dashboard

- [ ] Se cargan las 4 tarjetas de estadísticas
- [ ] Los números son reales (no ceros)
- [ ] Aparece tabla de ocupación de parqueaderos
- [ ] Los porcentajes de ocupación son correctos
- [ ] No hay errores en consola del navegador

**Endpoints usados:**
```
GET /api/views/ocupacion?idEmpresa=1
GET /api/reservations/activas
GET /api/views/historial-reservas?idEmpresa=1
```

---

### 2. Parqueaderos ✅
**URL:** http://localhost:5173/parqueaderos

#### Prueba 2.1: Listar Parqueaderos
- [ ] Aparece tabla con parqueaderos existentes
- [ ] Muestra: ID, Nombre, Dirección, Capacidad, Horarios
- [ ] Tiene botón "Nuevo Parqueadero"

**Endpoint usado:**
```
GET /api/parking-lots/empresa/1
```

#### Prueba 2.2: Crear Parqueadero
- [ ] Click en "Nuevo Parqueadero"
- [ ] Se abre modal con formulario
- [ ] Llenar todos los campos:
  - Nombre: "Parqueadero Test"
  - Dirección: "Calle Prueba 123"
  - Capacidad: 50
  - Horario Apertura: "06:00:00"
  - Horario Cierre: "22:00:00"
  - ID Empresa: 1
- [ ] Click en "OK"
- [ ] Aparece mensaje de éxito
- [ ] El nuevo parqueadero aparece en la tabla

**Endpoint usado:**
```
POST /api/parking-lots
```

#### Prueba 2.3: Editar Parqueadero
- [ ] Click en "Editar" en cualquier parqueadero
- [ ] Modal se abre con datos pre-cargados
- [ ] Cambiar nombre
- [ ] Click en "OK"
- [ ] Aparece mensaje de éxito

---

### 3. Celdas ✅
**URL:** http://localhost:5173/celdas

#### Prueba 3.1: Listar Celdas
- [ ] Aparece tabla con celdas del parqueadero
- [ ] Estados tienen colores:
  - 🟢 Verde = DISPONIBLE
  - 🔴 Rojo = OCUPADA
  - 🟠 Naranja = MANTENIMIENTO
- [ ] Cada celda tiene un selector de estado

**Endpoint usado:**
```
GET /api/cells/parqueadero/1
```

#### Prueba 3.2: Crear Celda
- [ ] Click en "Nueva Celda"
- [ ] Llenar formulario:
  - Número de Celda: "A-999"
  - Estado: "DISPONIBLE"
  - ID Parqueadero: 1
- [ ] Click en "OK"
- [ ] Aparece mensaje de éxito
- [ ] Nueva celda aparece en tabla

**Endpoint usado:**
```
POST /api/cells
```

#### Prueba 3.3: Cambiar Estado de Celda
- [ ] Seleccionar estado diferente en el dropdown de una celda
- [ ] Aparece mensaje de éxito
- [ ] El color del tag cambia inmediatamente
- [ ] Recargar página y verificar que el cambio persiste

**Endpoint usado:**
```
PATCH /api/cells/:id/estado
```

---

### 4. Vehículos ✅
**URL:** http://localhost:5173/vehiculos

#### Prueba 4.1: Buscar Vehículo Inexistente
- [ ] Ingresar placa: "TEST999"
- [ ] Click en "Buscar"
- [ ] Aparece mensaje: "No se encontró el vehículo"

**Endpoint usado:**
```
GET /api/vehicles/placa/TEST999
```

#### Prueba 4.2: Registrar Nuevo Vehículo
- [ ] Llenar formulario de registro:
  - Placa: "TEST999"
  - Modelo: "Toyota Corolla 2023"
  - Color: "Negro"
  - ID Tipo Vehículo: 1 (CARRO)
- [ ] Click en "Registrar Vehículo"
- [ ] Aparece mensaje de éxito
- [ ] Formulario se limpia

**Endpoint usado:**
```
POST /api/vehicles
```

#### Prueba 4.3: Buscar Vehículo Registrado
- [ ] Ingresar placa: "TEST999"
- [ ] Click en "Buscar"
- [ ] Aparece mensaje: "Vehículo encontrado"
- [ ] Se muestra información en tabla:
  - ID
  - Placa
  - Modelo
  - Color
  - Tipo de Vehículo

**Endpoint usado:**
```
GET /api/vehicles/placa/TEST999
```

---

### 5. Reservas ✅
**URL:** http://localhost:5173/reservas

#### Prueba 5.1: Listar Reservas Activas
- [ ] Aparece tabla con reservas activas
- [ ] Muestra: ID, Celda, Vehículo, Fecha Entrada, Estado
- [ ] Estado "ACTIVA" en tag azul
- [ ] Cada reserva activa tiene botón "Finalizar"

**Endpoint usado:**
```
GET /api/reservations/activas
```

#### Prueba 5.2: Crear Nueva Reserva
- [ ] Click en "Nueva Reserva"
- [ ] Llenar formulario:
  - ID Celda: (una celda disponible)
  - ID Vehículo: (un vehículo existente)
- [ ] Click en "OK"
- [ ] Aparece mensaje de éxito
- [ ] Nueva reserva aparece en tabla con estado ACTIVA

**Endpoint usado:**
```
POST /api/reservations
```

**⚠️ Verificar:**
- [ ] La celda usada cambió a estado OCUPADA
- [ ] Ir a Celdas y verificar que la celda está en rojo

#### Prueba 5.3: Finalizar Reserva
- [ ] Click en "Finalizar" en una reserva activa
- [ ] Aparece mensaje de éxito
- [ ] La reserva desaparece de la lista de activas

**Endpoint usado:**
```
PATCH /api/reservations/:id/finalizar
```

**⚠️ Verificar:**
- [ ] La celda volvió a estado DISPONIBLE
- [ ] Ir a Celdas y verificar que la celda está en verde

---

### 6. Pagos ✅
**URL:** http://localhost:5173/pagos

#### Prueba 6.1: Buscar Reserva
- [ ] Ingresar ID de una reserva finalizada
- [ ] Click en "Buscar"
- [ ] Aparece mensaje: "Reserva encontrada"
- [ ] Se muestra card con información:
  - ID Reserva
  - Placa del vehículo
  - Celda
  - Fecha Entrada y Salida
  - Duración calculada
  - Estado

**Endpoint usado:**
```
GET /api/reservations/:id
```

#### Prueba 6.2: Procesar Pago
- [ ] Con reserva cargada, llenar formulario:
  - ID Reserva: (auto-completado)
  - Monto: 15000
  - Método de Pago: "Efectivo"
- [ ] Click en "Procesar Pago"
- [ ] Aparece mensaje de éxito
- [ ] Formulario se limpia

**Endpoint usado:**
```
POST /api/views/procesar-pago
```

**⚠️ Nota:** Este endpoint usa el procedimiento almacenado de Oracle `PROC_CONTROL_PAGO`

---

## 🔍 Pruebas de Vistas Oracle

### Ocupación
Abrir DevTools → Network → Filtrar por "ocupacion"

**Request:**
```
GET http://localhost:3000/api/views/ocupacion?idEmpresa=1
```

**Response esperado:**
```json
[
  {
    "idParqueadero": 1,
    "nombreParqueadero": "Parqueadero Centro",
    "capacidadTotal": 100,
    "celdasOcupadas": 25,
    "celdasDisponibles": 70,
    "celdasMantenimiento": 5,
    "porcentajeOcupacion": 25.0
  }
]
```

### Historial de Reservas
**Request:**
```
GET http://localhost:3000/api/views/historial-reservas?idEmpresa=1
```

**Response esperado:** Array de reservas con duración y montos

### Ingresos Mensuales
**Request:**
```
GET http://localhost:3000/api/views/ingresos?idEmpresa=1
```

**Response esperado:** Array con ingresos agrupados por mes

---

## 🐛 Errores Comunes y Soluciones

### Error: Cannot connect to backend
```
✅ Solución:
1. Verificar que backend está corriendo: http://localhost:3000
2. Verificar logs del backend en terminal
3. Probar endpoint directo en navegador: http://localhost:3000/api/companies/1
```

### Error: CORS blocked
```
✅ Solución:
1. Verificar que backend tiene CORS habilitado
2. En backend verificar main.ts: app.enableCors()
3. Reiniciar backend
```

### Error: 404 Not Found en endpoint
```
✅ Solución:
1. Verificar URL en axios.ts: http://localhost:3000/api
2. Verificar que endpoint existe en backend
3. Revisar documentación API_ENDPOINTS_SIN_AUTH.txt
```

### Error: Reserva no se puede crear - celda ocupada
```
✅ Solución:
1. Ir a Celdas
2. Buscar celda con estado DISPONIBLE (verde)
3. Usar el ID de esa celda en la reserva
```

### Error: No aparecen datos en Dashboard
```
✅ Solución:
1. Verificar que existe al menos 1 parqueadero
2. Verificar que existe al menos 1 celda
3. Crear datos de prueba si es necesario
4. Abrir DevTools → Console para ver errores
```

---

## 📊 Verificación de Datos en Base de Datos

### Queries útiles para verificar en Oracle:

```sql
-- Verificar empresas
SELECT * FROM EMPRESA;

-- Verificar parqueaderos
SELECT * FROM PARQUEADERO WHERE ID_EMPRESA = 1;

-- Verificar celdas disponibles
SELECT * FROM CELDA WHERE ESTADO = 'DISPONIBLE';

-- Verificar reservas activas
SELECT * FROM RESERVA WHERE ESTADO = 'ACTIVA';

-- Verificar vehículos
SELECT * FROM VEHICULO;

-- Verificar pagos
SELECT * FROM PAGO ORDER BY FECHA_PAGO DESC;

-- Ver ocupación (vista Oracle)
SELECT * FROM VISTA_OCUPACION_PARQUEADERO;

-- Ver historial (vista Oracle)
SELECT * FROM VISTA_HISTORIAL_RESERVAS;
```

---

## ✅ Checklist Final

### Funcionalidad Básica
- [ ] Dashboard carga con datos reales
- [ ] Puedo crear un parqueadero
- [ ] Puedo crear celdas
- [ ] Puedo registrar un vehículo
- [ ] Puedo crear una reserva
- [ ] Puedo finalizar una reserva
- [ ] Puedo procesar un pago

### Navegación
- [ ] Puedo navegar entre todas las páginas
- [ ] El menú lateral funciona
- [ ] Las rutas funcionan correctamente

### UI/UX
- [ ] Los formularios tienen validación
- [ ] Aparecen mensajes de éxito/error
- [ ] Los estados tienen colores correctos
- [ ] Las tablas tienen paginación
- [ ] Los modales se abren y cierran correctamente

### Integración Backend
- [ ] Todos los endpoints responden correctamente
- [ ] Los datos se persisten en la base de datos
- [ ] Los cambios se reflejan en tiempo real
- [ ] No hay errores 404 o 500

### Consola del Navegador
- [ ] No hay errores rojos en console
- [ ] No hay warnings críticos
- [ ] Las llamadas API retornan 200/201

---

## 🎓 Para tu Presentación

### Demo Sugerida (10 minutos):

**1. Dashboard (1 min)**
- Mostrar estadísticas en tiempo real
- Explicar que viene de vistas Oracle

**2. Gestión de Parqueaderos (2 min)**
- Crear nuevo parqueadero
- Mostrar lista actualizada

**3. Gestión de Celdas (2 min)**
- Crear celda nueva
- Cambiar estado de celda
- Mostrar colores dinámicos

**4. Flujo Completo de Reserva (3 min)**
- Registrar vehículo
- Crear reserva (celda cambia a ocupada)
- Finalizar reserva (celda vuelve a disponible)

**5. Procesar Pago (2 min)**
- Buscar reserva
- Procesar pago
- Mostrar éxito

**Puntos a destacar:**
- ✅ Full-stack: React + NestJS + Oracle
- ✅ TypeScript en frontend y backend
- ✅ Vistas Oracle optimizadas
- ✅ Procedimientos almacenados
- ✅ UI profesional con Ant Design
- ✅ 47 endpoints implementados
- ✅ Sistema multi-tenant (varias empresas)

---

## 📞 Comandos de Inicio Rápido

```powershell
# Terminal 1 - Backend
cd c:\Users\Josué\Desktop\parkontrol\backend\backend-parkontrol
npm run start:dev

# Terminal 2 - Frontend
cd c:\Users\Josué\Desktop\parkontrol\frontend
npm run dev

# Abrir navegador
http://localhost:5173
```

---

**¡LISTO PARA DEMOSTRAR! 🚀**

Si todas las pruebas pasan ✅, tu sistema está completamente funcional.

**¡ÉXITO EN TU PRESENTACIÓN! 🎉**
