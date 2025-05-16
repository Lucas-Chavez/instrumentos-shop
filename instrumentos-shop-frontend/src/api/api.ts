import type { Categoria, Instrumento, Pedido, Usuario } from '../types/types';

const API_URL = 'http://localhost:8080/api';

// Funciones para obtener categorías
export const getCategorias = async (): Promise<Categoria[]> => {
    const response = await fetch(`${API_URL}/categorias`);
    return await response.json();
};

// Funciones para gestionar instrumentos
export const getInstrumentos = async (): Promise<Instrumento[]> => {
    const response = await fetch(`${API_URL}/instrumentos`);
    return await response.json();
};

export const getInstrumentoById = async (id: number): Promise<Instrumento> => {
    const response = await fetch(`${API_URL}/instrumentos/${id}`);
    if (!response.ok) {
        throw new Error(`Instrumento con id ${id} no encontrado`);
    }
    return await response.json();
};

export const getInstrumentosByCategoria = async (idCategoria: number): Promise<Instrumento[]> => {
    const response = await fetch(`${API_URL}/instrumentos/categoria/${idCategoria}`);
    return await response.json();
};

export const createInstrumento = async (instrumento: Omit<Instrumento, 'id'>): Promise<Instrumento> => {
    const response = await fetch(`${API_URL}/instrumentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instrumento)
    });
    return await response.json();
};

export const updateInstrumento = async (id: number, instrumento: Omit<Instrumento, 'id'>): Promise<Instrumento> => {
    const response = await fetch(`${API_URL}/instrumentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instrumento)
    });
    return await response.json();
};

export const deleteInstrumento = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/instrumentos/${id}`, {
        method: 'DELETE'
    });
};

export const createPedido = async (pedido: Omit<Pedido, 'id'>): Promise<Pedido> => {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    });
    return await response.json();
};

export const login = async (username: string, password: string): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nombreUsuario: username, 
            clave: password 
        })
    });
    
    if (!response.ok) {
        throw new Error('Credenciales inválidas');
    }
    
    return await response.json();
};
