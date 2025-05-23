import GraficoBarras from '../../components/admin/GraficoBarra';
import GraficoTorta from '../../components/admin/GraficoTorta';
import InstrumentoList from '../../components/admin/ListInstrumentos/ListInstrumentos';
import Navbar from '../../components/global/NavBar/NavBar';
import BotonDescargaExcel from '../../components/admin/BotonDescargaExcel';

function AdminPage() {
    return (
        <div className="AdminPage">
            <Navbar />
            <InstrumentoList />
            <BotonDescargaExcel/>
            <GraficoBarras/>
            <GraficoTorta/>
        </div>
    );

    
}

export default AdminPage