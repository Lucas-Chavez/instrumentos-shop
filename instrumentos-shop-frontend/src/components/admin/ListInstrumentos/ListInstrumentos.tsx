import React, { useState, useEffect } from 'react';
import type { Instrumento, Categoria } from '../../../types/types';
import { getInstrumentos, getInstrumentosByCategoria, getCategorias, deleteInstrumento } from '../../../api/api';
import FormInstrumentos from '../FormInstrumentos/FormInstrumentos';
import './listInstrumentos.css';

const ListInstrumento: React.FC = () => {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInstrumento, setCurrentInstrumento] = useState<Instrumento | null>(null);

    const loadInstrumentos = async () => {
        try {
            let data: Instrumento[];
            if (categoriaSeleccionada) {
                data = await getInstrumentosByCategoria(categoriaSeleccionada);
            } else {
                data = await getInstrumentos();
            }
            setInstrumentos(data);
        } catch (error) {
            console.error('Error al cargar instrumentos', error);
        }
    };

    const loadCategorias = async () => {
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías', error);
        }
    };

    useEffect(() => {
        loadCategorias();
        loadInstrumentos();
    }, []);

    useEffect(() => {
        loadInstrumentos();
    }, [categoriaSeleccionada]);

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCategoriaSeleccionada(value ? Number(value) : null);
    };

    const handleEdit = (instrumento: Instrumento) => {
        setCurrentInstrumento(instrumento);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este instrumento?')) {
            try {
                await deleteInstrumento(id);
                loadInstrumentos();
            } catch (error) {
                console.error('Error al eliminar instrumento', error);
            }
        }
    };

    const handleFormSubmit = () => {
        setIsEditing(false);
        setCurrentInstrumento(null);
        loadInstrumentos();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentInstrumento(null);
    };

    return (
        <div className="container">

            <div className="vertical-layout mb-4">
                <h1>Administración de Instrumentos</h1>
                
                <div className="filter-section">
                    <div className="form-group">
                        <label>Filtrar por Categoría</label>
                        <select
                            className="form-control"
                            value={categoriaSeleccionada || ''}
                            onChange={handleCategoriaChange}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.denominacion}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="button-section">
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Nuevo Instrumento
                    </button>
                </div>
            </div>

            {isEditing ? (
                <FormInstrumentos
                    instrumento={currentInstrumento}
                    categorias={categorias}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Instrumento</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Precio</th>
                            <th>Costo Envío</th>
                            <th>Vendidos</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {instrumentos.map(instrumento => (
                            <tr key={instrumento.id}>
                                <td>{instrumento.instrumento}</td>
                                <td>{instrumento.marca}</td>
                                <td>{instrumento.modelo}</td>
                                <td>${instrumento.precio.toFixed(2)}</td>
                                <td>{instrumento.costoEnvio}</td>
                                <td>{instrumento.cantidadVendida}</td>
                                <td>{instrumento.categoria?.denominacion}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info me-2"
                                        onClick={() => handleEdit(instrumento)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(instrumento.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListInstrumento;