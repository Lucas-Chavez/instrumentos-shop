import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../../components/global/NavBar/NavBar';
import styles from './paymentResult.module.css';
import { IoTimeOutline } from 'react-icons/io5';

const PaymentPending: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');
    const status = queryParams.get('status');

    return (
        <>
            <NavBar />
            <div className={styles.paymentResultContainer}>
                <div className={`${styles.paymentResultCard} ${styles.pendingCard}`}>
                    <div className={styles.iconContainer}>
                        <IoTimeOutline className={styles.pendingIcon} />
                    </div>
                    <h2>Pago en proceso</h2>
                    <p>Estamos procesando tu pago. Esto puede tomar unos minutos.</p>
                    <div className={styles.paymentDetails}>
                        {paymentId && <p><strong>ID de pago:</strong> {paymentId}</p>}
                        {status && <p><strong>Estado:</strong> {status}</p>}
                    </div>
                    <div className={styles.pendingMessage}>
                        <p>Una vez que se confirme el pago, recibirás una notificación.</p>
                        <p>No es necesario volver a realizar la compra.</p>
                    </div>
                    <Link to="/ClientPage" className={styles.backButton}>
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PaymentPending;