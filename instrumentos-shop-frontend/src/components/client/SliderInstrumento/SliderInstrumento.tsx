import { useState, useEffect, useRef } from 'react';
import type { Instrumento } from '../../../types/types';
import { getInstrumentos } from "../../../api/api";
import styles from './sliderInstrumento.module.css';

function SliderInstrumento() {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [error, setError] = useState<string>("");
    const sliderRef = useRef<HTMLDivElement>(null);
    const [, setIsScrolling] = useState(false);
    
    // Carga los instrumentos al montar el componente
    useEffect(() => {
        const obtenerInstrumentos = async () => {
            try {
                const datos = await getInstrumentos();
                
                // Filtrar solo los instrumentos con más de 10 ventas
                const instrumentosFiltrados = datos.filter(instrumento => {
                    return instrumento.cantidadVendida > 10;
                });
                setInstrumentos(instrumentosFiltrados);
                setError("");
            } catch (err) {
                setError("Error al obtener instrumentos");
                console.error("Error al obtener instrumentos:", err);
            }
        };
        
        obtenerInstrumentos();
    }, []);
    
    // Funciones para controlar el desplazamiento del slider
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -300, // desplaza 300px hacia la izquierda
                behavior: 'smooth' // animación suave
            });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: 300, // desplaza 300px hacia la derecha
                behavior: 'smooth' // animación suave
            });
        }
    };
    
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className={styles.sliderInstrumentos}>
            <div className={styles.sliderHeader}>
                <h2 className={styles.sliderTitulo}>Instrumentos Más Vendidos</h2>
            </div>
            
            <div className={styles.sliderWrapper}>
                <button 
                    className={`${styles.sliderControl} ${styles.sliderControlLeft}`} 
                    onClick={scrollLeft}
                    aria-label="Deslizar a la izquierda"
                >
                    &lt;
                </button>
                <div 
                    className={styles.sliderContenedor} 
                    ref={sliderRef}
                    onMouseDown={() => setIsScrolling(true)}
                    onMouseUp={() => setIsScrolling(false)}
                    onMouseLeave={() => setIsScrolling(false)}
                >
                    {instrumentos.map((item) => (
                        <div className={styles.sliderItem} key={item.id}>
                            <div className={styles.tarjetaInstrumento}>
                                <div className={styles.tarjetaContainer}>
                                    <div className={styles.tarjetaImagenContainer}>
                                        <img src={`./img/${item.imagen}`} alt={item.instrumento} className={styles.tarjetaImagen} />
                                    </div>
                                    <div className={styles.tarjetaInfo}>
                                        <h3 className={styles.tarjetaTitulo}>{item.instrumento}</h3>
                                        <p className={styles.tarjetaVendidos}>{item.cantidadVendida} vendidos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    className={`${styles.sliderControl} ${styles.sliderControlRight}`} 
                    onClick={scrollRight}
                    aria-label="Deslizar a la derecha"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default SliderInstrumento;