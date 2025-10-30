import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para manejar respuestas exitosas
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa y hay un método específico (POST, PUT, PATCH, DELETE)
    const method = response.config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      // Mostrar mensaje de éxito SIEMPRE
      const operacion = method === 'POST' ? 'creado' : 
                       method === 'PUT' || method === 'PATCH' ? 'actualizado' : 
                       'eliminado';
      
      console.log('✅ OPERACIÓN EXITOSA:', operacion);
      message.success(`✅ Registro ${operacion} exitosamente`, 3);
    }
    return response;
  },
  (error) => {
    // SIEMPRE mostrar errores, sin importar qué
    console.error('❌ ERROR COMPLETO:', error);
    
    let errorMessage = '❌ Error desconocido';
    let errorDetails = '';
    
    if (error.response) {
      // El servidor respondió con un código de error
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
          errorMessage = '❌ Datos inválidos';
          errorDetails = Array.isArray(data.message) 
            ? data.message.join(', ') 
            : data.message || 'Verifica los campos del formulario';
          break;
        case 404:
          errorMessage = '❌ No encontrado';
          errorDetails = 'El recurso solicitado no existe en la base de datos';
          break;
        case 500:
          // Extraer el mensaje de error de Oracle si existe
          if (data.message && data.message.includes('ORA-')) {
            const oraError = data.message.match(/ORA-\d+/)?.[0];
            errorMessage = `❌ Error de Base de Datos (${oraError})`;
            errorDetails = data.message;
            console.error('💾 ERROR DE BD COMPLETO:', data.message);
          } else {
            errorMessage = '❌ Error del servidor';
            errorDetails = data.message || 'Error interno del servidor';
          }
          break;
        default:
          errorMessage = `❌ Error ${status}`;
          errorDetails = data.message || error.message;
      }
      
      // Mostrar el error con duración larga para que se vea
      message.error({
        content: `${errorMessage}: ${errorDetails}`,
        duration: 5,
        style: { marginTop: '20vh' }
      });
      
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage = '❌ BACKEND NO RESPONDE';
      errorDetails = 'No se pudo conectar con http://localhost:3000. Verifica que el servidor esté corriendo.';
      
      console.error('🔌 Backend no responde - Request:', error.request);
      console.error('🔌 URL intentada:', error.config?.url);
      
      message.error({
        content: `${errorMessage}: ${errorDetails}`,
        duration: 8,
        style: { marginTop: '20vh' }
      });
      
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      errorMessage = '❌ TIMEOUT';
      errorDetails = 'La operación tardó demasiado. El servidor no respondió a tiempo.';
      
      console.error('⏱️ Timeout del request');
      
      message.error({
        content: `${errorMessage}: ${errorDetails}`,
        duration: 5,
        style: { marginTop: '20vh' }
      });
      
    } else {
      // Error al configurar la petición
      errorMessage = '❌ Error de configuración';
      errorDetails = error.message;
      
      console.error('⚙️ Error de configuración:', error);
      
      message.error({
        content: `${errorMessage}: ${errorDetails}`,
        duration: 5,
        style: { marginTop: '20vh' }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
