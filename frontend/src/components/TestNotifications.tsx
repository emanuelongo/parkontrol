import { Button, Space, message } from 'antd';

/**
 * Componente de prueba para verificar que las notificaciones funcionen
 * Usar temporalmente para confirmar que Ant Design message funciona
 */
const TestNotifications = () => {
  
  const testSuccess = () => {
    console.log('🧪 Probando notificación de éxito...');
    message.success('✅ ¡Notificación de éxito funciona!', 3);
  };

  const testError = () => {
    console.log('🧪 Probando notificación de error...');
    message.error('❌ ¡Notificación de error funciona!', 3);
  };

  const testWarning = () => {
    console.log('🧪 Probando notificación de advertencia...');
    message.warning('⚠️ ¡Notificación de advertencia funciona!', 3);
  };

  const testInfo = () => {
    console.log('🧪 Probando notificación de info...');
    message.info('ℹ️ ¡Notificación de info funciona!', 3);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Pruebas de Notificaciones</h2>
      <p>Haz clic en cada botón para verificar que las notificaciones funcionen:</p>
      <Space direction="vertical" size="middle">
        <Button type="primary" onClick={testSuccess}>
          Probar Success
        </Button>
        <Button danger onClick={testError}>
          Probar Error
        </Button>
        <Button onClick={testWarning}>
          Probar Warning
        </Button>
        <Button onClick={testInfo}>
          Probar Info
        </Button>
      </Space>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p><strong>Nota:</strong> Abre la consola (F12) para ver los logs.</p>
        <p>Si no ves las notificaciones emergentes, hay un problema con Ant Design.</p>
      </div>
    </div>
  );
};

export default TestNotifications;
