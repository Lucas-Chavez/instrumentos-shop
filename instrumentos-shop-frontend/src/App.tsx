import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.tsx';
import { CarritoContextProvider } from './components/context/CarritoContext.tsx';

function App() {
    return (
        <CarritoContextProvider>
            <BrowserRouter>
                <div className="App">
                    <AppRoutes/>
                </div>
            </BrowserRouter>
        </CarritoContextProvider>
    )
}

export default App