import React, { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = null }) => {
    const [task, setTask] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task);
        if (!initialData) {
            setTask({ title: '', description: '', dueDate: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label htmlFor="title" style={styles.label}>Título *</label>
                <input
                    type="text"
                    id="title"
                    value={task.title}
                    onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.label}>Descripción (opcional)</label>
                <textarea
                    id="description"
                    value={task.description}
                    onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                    style={styles.textarea}
                />
            </div>
            <div style={styles.formGroup}>
                <label htmlFor="dueDate" style={styles.label}>Fecha límite (opcional)</label>
                <input
                    type="date"
                    id="dueDate"
                    value={task.dueDate}
                    onChange={(e) => setTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    style={styles.input}
                />
            </div>
            <button type="submit" style={styles.button}>
                {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
            </button>
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        '@media (max-width: 768px)': {
            maxWidth: '100%',
        },
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '16px',
        color: '#333',
        fontWeight: '500',
    },
    input: {
        padding: '10px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
        '@media (max-width: 480px)': {
            fontSize: '14px',
            padding: '8px 10px',
        },
    },
    textarea: {
        padding: '10px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        width: '100%',
        minHeight: '100px',
        resize: 'vertical',
        boxSizing: 'border-box',
        '@media (max-width: 480px)': {
            fontSize: '14px',
            padding: '8px 10px',
            minHeight: '80px',
        },
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        width: '100%',
        '@media (max-width: 480px)': {
            padding: '10px 16px',
            fontSize: '14px',
        },
    },
};

export default TaskForm; 