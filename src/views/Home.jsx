import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Configurar el token para la petición
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Obtener datos del usuario
                const response = await axiosInstance.get('/api/auth/me');
                setUserData(response.data);
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Error al obtener datos del usuario';
                setError(errorMessage);
                if (err.response?.status === 401) {
                    // Si el token es inválido o ha expirado, redirigir al login
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!userData) {
        return <div style={styles.loading}>Cargando...</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Bienvenido, {userData.name}</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Cerrar Sesión
                </button>
            </header>
            <main style={styles.main}>
                <section style={styles.section}>
                    <h2>Tu Perfil</h2>
                    <div style={styles.profileInfo}>
                        <p><strong>Nombre:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    main: {
        flex: 1,
        padding: '20px',
    },
    section: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    profileInfo: {
        marginTop: '20px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: '#dc3545',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        margin: '20px',
        borderRadius: '4px',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        color: '#6c757d',
    }
};

export default Home; 