import axios from 'axios';
import { notification } from 'antd';

// Configurar notification globalmente
notification.config({
  placement: 'topRight',
  top: 80,
  duration: 4,
  maxCount: 3,
  rtl: false,
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
      
      console.log('[EXITO] Operacion:', operacion);
      
      // Mostrar notificación de éxito
      notification.success({
        message: 'Operacion Exitosa',
        description: `Registro ${operacion} correctamente`,
        placement: 'topRight',
        duration: 4,
      });
    }
    return response;
  },
  (error) => {
    console.error('[ERROR] Error capturado:', error);
    
    let errorMessage = 'Error';
    let errorDetails = 'Error desconocido';
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('[ERROR] Respuesta del servidor:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: data
      });
      
      switch (status) {
        case 400:
          errorMessage = 'Datos invalidos';
          errorDetails = Array.isArray(data.message) 
            ? data.message.join(', ') 
            : data.message || 'Verifica los campos del formulario';
          break;
        case 404:
          errorMessage = 'No encontrado';
          errorDetails = 'El recurso solicitado no existe en la base de datos';
          break;
        case 500:
          if (data.message && data.message.includes('ORA-')) {
            const oraError = data.message.match(/ORA-\d+/)?.[0];
            errorMessage = `Error de Base de Datos (${oraError})`;
            errorDetails = data.message.substring(0, 200);
            console.error('[ERROR] Error de BD:', data.message);
          } else {
            errorMessage = 'Error del servidor';
            errorDetails = data.message || 'Error interno del servidor';
          }
          break;
        default:
          errorMessage = `Error ${status}`;
          errorDetails = data.message || error.message;
      }
      
      notification.error({
        message: errorMessage,
        description: errorDetails,
        placement: 'topRight',
        duration: 6,
      });
      
    } else if (error.request) {
      errorMessage = 'Backend no responde';
      errorDetails = 'No se pudo conectar con el servidor. Verifica que este corriendo en http://localhost:3000';
      
      console.error('[ERROR] Backend no responde');
      console.error('[ERROR] URL intentada:', error.config?.url);
      
      notification.error({
        message: errorMessage,
        description: errorDetails,
        placement: 'topRight',
        duration: 8,
      });
      
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Timeout';
      errorDetails = 'El servidor no respondio a tiempo';
      
      console.error('[ERROR] Timeout');
      
      notification.error({
        message: errorMessage,
        description: errorDetails,
        placement: 'topRight',
        duration: 5,
      });
      
    } else {
      errorMessage = 'Error de configuracion';
      errorDetails = error.message;
      
      console.error('[ERROR] Error de configuracion:', error);
      
      notification.error({
        message: errorMessage,
        description: errorDetails,
        placement: 'topRight',
        duration: 5,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
