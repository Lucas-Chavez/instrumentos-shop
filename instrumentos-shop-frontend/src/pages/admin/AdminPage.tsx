import GraficoBarras from '../../components/admin/GraficoBarra';
import GraficoTorta from '../../components/admin/GraficoTorta';
import InstrumentoList from '../../components/admin/ListInstrumentos/ListInstrumentos';
import Navbar from '../../components/global/NavBar/NavBar';

function AdminPage() {
    return (
        <div className="AdminPage">
            <Navbar />
            <InstrumentoList />
            <GraficoBarras/>
            <GraficoTorta/>
        </div>
    );

    
}

export default AdminPage