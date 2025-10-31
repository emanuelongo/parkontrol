import axios from 'axios';
import { notification } from 'antd';

// Configurar notification globalmente (más visible que message)
notification.config({
  placement: 'topRight',
  top: 80,
  duration: 4,
  maxCount: 3,
});

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejar respuestas exitosas
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const operacion = method === 'POST' ? 'creado' : 
                       method === 'PUT' || method === 'PATCH' ? 'actualizado' : 
                       'eliminado';
      
      console.log('✅ OPERACIÓN EXITOSA:', operacion);
      
      // Usar notification en lugar de message para mejor visibilidad
      notification.success({
        message: '✅ Operación Exitosa',
        description: `Registro ${operacion} correctamente`,
        placement: 'topRight',
        duration: 4,
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ ERROR COMPLETO:', error);
    
    let errorTitle = '❌ Error';
    let errorDescription = 'Error desconocido';
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('📡 Respuesta del servidor:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: data
      });
      
      switch (status) {
        case 400:
          errorTitle = '❌ Datos Inválidos';
          errorDescription = Array.isArray(data.message) 
            ? data.message.join(', ') 
            : data.message || 'Verifica los campos del formulario';
          break;
        case 404:
          errorTitle = '❌ No Encontrado';
          errorDescription = 'El recurso no existe en la base de datos';
          break;
        case 500:
          if (data.message && data.message.includes('ORA-')) {
            const oraError = data.message.match(/ORA-\d+/)?.[0];
            errorTitle = `❌ Error de BD (${oraError})`;
            errorDescription = data.message.substring(0, 200);
            console.error('💾 ERROR DE BD:', data.message);
          } else {
            errorTitle = '❌ Error del Servidor';
            errorDescription = data.message || 'Error interno del servidor';
          }
          break;
        default:
          errorTitle = `❌ Error ${status}`;
          errorDescription = data.message || error.message;
      }
      
      notification.error({
        message: errorTitle,
        description: errorDescription,
        placement: 'topRight',
        duration: 6,
      });
      
    } else if (error.request) {
      errorTitle = '❌ BACKEND NO RESPONDE';
      errorDescription = 'No se pudo conectar con http://localhost:3000. Verifica que el servidor esté corriendo.';
      
      console.error('🔌 Backend no responde');
      
      notification.error({
        message: errorTitle,
        description: errorDescription,
        placement: 'topRight',
        duration: 8,
      });
      
    } else if (error.code === 'ECONNABORTED') {
      errorTitle = '❌ TIMEOUT';
      errorDescription = 'El servidor no respondió a tiempo';
      
      notification.error({
        message: errorTitle,
        description: errorDescription,
        placement: 'topRight',
        duration: 5,
      });
      
    } else {
      errorTitle = '❌ Error de Configuración';
      errorDescription = error.message;
      
      notification.error({
        message: errorTitle,
        description: errorDescription,
        placement: 'topRight',
        duration: 5,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
