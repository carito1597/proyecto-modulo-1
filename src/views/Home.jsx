import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Cargar datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axiosInstance.get('/api/auth/me');
                setUserData(response.data);
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Error al obtener datos del usuario';
                setError(errorMessage);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const fetchTasks = async (status = '', search = '') => {
        try {
            let url = '/api/tasks';
            const params = new URLSearchParams();
            
            if (status) {
                params.append('status', status);
            }
            if (search) {
                params.append('search', search);
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await axiosInstance.get(url);
            setTasks(response.data);
        } catch (err) {
            setError('Error al cargar las tareas');
        }
    };

    // Cargar tareas iniciales
    useEffect(() => {
        fetchTasks();
    }, []);

    // Manejar cambio de filtro por estado
    const handleFilterChange = async (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        await fetchTasks(newFilter, searchTerm);
    };

    // Manejar búsqueda
    const handleSearch = async () => {
        await fetchTasks(filter, searchTerm);
    };

    const handleCreateTask = async (taskData) => {
        try {
            const response = await axiosInstance.post('/api/tasks', {
                ...taskData,
                status: 'pendiente'
            });
            setTasks(prev => [...prev, response.data]);
            setShowForm(false);
            // Recargar las tareas para mantener los filtros actuales
            await fetchTasks(filter, searchTerm);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la tarea');
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            const response = await axiosInstance.put(`/api/tasks/${editingTask.id}`, taskData);
            setTasks(prev => prev.map(task => 
                task.id === editingTask.id ? response.data : task
            ));
            setEditingTask(null);
            // Recargar las tareas para mantener los filtros actuales
            await fetchTasks(filter, searchTerm);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar la tarea');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            let response;
            if (newStatus === 'completada') {
                response = await axiosInstance.put(`/api/tasks/${taskId}/complete`);
            } else {
                response = await axiosInstance.put(`/api/tasks/${taskId}`, {
                    status: newStatus
                });
            }
            setTasks(prev => prev.map(task => 
                task.id === taskId ? response.data : task
            ));
            // Recargar las tareas para mantener los filtros actuales
            await fetchTasks(filter, searchTerm);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el estado de la tarea');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axiosInstance.delete(`/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task.id !== taskId));
            // Recargar las tareas para mantener los filtros actuales
            await fetchTasks(filter, searchTerm);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la tarea');
        }
    };

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
                <div style={styles.controls}>
                    <div style={styles.searchAndFilter}>
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Buscar tareas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <button 
                                onClick={handleSearch}
                                style={styles.searchButton}
                            >
                                Buscar
                            </button>
                        </div>
                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            style={styles.select}
                        >
                            <option value="">Todas</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="en progreso">En Progreso</option>
                            <option value="completada">Completadas</option>
                        </select>
                    </div>
                    {!showForm && !editingTask && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={styles.addButton}
                        >
                            Nueva Tarea
                        </button>
                    )}
                </div>

                {(showForm || editingTask) && (
                    <div style={styles.formContainer}>
                        <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                        <TaskForm
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            initialData={editingTask}
                        />
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingTask(null);
                            }}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                    </div>
                )}

                <div style={styles.taskList}>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onEdit={setEditingTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <p style={styles.noTasks}>No hay tareas que mostrar</p>
                    )}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'center',
            padding: '10px',
        },
    },
    main: {
        flex: 1,
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        '@media (max-width: 1240px)': {
            padding: '15px',
        },
        '@media (max-width: 480px)': {
            padding: '10px',
        },
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
        },
    },
    searchAndFilter: {
        display: 'flex',
        gap: '10px',
        flex: 1,
        maxWidth: '600px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            maxWidth: '100%',
        },
    },
    searchContainer: {
        display: 'flex',
        gap: '10px',
        flex: 1,
        '@media (max-width: 480px)': {
            flexDirection: 'column',
        },
    },
    searchInput: {
        flex: 1,
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        minWidth: 0,
        '@media (max-width: 480px)': {
            width: '100%',
            boxSizing: 'border-box',
        },
    },
    searchButton: {
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        '@media (max-width: 480px)': {
            width: '100%',
        },
    },
    select: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        '@media (max-width: 768px)': {
            width: '100%',
        },
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            width: '100%',
        },
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '@media (max-width: 480px)': {
            padding: '15px',
        },
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        '@media (max-width: 768px)': {
            width: '100%',
        },
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    noTasks: {
        textAlign: 'center',
        color: '#6c757d',
        padding: '20px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        '@media (max-width: 768px)': {
            width: '100%',
            maxWidth: '200px',
        },
    },
    error: {
        color: '#dc3545',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        margin: '20px',
        borderRadius: '4px',
        '@media (max-width: 480px)': {
            margin: '10px',
            padding: '15px',
        },
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        color: '#6c757d',
    }
};

export default Home; 