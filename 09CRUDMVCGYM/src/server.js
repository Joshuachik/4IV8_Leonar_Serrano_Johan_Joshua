const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// Servidor para inicializar con Express

const PORT = process.env.PORT || 3000;

// Middleware CORS para permitir peticiones externas
app.use(cors());

// Las peticiones las debemos atender en un formato JSON (clave-valor)
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Definimos la ruta estática para los archivos de la vista (HTML, CSS, JS del front)
app.use(express.static(path.join(__dirname, '..', 'public')));

// IMPORTACIÓN DE LOS 4 ROUTERS PARA EL GYM
const atletasRouter = require('./Routers/atletas');
const ejerciciosRouter = require('./Routers/ejercicios');
const rutinasRouter = require('./Routers/rutinas');
const historialRouter = require('./Routers/historial');

// MONTAJE DE LAS RUTAS
app.use('/api/atletas', atletasRouter);
app.use('/api/ejercicios', ejerciciosRouter);
app.use('/api/rutinas', rutinasRouter);
app.use('/api/historial', historialRouter);

// Documentación de los endpoints adaptados a las 4 secciones del Gym
app.get('/api', (req, res) => {
    res.json({
        status : 'success',
        message : 'GYM TRACKER API REST',
        endpoints : {
            atletas : {
                listar : 'GET /api/atletas',
                obtener : 'GET /api/atletas/:id',
                crear : 'POST /api/atletas',
                actualizar : 'PUT /api/atletas/:id',
                eliminar : 'DELETE /api/atletas/:id'
            },
            ejercicios : {
                listar : 'GET /api/ejercicios',
                obtener : 'GET /api/ejercicios/:id',
                crear : 'POST /api/ejercicios',
                actualizar : 'PUT /api/ejercicios/:id',
                eliminar : 'DELETE /api/ejercicios/:id'
            },
            rutinas : {
                listar : 'GET /api/rutinas',
                obtener : 'GET /api/rutinas/:id',
                crear : 'POST /api/rutinas',
                actualizar : 'PUT /api/rutinas/:id',
                eliminar : 'DELETE /api/rutinas/:id'
            },
            historial : {
                listar : 'GET /api/historial',
                obtener : 'GET /api/historial/:id',
                crear : 'POST /api/historial',
                actualizar : 'PUT /api/historial/:id',
                eliminar : 'DELETE /api/historial/:id'
            }
        }
    });
});

// Manejo de rutas inexistentes dentro de la API
app.use('/api/*path', (req, res) => {
    res.status(404).json({
        status : 'error',
        message : 'Ruta no encontrada dentro de la API'
    });
});

// Manejador global de errores no controlados
app.use((err, req, res, next) =>{
    console.error('Error no manejado: ', err.message);
    res.status(500).json({
        status : 'error',
        message : 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`);
});