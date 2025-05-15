import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Instrumento } from "../../../types/types"; 
import { getInstrumentoById } from "../../../api/api";
import ObtenerEnvio from '../utils/ObtenerEnvio';
import EnvioInfo from '../utils/EnvioInfo/EnvioInfo';
import styles from './DetalleInstrumento.module.css';
import NavBar from '../../global/NavBar/NavBar';

export function DetalleInstrumento() {
    const { idInstrumento } = useParams<{ idInstrumento: string }>();
    const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarInstrumento = async () => {
            try {
                setLoading(true);
                if (idInstrumento) {
                    const data = await getInstrumentoById(Number(idInstrumento));
                    setInstrumento(data);
                    setError("");
                }
            } catch (err) {
                setError("No se pudo cargar el detalle del instrumento");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        cargarInstrumento();
    }, [idInstrumento]);
    
    const handleVolver = () => {
        // Navega primero a la página home
        navigate('/ClientPage');
        
        // Espera a que se complete la navegación 
        setTimeout(() => {
            const element = document.getElementById('productos'); // busca el elemento con ID "productos"
            if (element) {
                // Calcula su posición y le aplica un desplazamiento
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - 80; 
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100); // 100 milisegundos de espera para que cargue la página
    };
    
    if (loading) {
        return (
            <>
                <NavBar />
                <div className="alert alert-info">Cargando detalle del instrumento...</div>
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <NavBar />
                <div className="alert alert-danger">{error}</div>
            </>
        );
    }
    
    if (!instrumento) {
        return (
            <>
                <NavBar />
                <div className="alert alert-warning">No se encontró el instrumento solicitado</div>
            </>
        );
    }
    
    const { envio, claseEnvio, iconoEnvio } = ObtenerEnvio(instrumento.costoEnvio);
    
    return (
        <>
            <NavBar />
            <div className={styles["envoltura-detalle-producto"]}>
                <div className={styles["contenedor-detalle-producto"]}>
                    <div className={styles["detalle-producto-izquierda"]}>
                        <img src={"/img/" + instrumento.imagen} alt={instrumento.instrumento} className={styles["imagen-principal-producto"]} />
                        <div className={styles["caja-descripcion-producto"]}>
                            <h3 className={styles["titulo-descripcion-producto"]}>Descripción:</h3>
                            <p className={styles["texto-descripcion-producto"]}>{instrumento.descripcion}</p>
                        </div>
                    </div>
                    <div className={styles["detalle-producto-derecha"]}>
                        <p className={styles["cantidad-vendida-producto"]}>{instrumento.cantidadVendida} vendidos</p>
                        <h1 className={styles["titulo-producto"]}>{instrumento.instrumento}</h1>
                        <h2 className={styles["precio-producto"]}>$ {instrumento.precio}</h2>
                        <div className={styles["especificaciones-producto"]}>
                            <p className={styles["marca-producto"]}>Marca: {instrumento.marca}</p>
                            <p className={styles["modelo-producto"]}>Modelo: {instrumento.modelo}</p>
                        </div>
                        <div className={styles["informacion-envio-producto"]}>
                            <p className={styles["titulo-envio-producto"]}>Costo Envío:</p>
                            <EnvioInfo claseEnvio={claseEnvio} iconoEnvio={iconoEnvio} envio={envio} />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleVolver} 
                            className={styles["boton-volver-producto"]}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetalleInstrumento;