import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Parqueaderos from './pages/Parqueaderos';
import Celdas from './pages/Celdas';
import Vehiculos from './pages/Vehiculos';
import Reservas from './pages/Reservas';
import Pagos from './pages/Pagos';
import TestNotifications from './components/TestNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="parqueaderos" element={<Parqueaderos />} />
              <Route path="celdas" element={<Celdas />} />
              <Route path="vehiculos" element={<Vehiculos />} />
              <Route path="reservas" element={<Reservas />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="test-notificaciones" element={<TestNotifications />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
