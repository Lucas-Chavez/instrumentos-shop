import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Rol } from '../../types/Rol';
import type { Usuario } from '../../types/types';

interface Props {
    rolPermitido: Rol[];
}

function RolUsuario({ rolPermitido }: Props) {
    const jsonUsuario = localStorage.getItem('usuario');
    const usuarioLogueado: Usuario | null = jsonUsuario ? JSON.parse(jsonUsuario) as Usuario : null;
    const location = useLocation();

    // Si no está logueado, redirige a login
    if (!usuarioLogueado) {
        return <Navigate replace to="/login" />;
    }

    // Si el rol está permitido, deja ingresar
    if (rolPermitido.includes(usuarioLogueado.rol)) {
        return <Outlet />;
    }

    // Determinar la página a la que redirigir según el rol del usuario
    let redirectTo = "/login"; // Valor por defecto

    switch (usuarioLogueado.rol) {
        case Rol.ADMIN:
            redirectTo = "/adminPage";
            break;
        case Rol.OPERADOR:
        case Rol.VISOR:
            redirectTo = "/clientPage";
            break;
    }

    // Redirigir a la página correspondiente al rol del usuario
    return <Navigate replace to={redirectTo} state={{ from: location.pathname }} />;
}

export default RolUsuario;