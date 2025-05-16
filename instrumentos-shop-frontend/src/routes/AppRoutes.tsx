import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import RolUsuario from './ControlAcceso/RolUsuario';
import { Rol } from '../types/Rol';
import LoadingFallback from '../components/global/Loading/LoadingFallback';
import Login from '../components/global/Login/Login';
import ClientPage from '../pages/client/ClientPage';
import DetalleInstrumento from '../components/client/DetalleInstrumento/DetalleInstrumento';
import Carrito from '../components/client/Carrito/Carrito';
import AdminPage from '../pages/admin/AdminPage';
import RutaInteligente from './ControlAcceso/RutaInteligente';
import PaymentSuccess from '../pages/PaymentResult/Success';
import PaymentFailure from '../pages/PaymentResult/Failure';
import PaymentPending from '../pages/PaymentResult/Pending';

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Ruta raíz redirige a la ruta inteligente */}
                <Route path="/" element={<RutaInteligente />} />

                {/* Ruta pública del Login */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas para Admin */}
                <Route element={<RolUsuario rolPermitido={[Rol.ADMIN]} />}>
                    <Route path="/adminPage" element={<AdminPage />} />
                </Route>
                
                {/* Rutas protegidas para Operador y Visor */}
                <Route element={<RolUsuario rolPermitido={[Rol.OPERADOR, Rol.VISOR]} />}>
                    <Route path="/clientPage" element={<ClientPage />} />
                    <Route path="/detalle/:idInstrumento" element={<DetalleInstrumento />} />
                </Route>
                
                {/* Rutas solo para Operador */}
                <Route element={<RolUsuario rolPermitido={[Rol.OPERADOR]} />}>
                    <Route path="/carrito" element={<Carrito />} />
                </Route>
                
                {/* Captura cualquier otra ruta no definida */}
                <Route path="*" element={<RutaInteligente />} />

                <Route path="/success" element={<PaymentSuccess />} />
                <Route path="/failure" element={<PaymentFailure />} />
                <Route path="/pending" element={<PaymentPending />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;