import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://proyecto-modulo-1-back.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('Error de petición:', error.request);
        } else {
            // Algo sucedió en la configuración de la petición que causó el error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 