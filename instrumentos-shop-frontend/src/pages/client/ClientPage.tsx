import Navbar from '../../components/global/NavBar/NavBar'; 
import SliderInstrumento from '../../components/client/SliderInstrumento/SliderInstrumento';
import GrillaInstrumentos from '../../components/client/GrillaInstrumentos/GrillaInstrumentos'; 

import './client.css'; 

function ClientPage() {
    return (
        <div className="contenedor-home">
            <Navbar />
            <h1 id="home" className="titulo">Musical Hendrix</h1>
            <img 
                src="https://musicway.es/wp-content/uploads/2023/05/como-elegir-el-instrumento-musical-adecuado-para-ti-1024x640.jpg" 
                alt="Instrumentos Musicales"
                className="imagen-home"
            />
            <p className="descripcion">
                Musical Hendrix es una tienda de instrumentos musicales con ya más de 15 años de experiencia. 
                Tenemos el conocimiento y la capacidad como para informarte acerca de las mejores elecciones para tu compra musical.
            </p>

            <h2 id="ubicacion" className="subtitulo">¿Dónde Estamos?</h2>
            <div className="mapa">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.269026511184!2d-68.84088112357964!3d-32.886318474723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20M5502%20Capital%2C%20Mendoza!5e0!3m2!1ses-419!2sar!4v1713475215151!5m2!1ses-419!2sar" 
                    width="100%" 
                    height="400" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                ></iframe>
            </div>

            <SliderInstrumento />

            <h2 id="productos" className="subtitulo">Productos</h2>
            <div className='GrillaInstrumentos'>
                <GrillaInstrumentos />
            </div>  
        </div>
    );
};

export default ClientPage;