// ============================================================
// PROYECTO CRUD - GYM TRACKER: Rutas de Rutinas


const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos de la rutina
// ============================================================

function validarRutina(datos) {
    const errores = [];

    // 1. Validar el Nombre de la Rutina (Permite letras, números, espacios y guiones cortos/largos)
    if (!datos.nombre_rutina || typeof datos.nombre_rutina !== 'string' || datos.nombre_rutina.trim().length < 3) {
        errores.push('El nombre de la rutina es obligatorio (mínimo 3 caracteres reales, Ej: Push Day 1)');
    } else {
        const regexRutina = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9\s\-_]+$/;
        if (!regexRutina.test(datos.nombre_rutina.trim())) {
            errores.push('El nombre de la rutina solo admite letras, números, espacios, guiones o guiones bajos');
        }
    }

    // 2. Validar la Descripción (Es opcional, pero si la ponen, que no exceda un límite sensato)
    if (datos.descripcion !== undefined && datos.descripcion !== null && datos.descripcion !== '') {
        if (typeof datos.descripcion !== 'string' || datos.descripcion.trim().length > 255) {
            errores.push('La descripción no puede superar los 255 caracteres');
        }
    }

    return errores;
}

// ============================================================
// GET /api/rutinas — Listar todas las rutinas
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [rutinas] = await db.execute(
            'SELECT id, nombre_rutina, descripcion FROM rutinas ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: rutinas,
            count: rutinas.length
        });

    } catch (error) {
        console.error('Error al listar rutinas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/rutinas/:id — Obtener una sola
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rutinas] = await db.execute(
            'SELECT id, nombre_rutina, descripcion FROM rutinas WHERE id = ?',
            [id]
        );

        if (rutinas.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Rutina con ID ${id} no encontrado`
            });
        }

        res.json({ status: 'success', data: rutinas[0] });

    } catch (error) {
        console.error('Error al obtener rutina:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/rutinas — Crear nueva rutina
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarRutina(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre_rutina, descripcion } = req.body;
        const desc = descripcion ? descripcion.trim() : null;

        const [resultado] = await db.execute(
            'INSERT INTO rutinas (nombre_rutina, descripcion) VALUES (?, ?)',
            [nombre_rutina.trim(), desc]
        );

        const [nueva] = await db.execute(
            'SELECT id, nombre_rutina, descripcion FROM rutinas WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json({ status: 'success', data: nueva[0] });

    } catch (error) {
        console.error('Error al crear rutina:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/rutinas/:id — Actualizar rutina
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.execute('SELECT id FROM rutinas WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Rutina con ID ${id} no encontrada`
            });
        }

        const errores = validarRutina(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre_rutina, descripcion } = req.body;
        const desc = descripcion ? descripcion.trim() : null;

        await db.execute(
            'UPDATE rutinas SET nombre_rutina = ?, descripcion = ? WHERE id = ?',
            [nombre_rutina.trim(), desc, id]
        );

        const [actualizada] = await db.execute(
            'SELECT id, nombre_rutina, descripcion FROM rutinas WHERE id = ?',
            [id]
        );

        res.json({ status: 'success', data: actualizada[0] });

    } catch (error) {
        console.error('Error al actualizar rutina:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/rutinas/:id — Eliminar rutina
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rutina] = await db.execute(
            'SELECT id, nombre_rutina FROM rutinas WHERE id = ?', [id]
        );

        if (rutina.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Rutina con ID ${id} no encontrada`
            });
        }

        await db.execute('DELETE FROM rutinas WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                eliminado: rutina[0],
                mensaje: `Rutina "${rutina[0].nombre_rutina}" eliminada correctamente`
            }
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar la rutina porque está vinculada a entrenamientos en el historial'
            });
        }
        console.error('Error al eliminar rutina:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;