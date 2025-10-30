# 🧪 Guía de Pruebas - ParkControl

## 📋 Pre-requisitos

Antes de empezar las pruebas, asegúrate de tener:

### 1. Backend Configurado
```bash
cd backend
npm install
# Verificar que la base de datos esté configurada en .env o ormconfig
npm run start:dev
```

**Verificación**: Deberías ver algo como:
```
[Nest] ... - Application is running on: http://localhost:3000
```

### 2. Frontend Configurado
```bash
cd frontend
npm install
npm run dev
```

**Verificación**: Deberías ver:
```
  ➜  Local:   http://localhost:5173/
```

---

## 🎯 Casos de Prueba

### Test 1: Verificar Conexión Backend-Frontend

1. Abre el navegador en `http://localhost:5173`
2. Abre DevTools (F12) → Pestaña "Network"
3. Navega a cualquier página del sistema
4. **Resultado esperado**: No deben aparecer errores 404 o 500

---

### Test 2: Crear Parqueadero

#### Pasos:
1. Navega a "Parqueaderos"
2. Click en "Nuevo Parqueadero"
3. Completa el formulario:
   - Nombre: `Parqueadero Central`
   - Ubicación: `Calle 123 #45-67`
   - Capacidad Total: `50`
   - ID Empresa: `1`
4. Click en "OK"

#### Resultado esperado:
- ✅ Mensaje: "Parqueadero creado exitosamente"
- ✅ El parqueadero aparece en la tabla
- ✅ En Network: `POST http://localhost:3000/api/parking-lots` → Status 201

#### Verificar en Backend:
```bash
# En terminal del backend, deberías ver el log del request
POST /api/parking-lots
```

---

### Test 3: Crear Celdas

#### Pre-requisito: 
- Tener al menos 1 parqueadero creado
- Tener en BD: TipoCelda (id=1) y Sensor (id=1)

#### Pasos:
1. Navega a "Celdas"
2. Click en "Nueva Celda"
3. Completa:
   - ID Parqueadero: `1` (el que creaste)
   - ID Tipo Celda: `1`
   - ID Sensor: `1`
   - Estado: `DISPONIBLE`
4. Click en "OK"

#### Resultado esperado:
- ✅ Mensaje: "Celda creada exitosamente"
- ✅ La celda aparece en la tabla
- ✅ Status 201 en Network

---

### Test 4: Registrar Vehículo

#### Pre-requisito:
- Tener en BD: TipoVehiculo (id=1, ej: "Automóvil")

#### Pasos:
1. Navega a "Vehículos"
2. En "Registrar Nuevo Vehículo":
   - Placa: `ABC123`
   - ID Tipo de Vehículo: `1`
3. Click en "Registrar Vehículo"

#### Resultado esperado:
- ✅ Mensaje: "Vehículo registrado exitosamente"
- ✅ POST a `/api/vehicles` → Status 201

#### Prueba de Búsqueda:
1. En "Buscar Vehículo", ingresa: `ABC123`
2. Click en "Buscar"
3. **Resultado esperado**: Se muestra la información del vehículo

---

### Test 5: Crear Reserva

#### Pre-requisitos:
- Vehículo registrado (id conocido)
- Celda disponible (id conocido)

#### Pasos:
1. Navega a "Reservas"
2. Click en "Nueva Reserva"
3. Completa:
   - ID Vehículo: `1` (el que registraste)
   - ID Celda: `1` (la que creaste)
   - Estado: `ACTIVA`
4. Click en "OK"

#### Resultado esperado:
- ✅ Reserva creada exitosamente
- ✅ Aparece en la tabla con estado "ACTIVA"
- ✅ Fecha de entrada automática
- ✅ POST a `/api/reservations` → Status 201

---

### Test 6: Finalizar Reserva

#### Pre-requisito:
- Reserva activa creada
- Tarifa configurada para ese parqueadero y tipo de vehículo

#### Pasos:
1. En la tabla de Reservas
2. Busca la reserva con estado "ACTIVA"
3. Click en botón "Finalizar"
4. Confirma la acción

#### Resultado esperado:
- ✅ Mensaje: "Reserva finalizada exitosamente"
- ✅ Estado cambia a "FINALIZADA"
- ✅ Aparece la fecha de salida
- ✅ Se calcula y muestra el monto
- ✅ PATCH a `/api/reservations/:id/finalizar` → Status 200

---

### Test 7: Procesar Pago

#### Pre-requisito:
- Reserva finalizada con monto calculado
- Método de pago en BD (id=1)

#### Pasos:
1. Navega a "Pagos"
2. En "Buscar Reserva", ingresa el ID de la reserva
3. Click en "Buscar"
4. Verifica que se muestre la información
5. Selecciona método de pago (ej: Efectivo)
6. Click en "Procesar Pago"

#### Resultado esperado:
- ✅ Mensaje: "Pago procesado exitosamente"
- ✅ POST a `/api/views/procesar-pago` → Status 201
- ✅ Formulario se limpia

---

### Test 8: Dashboard

#### Pasos:
1. Navega a "Dashboard"
2. Espera a que cargue

#### Resultado esperado:
- ✅ Estadísticas muestran números correctos:
  - Parqueaderos activos
  - Celdas ocupadas
  - Reservas activas
- ✅ Tabla de ocupación muestra los parqueaderos
- ✅ No hay errores en consola

---

## 🔍 Depuración de Errores

### Error: "Cannot connect to backend"

**Síntomas**:
- Errores 404 en Network
- "Network Error" en consola

**Solución**:
1. Verifica que el backend esté corriendo en puerto 3000
2. Revisa `frontend/src/api/axios.ts`:
   ```typescript
   baseURL: 'http://localhost:3000/api'
   ```

---

### Error: "Validation failed"

**Síntomas**:
- Status 400 Bad Request
- Mensaje del backend sobre validación

**Solución**:
1. Revisa que todos los campos requeridos estén presentes
2. Verifica tipos de datos (string vs number)
3. Compara con `DOCUMENTACION_API_BACKEND.md`

---

### Error: "Foreign key constraint"

**Síntomas**:
- Error 500 del backend
- Mensaje sobre "foreign key"

**Solución**:
1. Verifica que existan los registros referenciados
2. Orden de creación:
   - Empresa → Parqueadero → Celda/Tarifa
   - TipoVehiculo → Vehiculo
   - Vehiculo + Celda → Reserva
   - Reserva → Pago

---

### Error: "Cannot read property 'id' of undefined"

**Síntomas**:
- Error en consola del navegador
- Página se rompe

**Solución**:
1. Agrega optional chaining:
   ```typescript
   // ❌ Mal
   objeto.propiedad.id
   
   // ✅ Bien
   objeto?.propiedad?.id
   ```
2. Verifica que los datos se hayan cargado antes de acceder

---

## 📊 Checklist de Pruebas

### Funcionalidades Básicas
- [ ] Crear parqueadero
- [ ] Ver lista de parqueaderos
- [ ] Crear celdas para un parqueadero
- [ ] Cambiar estado de celda
- [ ] Registrar vehículo
- [ ] Buscar vehículo por placa
- [ ] Crear reserva
- [ ] Finalizar reserva
- [ ] Procesar pago
- [ ] Ver dashboard actualizado

### Validaciones
- [ ] No se puede crear vehículo con placa < 3 caracteres
- [ ] No se puede crear usuario sin correo válido
- [ ] No se puede crear parqueadero sin nombre
- [ ] Campos numéricos solo aceptan números

### Navegación
- [ ] Todos los links del menú funcionan
- [ ] No hay errores 404 en navegación
- [ ] El diseño es responsive

---

## 🎓 Demostración para el Profesor

### Flujo Completo de Demostración (5 minutos)

1. **Inicio** (30 seg)
   - Mostrar backend corriendo
   - Abrir frontend en navegador
   - Mostrar DevTools sin errores

2. **Configuración** (1 min)
   - Crear un parqueadero
   - Crear 3 celdas
   - Crear tarifa

3. **Operación** (2 min)
   - Registrar 2 vehículos
   - Crear 2 reservas
   - Finalizar 1 reserva
   - Procesar pago

4. **Visualización** (1 min)
   - Mostrar dashboard con datos
   - Mostrar ocupación de parqueaderos
   - Mostrar historial de reservas

5. **Validaciones** (30 seg)
   - Intentar crear vehículo sin placa
   - Mostrar mensaje de error
   - Mostrar que las validaciones funcionan

---

## 💡 Tips de Éxito

1. **Antes de la demostración**:
   - Prueba todo el flujo completo
   - Ten datos de ejemplo preparados
   - Limpia la consola del navegador

2. **Durante la demostración**:
   - Ten DevTools abierto mostrando Network
   - Explica cada paso mientras lo haces
   - Muestra que no hay errores

3. **Si algo falla**:
   - Mantén la calma
   - Revisa la consola
   - Muestra que sabes depurar

---

## 📞 Soporte

Si encuentras errores no documentados aquí:

1. Lee el mensaje de error completo
2. Busca en `DOCUMENTACION_API_BACKEND.md`
3. Revisa `FRONTEND_CORREGIDO.md`
4. Verifica los tipos en `src/types/index.ts`

---

**¡Todo está listo! Ahora solo falta probar. Éxito en tu presentación! 🚀**
