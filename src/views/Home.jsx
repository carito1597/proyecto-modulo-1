import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí iría la lógica de cierre de sesión
        console.log('Logging out...');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Bienvenido a la Página Principal</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Cerrar Sesión
                </button>
            </header>
            <main style={styles.main}>
                <section style={styles.section}>
                    <h2>Contenido Principal</h2>
                    <p>Esta es la página de inicio de tu aplicación.</p>
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
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Home; 