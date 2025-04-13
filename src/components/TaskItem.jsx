import React from 'react';

const TaskItem = ({ task, onStatusChange, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pendiente':
                return '#ffc107';
            case 'en progreso':
                return '#17a2b8';
            case 'completada':
                return '#28a745';
            default:
                return '#6c757d';
        }
    };

    const canChangeStatus = (currentStatus, newStatus) => {
        if (currentStatus === 'pendiente' && newStatus === 'en progreso') return true;
        if (currentStatus === 'en progreso' && newStatus === 'completada') return true;
        return false;
    };

    const canEdit = task.status !== 'completada';
    const canDelete = task.status === 'completada';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.titleContainer}>
                    <h3 style={styles.title}>{task.title}</h3>
                    <span style={{
                        ...styles.status,
                        backgroundColor: getStatusColor(task.status)
                    }}>
                        {task.status}
                    </span>
                </div>
            </div>
            
            {task.description && (
                <p style={styles.description}>{task.description}</p>
            )}
            
            {task.dueDate && (
                <p style={styles.dueDate}>
                    Fecha límite: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}

            <div style={styles.actions}>
                {task.status === 'pendiente' && (
                    <button
                        onClick={() => onStatusChange(task.id, 'en progreso')}
                        style={styles.button}
                    >
                        Marcar en progreso
                    </button>
                )}
                
                {task.status === 'en progreso' && (
                    <button
                        onClick={() => onStatusChange(task.id, 'completada')}
                        style={styles.button}
                    >
                        Marcar completada
                    </button>
                )}

                {canEdit && (
                    <button
                        onClick={() => onEdit(task)}
                        style={{...styles.button, backgroundColor: '#ffc107'}}
                    >
                        Editar
                    </button>
                )}

                {canDelete && (
                    <button
                        onClick={() => onDelete(task.id)}
                        style={{...styles.button, backgroundColor: '#dc3545'}}
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '@media (max-width: 480px)': {
            padding: '12px',
        },
    },
    header: {
        marginBottom: '15px',
        '@media (max-width: 768px)': {
            marginBottom: '12px',
        },
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        '@media (max-width: 480px)': {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        '@media (max-width: 480px)': {
            fontSize: '16px',
        },
    },
    status: {
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '14px',
        textTransform: 'capitalize',
        fontWeight: '500',
        '@media (max-width: 480px)': {
            fontSize: '12px',
            padding: '3px 6px',
        },
    },
    description: {
        margin: '12px 0',
        color: '#6c757d',
        fontSize: '16px',
        lineHeight: '1.5',
        '@media (max-width: 480px)': {
            fontSize: '14px',
            margin: '10px 0',
        },
    },
    dueDate: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '10px 0',
        '@media (max-width: 480px)': {
            fontSize: '13px',
            margin: '8px 0',
        },
    },
    actions: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px',
        flexWrap: 'wrap',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '8px',
        },
    },
    button: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        flex: '1',
        minWidth: 'fit-content',
        '@media (max-width: 768px)': {
            width: '100%',
            padding: '10px',
        },
        '@media (max-width: 480px)': {
            fontSize: '13px',
        },
    },
};

export default TaskItem; 