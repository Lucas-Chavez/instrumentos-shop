import type { Rol } from "./Rol";

export interface Categoria {
    id: number;
    denominacion: string;
}

export interface Instrumento {
    id: number;
    instrumento: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: number;
    costoEnvio: string;
    cantidadVendida: number;
    descripcion: string;
    idCategoria: number;
    categoria?: Categoria;
}

export interface Pedido {
    id: number;
    fechaPedido: string;
    totalPedido: number;
    pedidoDetalles: PedidoDetalle[];
}

export interface PedidoDetalle {
    id: number;
    cantidad: number;
    instrumento: Instrumento;
}

export interface Usuario {
    id: number; 
    nombre: string;
    clave: string;
    rol: Rol;
}




