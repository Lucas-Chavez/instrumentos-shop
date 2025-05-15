import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { login } from '../../../api/api';
import { Rol } from '../../../types/Rol';
import LoadingFallback from '../Loading/LoadingFallback';


function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validación básica
        if (!formData.username || !formData.password) {
            setError('Por favor, complete todos los campos');
            setLoading(false);
            return;
        }
        try {
            const usuarioAutenticado = await login(formData.username, formData.password);

            const usuarioParaAlmacenar = {
                ...usuarioAutenticado,
                clave: ''
            };

            localStorage.setItem('usuario', JSON.stringify(usuarioParaAlmacenar));
            localStorage.setItem('isAuthenticated', 'true');

            let userRol: Rol | undefined = usuarioAutenticado.rol;

            setTimeout(() => {
                if (userRol === Rol.ADMIN) {
                    navigate('/AdminPage', { 
                        replace: true,
                        state: { 
                            logged: true,
                            usuario: usuarioParaAlmacenar
                        }
                    });
                } else if (userRol === Rol.OPERADOR || userRol === Rol.VISOR) {
                    navigate('/ClientPage', { 
                        replace: true,
                        state: { 
                            logged: true,
                            usuario: usuarioParaAlmacenar
                        }
                    });
                } else {
                    setError('Rol de usuario no reconocido');
                }
                setLoading(false);
            }, 1000); // 1000 ms = 1 segundo
        } catch (err: any) {
            setError('Usuario o contraseña incorrectos');
            console.error("Error de autenticación:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const usuario = localStorage.getItem('usuario');
        if (isAuthenticated && usuario) {
            localStorage.removeItem('usuario');
            localStorage.removeItem('isAuthenticated');
        }
    }, []);

    return (
        <div className={styles.loginContainer}>
            {loading ? (
                <LoadingFallback />
            ) : (
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        Iniciar Sesión
                    </div>
                    <div className={styles.loginBody}>
                        {error && <div className={styles.loginError}>{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Usuario</label>
                                <input
                                    type="text"
                                    className={styles.formControl}
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Ingrese su nombre de usuario"
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Contraseña</label>
                                <input
                                    type="password"
                                    className={styles.formControl}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingrese su contraseña"
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button 
                                    type="submit" 
                                    className={styles.btnLogin}
                                    disabled={loading}
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;