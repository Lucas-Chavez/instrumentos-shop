import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');

    return (
        <div className="payment-result success">
            <h2>¡Pago realizado con éxito!</h2>
            <p>ID de pago: {paymentId}</p>
            <Link to="/">Volver a la tienda</Link>
        </div>
    );
};

export default PaymentSuccess;