# Parkontrol - Frontend

Sistema de gestión de parqueaderos desarrollado con React, TypeScript y Ant Design.

## 🚀 Tecnologías

- **React 19.1.1** - Librería de UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.1.12** - Build tool y dev server
- **Ant Design 5.22.7** - Componentes UI
- **React Router 7.1.3** - Navegación
- **React Query 5.62.11** - Manejo de estado del servidor
- **Axios 1.7.9** - Cliente HTTP

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Servicios HTTP
│   │   ├── axios.ts      # Configuración de Axios
│   │   ├── empresas.ts
│   │   ├── parqueaderos.ts
│   │   ├── celdas.ts
│   │   ├── vehiculos.ts
│   │   └── reservas.ts
│   ├── components/       # Componentes reutilizables
│   │   └── MainLayout.tsx
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Parqueaderos.tsx
│   │   ├── Celdas.tsx
│   │   ├── Vehiculos.tsx
│   │   ├── Reservas.tsx
│   │   └── Pagos.tsx
│   ├── types/           # Definiciones TypeScript
│   │   └── index.ts
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
└── package.json
```

## 🎯 Funcionalidades

### Dashboard
- Vista general del sistema con estadísticas

### Parqueaderos
- ✅ Listar, crear y editar parqueaderos
- 📍 Gestión de direcciones, horarios y capacidad

### Celdas
- ✅ Gestión de celdas por parqueadero
- 🎨 Estados con colores (Disponible/Ocupada/Mantenimiento)
- 🔄 Cambio de estado en tiempo real

### Vehículos
- ✅ Búsqueda por placa
- ✅ Registro de nuevos vehículos

### Reservas
- ✅ Reservas activas
- ✅ Crear y finalizar reservas

### Pagos
- ✅ Procesamiento de pagos
- 💳 Múltiples métodos de pago

## 🔧 Configuración

### Backend URL
El frontend se conecta al backend en `http://localhost:3000/api`

Para cambiar la URL, edita `src/api/axios.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});
```

## ⚠️ Requisitos

- Node.js 18+
- npm 9+
- Backend corriendo en puerto 3000

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Ant Design](https://ant.design)
- [Vite Guide](https://vite.dev/guide/)
