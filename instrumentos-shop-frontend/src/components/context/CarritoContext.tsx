import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Instrumento } from '../../types/types';

export interface DetalleCarrito {
    id: number;
    cantidad: number;
    instrumento?: Instrumento
}

// Interfaz para el contexto del carrito
interface CartContextType {
    cart: DetalleCarrito[];
    addCarrito: (product: DetalleCarrito) => void;
    removeCarrito: (product: DetalleCarrito) => void;
    removeItemCarrito: (product: DetalleCarrito) => void;
    clearCarrito: () => void;
    totalPedido: number;
}

// Valor por defecto del contexto
const defaultContextValue: CartContextType = {
    cart: [],
    addCarrito: () => {},
    removeCarrito: () => {},
    removeItemCarrito: () => {},
    clearCarrito: () => {},
    totalPedido: 0
};

// Crear el contexto
export const CartContext = createContext<CartContextType>(defaultContextValue);

// Crear el provider del contexto
export const CarritoContextProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<DetalleCarrito[]>([]);
    const [totalPedido, setTotalPedido] = useState<number>(0);

    // Calcular el total del carrito incluyendo costos de envío
    const calcularTotalCarrito = useCallback(() => {
        const total = cart.reduce((sum, item) => {
            // Sumar el precio del producto * cantidad
            const subtotalProducto = (item.instrumento?.precio || 0) * item.cantidad;
            
            // Añadir costo de envío si existe y no es gratuito (G)
            let costoEnvio = 0;
            if (item.instrumento?.costoEnvio && item.instrumento.costoEnvio !== 'G') {
                costoEnvio = parseFloat(item.instrumento.costoEnvio);
            }
            
            return sum + subtotalProducto + costoEnvio;
        }, 0);
        
        setTotalPedido(total);
    }, [cart]);

    // Actualizar el total cuando el carrito cambia
    useEffect(() => {
        calcularTotalCarrito();
    }, [cart, calcularTotalCarrito]);

    // Añadir producto al carrito
    const addCarrito = (product: DetalleCarrito) => {
        setCart(prevCart => {
            const itemIndex = prevCart.findIndex(item => item.id === product.id);
            
            if (itemIndex >= 0) {
                // Si el producto ya existe, incrementar cantidad
                return prevCart.map((item, index) => 
                    index === itemIndex 
                        ? { ...item, cantidad: item.cantidad + 1 } 
                        : item
                );
            }
            
            // Si el producto no existe, añadirlo
            return [...prevCart, product];
        });
    };

    // Eliminar producto del carrito
    const removeCarrito = (product: DetalleCarrito) => {
        setCart(prevCart => prevCart.filter(item => item.id !== product.id));
    };

    // Disminuir cantidad de un producto
    const removeItemCarrito = (product: DetalleCarrito) => {
        setCart(prevCart => {
            const itemIndex = prevCart.findIndex(item => item.id === product.id);
            
            if (itemIndex >= 0) {
                const item = prevCart[itemIndex];
                
                // Si solo queda 1, eliminar el producto
                if (item.cantidad <= 1) {
                    return prevCart.filter(item => item.id !== product.id);
                }
                
                // Si hay más de 1, reducir la cantidad
                return prevCart.map((item, index) => 
                    index === itemIndex 
                        ? { ...item, cantidad: item.cantidad - 1 } 
                        : item
                );
            }
            
            return prevCart;
        });
    };

    // Vaciar el carrito
    const clearCarrito = () => setCart([]);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addCarrito, 
            removeCarrito, 
            removeItemCarrito, 
            clearCarrito,
            totalPedido
        }}>
            {children}
        </CartContext.Provider>
    );
};