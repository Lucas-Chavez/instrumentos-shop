import { useEffect, useState } from "react";
import type { Instrumento } from "../../../types/types";
import type { DetalleCarrito } from "../../context/CarritoContext";
import { getInstrumentos } from "../../../api/api"; 
import ObtenerEnvio from '../utils/ObtenerEnvio';
import EnvioInfo from '../utils/EnvioInfo/EnvioInfo';
import { useCarrito } from '../../hooks/UseContext';
import { Rol } from '../../../types/Rol';
import styles from './grillaInstrumento.module.css';
import BotonDescargaPdf from './BotonDescargaPdf'; // o la ruta correcta según tu estructura


function GrillaInstrumentos() {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [, setError] = useState<string>("");
    const [cantidades, setCantidades] = useState<{[key: number]: number}>({});
    const { cart, addCarrito, removeCarrito, removeItemCarrito } = useCarrito();
    const [esUsuarioVisor, setEsUsuarioVisor] = useState<boolean>(false);
    
    useEffect(() => {
        // Verificar el rol del usuario al cargar el componente
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            try {
                const usuario = JSON.parse(usuarioStr);
                setEsUsuarioVisor(usuario.rol === Rol.VISOR);
            } catch (error) {
                console.error('Error al procesar información del usuario:', error);
            }
        }
    }, []);
    
    useEffect(() => {
        const loadInstrumentos = async () => {
            try {
                const datos = await getInstrumentos();
                setInstrumentos(datos);
                
                // Inicializar las cantidades para cada instrumento en 0
                const cantidadesIniciales = datos.reduce((acc, instrumento) => {
                    acc[instrumento.id] = 0;
                    return acc;
                }, {} as {[key: number]: number});
                
                // Actualizar las cantidades con los elementos ya en el carrito
                cart.forEach(item => {
                    if (item.instrumento) {
                        cantidadesIniciales[item.instrumento.id] = item.cantidad;
                    }
                });
                
                setCantidades(cantidadesIniciales);
                setError("");
            } catch (err) {
                setError("No se pudieron cargar los instrumentos");
                console.error(err);
            }
        };
        
        loadInstrumentos();
    }, [cart]);
    
    const handleIncrementarCantidad = (instrumento: Instrumento) => {
        // Crear un objeto DetalleCarrito con cantidad 1
        const detalleCarrito: DetalleCarrito = {
            id: instrumento.id,
            cantidad: 1,
            instrumento: instrumento
        };
        
        // Usar addCarrito del contexto
        addCarrito(detalleCarrito);
    };
    
    const handleDisminuirCantidad = (instrumento: Instrumento) => {
        const cantidadActual = cantidades[instrumento.id] || 0;
        
        if (cantidadActual > 0) {
            // Crear un objeto DetalleCarrito para eliminar un ítem
            const detalleCarrito: DetalleCarrito = {
                id: instrumento.id,
                cantidad: 1,
                instrumento: instrumento
            };
            
            // Si la cantidad llegará a 0, remover completamente del carrito
            if (cantidadActual === 1) {
                removeCarrito(detalleCarrito);
            } else {
                // De lo contrario, solo disminuir en 1
                removeItemCarrito(detalleCarrito);
            }
        }
    };
    
    const handleToggleCarrito = (instrumento: Instrumento) => {
        const cantidadActual = cantidades[instrumento.id] || 0;
        const detalleCarrito: DetalleCarrito = {
            id: instrumento.id,
            cantidad: 1,
            instrumento: instrumento
        };
        
        if (cantidadActual > 0) {
            // Si ya está en el carrito, eliminarlo completamente
            removeCarrito(detalleCarrito);
        } else {
            // Si no está en el carrito, agregarlo
            addCarrito(detalleCarrito);
        }
    };
    
    return (
        <>
            {instrumentos.map((instrumento: Instrumento) => {
                const { envio, claseEnvio, iconoEnvio } = ObtenerEnvio(instrumento.costoEnvio);
                const cantidad = cantidades[instrumento.id] || 0;
                const estaEnCarrito = cantidad > 0;
                
                return (
                    <div key={instrumento.id}>
                        <div className={styles.containerGrilla}>
                            <div className={styles.row}>
                                <div className={styles.imageContainer}>
                                    <img src={`./img/${instrumento.imagen}`} alt={instrumento.imagen} className={styles.image} />
                                </div>
                                <div className={styles.informacion}>
                                    <h5 className={styles.cardTitle}>{instrumento.instrumento}</h5>
                                    <p className={styles.cardText}>${instrumento.precio}</p>
                                    <EnvioInfo claseEnvio={claseEnvio} iconoEnvio={iconoEnvio} envio={envio} />
                                    <p className={styles.cardVendidos}>{instrumento.cantidadVendida} vendidos</p>

                                    <div className={styles.botonesContainer}>
                                        <a href={`detalle/${instrumento.id}`}>
                                            <button type='button' className={styles.btn}>Detalles</button>
                                        </a>
                                        <BotonDescargaPdf instrumentoId={instrumento.id} />
                                    
                                    
                                        
                                        {/* Mostrar los controles del carrito solo si NO es usuario VISOR */}
                                        {!esUsuarioVisor && (
                                            <>
                                                {estaEnCarrito ? (
                                                    <div className={styles.cantidadControl}>
                                                        <button 
                                                            className={styles.btnCantidad} 
                                                            onClick={() => handleDisminuirCantidad(instrumento)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={styles.cantidadDisplay}>{cantidad}</span>
                                                        <button 
                                                            className={styles.btnCantidad} 
                                                            onClick={() => handleIncrementarCantidad(instrumento)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : null}
                                                
                                                <button 
                                                    type='button' 
                                                    className={estaEnCarrito ? styles.btnEliminarCarrito : styles.btnAgregarCarrito}
                                                    onClick={() => handleToggleCarrito(instrumento)}
                                                >
                                                    {estaEnCarrito ? 'Eliminar' : 'Agregar'}
                                                </button>
                                            </>
                                        )}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default GrillaInstrumentos;