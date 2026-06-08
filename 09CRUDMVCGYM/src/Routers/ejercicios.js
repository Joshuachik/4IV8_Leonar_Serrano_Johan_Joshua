// ============================================================
// PROYECTO CRUD - GYM TRACKER: Rutas de Ejercicios
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos del ejercicio
// ============================================================

function validarEjercicio(datos) {
    const errores = [];

    // 1. Validación del Nombre (Mínimo 2 letras, permite números básicos como "Press 30°" 
    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.push('El nombre del ejercicio es obligatorio (mínimo 2 caracteres reales)');
    } else {
        // Permite letras, números básicos, espacios y símbolos de grados comunes en gym
        const regexNombreEj = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9°\s]+$/;
        if (!regexNombreEj.test(datos.nombre.trim())) {
            errores.push('El nombre del ejercicio contiene caracteres no válidos');
        }
    }

    // 2. Validación del Músculo Principal (Solo letras y espacios, mínimo 3 caracteres)
    if (!datos.musculo_principal || typeof datos.musculo_principal !== 'string' || datos.musculo_principal.trim().length < 3) {
        errores.push('El músculo principal es obligatorio (mínimo 3 caracteres)');
    } else {
        // Un músculo solo lleva letras y espacios (ej: "Pecho", "Deltoides Posterior")
        const regexMusculo = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        if (!regexMusculo.test(datos.musculo_principal.trim())) {
            errores.push('El músculo principal solo debe contener letras y espacios');
        }
    }

    return errores;
}

// ============================================================
// GET /api/ejercicios — Listar todos los ejercicios
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [ejercicios] = await db.execute(
            'SELECT id, nombre, musculo_principal FROM ejercicios ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: ejercicios,
            count: ejercicios.length
        });

    } catch (error) {
        console.error('Error al listar ejercicios:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/ejercicios/:id — Obtener uno solo
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [ejercicios] = await db.execute(
            'SELECT id, nombre, musculo_principal FROM ejercicios WHERE id = ?',
            [id]
        );

        if (ejercicios.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Ejercicio con ID ${id} no encontrado`
            });
        }

        res.json({ status: 'success', data: ejercicios[0] });

    } catch (error) {
        console.error('Error al obtener ejercicio:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/ejercicios — Crear nuevo ejercicio
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarEjercicio(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, musculo_principal } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO ejercicios (nombre, musculo_principal) VALUES (?, ?)',
            [nombre.trim(), musculo_principal.trim()]
        );

        const [nuevo] = await db.execute(
            'SELECT id, nombre, musculo_principal FROM ejercicios WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json({ status: 'success', data: nuevo[0] });

    } catch (error) {
        console.error('Error al crear ejercicio:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/ejercicios/:id — Actualizar ejercicio
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.execute('SELECT id FROM ejercicios WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Ejercicio con ID ${id} no encontrado`
            });
        }

        const errores = validarEjercicio(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, musculo_principal } = req.body;

        await db.execute(
            'UPDATE ejercicios SET nombre = ?, musculo_principal = ? WHERE id = ?',
            [nombre.trim(), musculo_principal.trim(), id]
        );

        const [actualizado] = await db.execute(
            'SELECT id, nombre, musculo_principal FROM ejercicios WHERE id = ?',
            [id]
        );

        res.json({ status: 'success', data: actualizado[0] });

    } catch (error) {
        console.error('Error al actualizar ejercicio:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/ejercicios/:id — Eliminar ejercicio
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [ejercicio] = await db.execute(
            'SELECT id, nombre FROM ejercicios WHERE id = ?', [id]
        );

        if (ejercicio.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Ejercicio con ID ${id} no encontrado`
            });
        }

        await db.execute('DELETE FROM ejercicios WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                eliminado: ejercicio[0],
                mensaje: `Ejercicio "${ejercicio[0].nombre}" eliminado correctamente`
            }
        });

    } catch (error) {
        // Por si intentan borrar un ejercicio que ya está en el historial
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar este ejercicio porque está registrado en rutinas o historiales activos'
            });
        }
        console.error('Error al eliminar ejercicio:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;