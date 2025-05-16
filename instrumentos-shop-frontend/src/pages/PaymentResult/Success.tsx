import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../../components/global/NavBar/NavBar';
import styles from './paymentResult.module.css';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');
    const status = queryParams.get('status');

    return (
        <>
            <NavBar />
            <div className={styles.paymentResultContainer}>
                <div className={styles.paymentResultCard}>
                    <div className={styles.iconContainer}>
                        <IoCheckmarkCircleOutline className={styles.successIcon} />
                    </div>
                    <h2>¡Pago realizado con éxito!</h2>
                    <p>Tu compra ha sido procesada correctamente.</p>
                    <div className={styles.paymentDetails}>
                        <p><strong>Estado:</strong> {status || 'Aprobado'}</p>
                        <p><strong>ID de pago:</strong> {paymentId}</p>
                    </div>
                    <p className={styles.thankYouMessage}>¡Gracias por tu compra!</p>
                    <Link to="/ClientPage" className={styles.backButton}>
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;