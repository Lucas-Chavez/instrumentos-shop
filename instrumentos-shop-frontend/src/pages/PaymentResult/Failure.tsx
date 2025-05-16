import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../../components/global/NavBar/NavBar';
import styles from './paymentResult.module.css';
import { IoCloseCircleOutline } from 'react-icons/io5';

const PaymentFailure: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');
    const status = queryParams.get('status');
    const errorMessage = queryParams.get('error') || 'Ha ocurrido un error durante el proceso de pago';

    return (
        <>
            <NavBar />
            <div className={styles.paymentResultContainer}>
                <div className={`${styles.paymentResultCard} ${styles.failureCard}`}>
                    <div className={styles.iconContainer}>
                        <IoCloseCircleOutline className={styles.failureIcon} />
                    </div>
                    <h2>Error en el pago</h2>
                    <p>No pudimos procesar tu pago correctamente.</p>
                    <div className={styles.paymentDetails}>
                        {paymentId && <p><strong>ID de pago:</strong> {paymentId}</p>}
                        {status && <p><strong>Estado:</strong> {status}</p>}
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    </div>
                    <div className={styles.actionButtons}>
                        <Link to="/carrito" className={styles.retryButton}>
                            Intentar nuevamente
                        </Link>
                        <Link to="/ClientPage" className={styles.backButton}>
                            Volver a la tienda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentFailure;