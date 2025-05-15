import InstrumentoList from '../../components/admin/ListInstrumentos/ListInstrumentos';
import Navbar from '../../components/global/NavBar/NavBar';

function AdminPage() {
    return (
        <div className="AdminPage">
            <Navbar />
            <InstrumentoList />
        </div>
    );

    
}

export default AdminPage