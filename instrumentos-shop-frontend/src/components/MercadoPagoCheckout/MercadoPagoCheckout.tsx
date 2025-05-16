// src/components/MercadoPagoCheckout/MercadoPagoCheckout.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './mercadoPagoCheckout.module.css';
import { useCarrito } from '../hooks/UseContext';
import { createPedido } from '../../api/api';
import type { Pedido, PedidoDetalle } from '../../types/types';

interface CheckoutProps {
    title: string;
    price: number;
    quantity: number;
    description: string;
    onProcessingChange: (isProcessing: boolean) => void;
}

const MercadoPagoCheckout: React.FC<CheckoutProps> = ({
    title,
    price,
    quantity,
    description,
    onProcessingChange
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cart } = useCarrito();

    const createPreference = async () => {
        try {
            setIsLoading(true);
            onProcessingChange(true);
            setError(null);
            
            // Crear el objeto Pedido a partir del carrito
            const pedidoDetalles: PedidoDetalle[] = cart.map(item => ({
                id: 0, // El backend asignará el ID correcto
                cantidad: item.cantidad,
                instrumento: item.instrumento!
            }));
            
            // Fecha actual
            const fechaActual = new Date().toISOString();
            
            // Crear objeto Pedido
            const nuevoPedido: Omit<Pedido, 'id'> = {
                fechaPedido: fechaActual,
                totalPedido: price,
                pedidoDetalles: pedidoDetalles
            };
            
            // Guardar el pedido en la base de datos
            console.log('Guardando pedido en la BD:', nuevoPedido);
            const pedidoCreado = await createPedido(nuevoPedido);
            console.log('Pedido creado exitosamente:', pedidoCreado);

            // Crear la preferencia de MercadoPago
            const response = await axios.post('http://localhost:8080/api/payment/create-preference', {
                title,
                price,
                quantity,
                description,
                pedidoId: pedidoCreado.id // Enviar el ID del pedido creado
            });

            // Obtiene la URL del initPoint directamente
            const initPointUrl = response.data;
            console.log("URL de redirección:", initPointUrl);

            // Redirecciona al usuario a la página de Mercado Pago
            window.location.href = initPointUrl;
            
        } catch (err) {
            console.error('Error al crear preferencia:', err);
            setError('No se pudo procesar el pago. Intente nuevamente.');
            setIsLoading(false);
            onProcessingChange(false);
        }
    };

    return (
        <div className={styles.mercadoPagoCheckout}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <button
                onClick={createPreference}
                disabled={isLoading}
                className={styles.paymentButton}
            >
                {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
        </div>
    );
};

export default MercadoPagoCheckout;