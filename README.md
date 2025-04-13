# Aplicación de Gestión de Tareas

## Enlaces de la Aplicación
- Aplicación Web: [https://proyecto-modulo-1-pi.vercel.app/](https://proyecto-modulo-1-pi.vercel.app/)
- API Backend: [https://proyecto-modulo-1-back.onrender.com](https://proyecto-modulo-1-back.onrender.com)

## Descripción
Aplicación web para gestionar tareas personales. Permite crear una cuenta, iniciar sesión y administrar tus tareas diarias de forma sencilla.

## Pantallas de la Aplicación

### 1. Registro
En esta pantalla puedes crear tu cuenta con:
- Nombre
- Correo electrónico
- Contraseña
- Confirmación de contraseña

### 2. Inicio de Sesión
Aquí puedes acceder a tu cuenta usando:
- Correo electrónico
- Contraseña

### 3. Página Principal
En esta pantalla puedes:
- Ver todas tus tareas
- Crear nuevas tareas
- Editar tareas existentes
- Eliminar tareas
- Marcar tareas como completadas
- Filtrar tareas por estado
- Buscar tareas por título

## Tecnologías Utilizadas
- React
- React Router
- Axios
- JWT para autenticación

## Desarrollo Local

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## Build
To create a production build:
```bash
npm run build
```

## Environment Variables
The application uses the following environment variable:
- `REACT_APP_API_URL`: Backend API URL (optional, defaults to the deployed backend URL)
