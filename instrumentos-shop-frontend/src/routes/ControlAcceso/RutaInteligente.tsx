import { Navigate, useLocation } from 'react-router-dom';
import { Rol } from '../../types/Rol';

export default function RutaInteligente() {
    const location = useLocation();
    const jsonUsuario = localStorage.getItem('usuario');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated || !jsonUsuario) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('isAuthenticated');
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    
    try {
        const usuarioLogueado = JSON.parse(jsonUsuario);
        
        // Determinar a dónde redirigir según el rol
        let redirectTo = "/login";
        
        switch (usuarioLogueado.rol) {
            case Rol.ADMIN:
                redirectTo = "/adminPage";
                break;
            case Rol.OPERADOR:
            case Rol.VISOR:
                redirectTo = "/clientPage";
                break;
        }
        
        return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
    } catch (error) {
        // Si hay un error al procesar el usuario, redirigir a login
        return <Navigate to="/login" replace />;
    }
}