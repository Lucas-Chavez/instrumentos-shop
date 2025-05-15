import { useState } from 'react';
import { useCarrito } from '../../hooks/UseContext';
import NavBar from '../../global/NavBar/NavBar';
import styles from './carrito.module.css';
import { useNavigate } from 'react-router-dom';
import { createPedido, getInstrumentoById, updateInstrumento } from '../../../api/api';
import type { Pedido, PedidoDetalle } from '../../../types/types';
import ObtenerEnvio from '../utils/ObtenerEnvio';
import EnvioInfo from '../utils/EnvioInfo/EnvioInfo';

function Carrito() {
    const { cart, addCarrito, removeItemCarrito, removeCarrito, clearCarrito, totalPedido } = useCarrito();
    const [mensaje, setMensaje] = useState<string>('');
    const [mostrarMensaje, setMostrarMensaje] = useState<boolean>(false);
    const [procesando, setProcesando] = useState<boolean>(false);
    const [tipoMensaje, setTipoMensaje] = useState<'exito' | 'error'>('exito');
    const navigate = useNavigate();

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

    const handleFinalizarCompra = async () => {
        if (cart.length === 0) {
            setMensaje('El carrito está vacío. Agregue productos antes de finalizar la compra.');
            setTipoMensaje('error');
            setMostrarMensaje(true);
            setTimeout(() => {
                setMostrarMensaje(false);
            }, 3000);
            return;
        }

        try {
            setProcesando(true);
            
            // Crear el objeto Pedido a partir del carrito
            const pedidoDetalles: PedidoDetalle[] = cart.map(item => ({
                id: 0, // El backend asignará el ID correcto
                cantidad: item.cantidad,
                instrumento: item.instrumento!
            }));
            
            // Fecha actual
            const fechaActual = new Date().toISOString().split('T')[0];
            
            // Crear objeto Pedido
            const nuevoPedido: Omit<Pedido, 'id'> = {
                fechaPedido: fechaActual,
                totalPedido: totalPedido || 0,
                pedidoDetalles: pedidoDetalles
            };
            
            // Enviar el pedido al servidor
            const pedidoCreado = await createPedido(nuevoPedido);
            
            // Actualizar la cantidad vendida de cada instrumento
            const actualizacionesPromises = cart.map(async (item) => {
                if (item.instrumento) {
                    // Obtener la información actual del instrumento
                    const instrumentoActual = await getInstrumentoById(item.instrumento.id);
                    
                    // Actualizar la cantidad vendida sumando la nueva cantidad
                    const instrumentoActualizado = {
                        ...instrumentoActual,
                        cantidadVendida: instrumentoActual.cantidadVendida + item.cantidad
                    };
                    
                    // Actualizar el instrumento en la base de datos
                    return updateInstrumento(item.instrumento.id, instrumentoActualizado);
                }
            });
            
            // Esperar a que todas las actualizaciones se completen
            await Promise.all(actualizacionesPromises);
            
            // Mostrar mensaje de éxito con el ID del pedido
            setMensaje(`¡Compra realizada con éxito! Pedido #${pedidoCreado.id} procesado correctamente.`);
            setTipoMensaje('exito');
            setMostrarMensaje(true);
            clearCarrito();
            
            setTimeout(() => {
                setMostrarMensaje(false);
                navigate('/ClientPage');
                // Desplazarse a la sección de productos después de navegar
                setTimeout(() => {
                    scrollToSectionWithOffset('productos');
                }, 100);
            }, 2500);
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            setMensaje('Ocurrió un error al procesar su compra. Por favor, inténtelo nuevamente.');
            setTipoMensaje('error');
            setMostrarMensaje(true);
            setTimeout(() => {
                setMostrarMensaje(false);
            }, 3000);
        } finally {
            setProcesando(false);
        }
    };

    const handleVolverTienda = () => {
        // Navegar a la página principal
        navigate('/ClientPage');
        
        // Después de la navegación, desplazar a la sección de productos
        setTimeout(() => {
            scrollToSectionWithOffset('productos');
        }, 100); // Pequeño retraso para asegurar que la página se haya cargado
    };

    return (
        <>
            <NavBar />
            <div className={styles["contenedor-carrito"]}>
                <h1 className={styles["titulo-carrito"]}>Mi Carrito de Compras</h1>
                
                {mostrarMensaje && (
                    <div className={`${styles["mensaje-alerta"]} ${tipoMensaje === 'exito' ? styles["mensaje-exito"] : styles["mensaje-error"]}`}>
                        {mensaje}
                    </div>
                )}
                
                {cart.length === 0 ? (
                    <div className={styles["carrito-vacio"]}>
                        <p>No hay productos en tu carrito</p>
                        <button 
                            className={styles["boton-volver-tienda"]}
                            onClick={handleVolverTienda}
                        >
                            Volver a la Tienda
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles["lista-productos"]}>
                            {cart.map((item) => {
                                // Obtener información de envío para mostrarla
                                const envioInfo = item.instrumento ? 
                                    ObtenerEnvio(item.instrumento.costoEnvio) : 
                                    { envio: '', claseEnvio: '', iconoEnvio: null };
                                
                                return (
                                    <div key={item.id} className={styles["producto-carrito"]}>
                                        <div className={styles["imagen-producto-carrito"]}>
                                            <img 
                                                src={`/img/${item.instrumento?.imagen}`} 
                                                alt={item.instrumento?.instrumento} 
                                            />
                                        </div>
                                        <div className={styles["detalles-producto-carrito"]}>
                                            <h3 className={styles["nombre-producto-carrito"]}>{item.instrumento?.instrumento}</h3>
                                            <div className={styles["precio-envio-container"]}>
                                                <p className={styles["precio-producto-carrito"]}>${item.instrumento?.precio}</p>
                                                <div className={styles["envio-producto-carrito"]}>
                                                    <EnvioInfo 
                                                        claseEnvio={envioInfo.claseEnvio} 
                                                        iconoEnvio={envioInfo.iconoEnvio} 
                                                        envio={envioInfo.envio} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles["controles-cantidad-carrito"]}>
                                            <button 
                                                className={styles["boton-reducir"]} 
                                                onClick={() => removeItemCarrito(item)}
                                                disabled={procesando}
                                            >
                                                -
                                            </button>
                                            <span className={styles["cantidad-producto-carrito"]}>{item.cantidad}</span>
                                            <button 
                                                className={styles["boton-aumentar"]}
                                                onClick={() => addCarrito(item)}
                                                disabled={procesando}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className={styles["subtotal-producto-carrito"]}>
                                            <p>Subtotal: ${(item.instrumento?.precio || 0) * item.cantidad}</p>
                                        </div>
                                        <button 
                                            className={styles["boton-eliminar-producto"]}
                                            onClick={() => removeCarrito(item)}
                                            disabled={procesando}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className={styles["resumen-carrito"]}>
                            <div className={styles["detalles-resumen"]}>
                                <h3 className={styles["titulo-resumen"]}>Resumen del pedido</h3>
                                <div className={styles["linea-resumen"]}>
                                    <span>Productos ({cart.reduce((total, item) => total + item.cantidad, 0)})</span>
                                    <span>${cart.reduce((sum, item) => 
                                        sum + ((item.instrumento?.precio || 0) * item.cantidad), 0).toFixed(2)}</span>
                                </div>
                                <div className={styles["linea-resumen"]}>
                                    <span>Costos de envío</span>
                                    <span>${cart.reduce((sum, item) => {
                                        if (item.instrumento?.costoEnvio && item.instrumento.costoEnvio !== 'G') {
                                            return sum + parseFloat(item.instrumento.costoEnvio);
                                        }
                                        return sum;
                                    }, 0).toFixed(2)}</span>
                                </div>
                                <div className={`${styles["linea-resumen"]} ${styles["linea-total"]}`}>
                                    <span>Total</span>
                                    <span>${totalPedido?.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className={styles["acciones-carrito"]}>
                                <button 
                                    className={styles["boton-vaciar-carrito"]}
                                    onClick={clearCarrito}
                                    disabled={procesando}
                                >
                                    Vaciar Carrito
                                </button>
                                <button 
                                    className={styles["boton-finalizar-compra"]}
                                    onClick={handleFinalizarCompra}
                                    disabled={procesando}
                                >
                                    {procesando ? 'Procesando...' : 'Finalizar Compra'}
                                </button>
                                <button 
                                    className={styles["boton-seguir-comprando"]}
                                    onClick={handleVolverTienda}
                                    disabled={procesando}
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Carrito;