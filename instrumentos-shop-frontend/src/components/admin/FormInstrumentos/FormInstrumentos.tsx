import React, { useState, useEffect } from 'react';
import type { Instrumento, Categoria } from '../../../types/types';
import { createInstrumento, updateInstrumento } from '../../../api/api';
import './formInstrumentos.css';

interface Props {
    instrumento: Instrumento | null;
    categorias: Categoria[];
    onSubmit: () => void;
    onCancel: () => void;
}

const defaultInstrumento: Omit<Instrumento, 'id'> = {
    instrumento: '',
    marca: '',
    modelo: '',
    imagen: '',
    precio: 0,
    costoEnvio: '',
    cantidadVendida: 0,
    descripcion: '',
    idCategoria: 0
};

const FormInstrumentos: React.FC<Props> = ({ instrumento, categorias, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<any>(defaultInstrumento);

    useEffect(() => {
        if (instrumento) {
            setFormData(instrumento);
        } else {
            setFormData({
                ...defaultInstrumento,
                idCategoria: categorias.length > 0 ? categorias[0].id : 0
            });
        }
    }, [instrumento, categorias]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === 'precio' || name === 'cantidadVendida' ? Number(value) :
                name === 'idCategoria' ? Number(value) : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (instrumento) {
                await updateInstrumento(instrumento.id, formData);
            } else {
                await createInstrumento(formData);
            }
            onSubmit();
        } catch (error) {
            console.error('Error al guardar instrumento', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                {instrumento ? 'Editar Instrumento' : 'Agregar Instrumento'}
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nombre del Instrumento</label>
                            <input
                                type="text"
                                className="form-control"
                                name="instrumento"
                                value={formData.instrumento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Marca</label>
                            <input
                                type="text"
                                className="form-control"
                                name="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Modelo</label>
                            <input
                                type="text"
                                className="form-control"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Categoría</label>
                            <select
                                className="form-control"
                                name="idCategoria"
                                value={formData.idCategoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.denominacion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Costo de Envío</label>
                            <input
                                type="text"
                                className="form-control"
                                name="costoEnvio"
                                value={formData.costoEnvio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Cantidad Vendida</label>
                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                name="cantidadVendida"
                                value={formData.cantidadVendida}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">URL de Imagen</label>
                        <input
                            type="text"
                            className="form-control"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormInstrumentos;