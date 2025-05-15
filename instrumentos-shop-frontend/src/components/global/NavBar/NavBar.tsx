import { useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaMapMarkedAlt, FaGuitar } from 'react-icons/fa';
import { useCarrito } from '../../hooks/UseContext';
import styles from './navBar.module.css';
import { useState, useEffect } from 'react';
import { Rol } from '../../../types/Rol';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/ClientPage';
    const { cart } = useCarrito();
    
    // Estado para almacenar información del usuario
    const [usuario, setUsuario] = useState<{nombre: string; rol: string} | null>(null);
    
    // Cargar información del usuario al montar el componente
    useEffect(() => {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            try {
                const usuarioData = JSON.parse(usuarioStr);
                setUsuario({
                    nombre: usuarioData.nombreUsuario || 'Usuario',
                    rol: usuarioData.rol || ''
                });
            } catch (error) {
                console.error('Error al procesar información del usuario:', error);
            }
        }
    }, []);
    
    // Calcular el total de items en el carrito
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    
    // Verificar si el usuario puede acceder al carrito (no debe ser Visor)
    const puedeVerCarrito = usuario?.rol !== Rol.VISOR;
    
    const scrollToSectionWithOffset = (sectionId: string, offset: number = 80) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };
    
    const handleNavigation = (e: React.MouseEvent, section: string) => {
        e.preventDefault();
        
        if (isHomePage) {
            scrollToSectionWithOffset(section);
        } else {
            navigate('/ClientPage');
            setTimeout(() => {
                scrollToSectionWithOffset(section);
            }, 100);
        }
    };
    
    const handleCarritoNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/carrito');
    };
    
    // Función para cerrar sesión
    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem('usuario');
        localStorage.removeItem('isAuthenticated');
        
        // Redireccionar al login
        navigate('/login');
    };

    const esAdmin = usuario?.rol === Rol.ADMIN;

    return (
        <nav className={styles.navbar}>

            {/* nombre de la tienda */}
            <div className={styles.navbarBrand}>
                <a
                    href={esAdmin ? "/adminPage" : "/ClientPage"}
                    onClick={(e) => {
                        e.preventDefault();
                        if (esAdmin) {
                            navigate('/adminPage');
                        } else {
                            navigate('/ClientPage');
                        }
                        // Efecto de scroll suave al inicio
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                    }}
                >
                    Musical Hendrix
                </a>
            </div>

            
            {/* Navegación principal */}
            {!esAdmin && (
                <ul className={styles.navLinks}>
                    <li>
                        <a href="/ClientPage" onClick={(e) => handleNavigation(e, 'home')}>
                            <FaHome />
                            <span>Inicio</span>
                        </a>
                    </li>
                    <li>
                        <a href="/ClientPage" onClick={(e) => handleNavigation(e, 'productos')}>
                            <FaGuitar />
                            <span>Productos</span>
                        </a>
                    </li>
                    <li>
                        <a href="/ClientPage" onClick={(e) => handleNavigation(e, 'ubicacion')}>
                            <FaMapMarkedAlt />
                            <span>Ubicación</span>
                        </a>
                    </li>
                </ul>
            )}
            
            {/* Acciones de usuario */}
            <div className={styles.userActions}>
                {usuario && (
                    <>
                        <div className={styles.userProfile}>
                            <FaUser />
                            <div className={styles.userInfo}>
                                <span>{usuario.nombre}</span>
                                <small>{usuario.rol}</small>
                            </div>
                        </div>
                        
                        <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
                            <FaSignOutAlt />
                        </button>
                    </>
                )}
                
                {/* Mostrar el carrito solo si el usuario NO es Visor y NO es Admin */}
                {!esAdmin && puedeVerCarrito && (
                    <a 
                        href="/carrito" 
                        className={styles.cartBtn} 
                        onClick={handleCarritoNavigation}
                        title="Ver carrito"
                    >
                        <FaShoppingCart />
                        {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
                    </a>
                )}
            </div>
        </nav>
    );
}

export default NavBar;