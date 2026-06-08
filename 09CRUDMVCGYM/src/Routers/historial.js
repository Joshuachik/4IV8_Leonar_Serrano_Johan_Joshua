// ============================================================
// PROYECTO CRUD - GYM TRACKER: Rutas de Historial de Progreso


const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos de historial
// ============================================================

function validarHistorial(datos) {
    const errores = [];

    if (!datos.atleta_id || isNaN(parseInt(datos.atleta_id)) || parseInt(datos.atleta_id) <= 0) {
        errores.push('El ID del atleta es obligatorio y debe ser un número entero positivo');
    }

    if (!datos.rutina_id || isNaN(parseInt(datos.rutina_id)) || parseInt(datos.rutina_id) <= 0) {
        errores.push('El ID de la rutina es obligatorio y debe ser un número entero positivo');
    }

   
    if (datos.peso_maximo_lbs === undefined || isNaN(parseInt(datos.peso_maximo_lbs))) {
        errores.push('El peso máximo levantado es obligatorio y debe ser un número');
    } else {
        const peso = parseInt(datos.peso_maximo_lbs);
        if (peso < 1 || peso > 500) {
            errores.push('El peso máximo debe ser un valor realista entre 1 y 500 kg');
        }
    }

    if (!datos.fecha) {
        errores.push('La fecha del entrenamiento es obligatoria (AAAA-MM-DD)');
    } else {
        const fechaInput = new Date(datos.fecha);
        const hoy = new Date();
        fechaInput.setHours(0,0,0,0);
        hoy.setHours(0,0,0,0);

        if (fechaInput > hoy) {
            errores.push('No puedes registrar un entrenamiento con una fecha futura');
        }
    }

    return errores;
}
// ============================================================
// GET /api/historial — Listar todo el historial (Con INNER JOIN)
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [historial] = await db.execute(`
            SELECT h.id, h.atleta_id, a.nombre AS atleta_nombre, h.rutina_id, r.nombre_rutina, h.peso_maximo_lbs, DATE_FORMAT(h.fecha, '%Y-%m-%d') AS fecha
            FROM historial_progreso h
            INNER JOIN atletas a ON h.atleta_id = a.id
            INNER JOIN rutinas r ON h.rutina_id = r.id
            ORDER BY h.fecha DESC
        `);

        res.json({
            status: 'success',
            data: historial,
            count: historial.length
        });

    } catch (error) {
        console.error('Error al listar historial:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/historial/:id — Obtener un registro del historial
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [registro] = await db.execute(`
            SELECT id, atleta_id, rutina_id, peso_maximo_lbs, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha 
            FROM historial_progreso WHERE id = ?`,
            [id]
        );

        if (registro.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Registro de historial con ID ${id} no encontrado`
            });
        }

        res.json({ status: 'success', data: registro[0] });

    } catch (error) {
        console.error('Error al obtener registro de historial:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/historial — Crear nuevo registro
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarHistorial(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { atleta_id, rutina_id, peso_maximo_lbs, fecha } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO historial_progreso (atleta_id, rutina_id, peso_maximo_lbs, fecha) VALUES (?, ?, ?, ?)',
            [parseInt(atleta_id), parseInt(rutina_id), parseInt(peso_maximo_lbs), fecha]
        );

        const [nuevo] = await db.execute(`
            SELECT id, atleta_id, rutina_id, peso_maximo_lbs, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha 
            FROM historial_progreso WHERE id = ?`,
            [resultado.insertId]
        );

        res.status(201).json({ status: 'success', data: nuevo[0] });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            return res.status(400).json({
                status: 'error',
                message: 'Error de integridad: El Atleta ID o la Rutina ID proporcionados no existen en el sistema.'
            });
        }
        console.error('Error al crear historial:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/historial/:id — Actualizar registro
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.execute('SELECT id FROM historial_progreso WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Registro de historial con ID ${id} no encontrado`
            });
        }

        const errores = validarHistorial(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { atleta_id, rutina_id, peso_maximo_lbs, fecha } = req.body;

        await db.execute(
            'UPDATE historial_progreso SET atleta_id = ?, rutina_id = ?, peso_maximo_lbs = ?, fecha = ? WHERE id = ?',
            [parseInt(atleta_id), parseInt(rutina_id), parseInt(peso_maximo_lbs), fecha, id]
        );

        const [actualizado] = await db.execute(`
            SELECT id, atleta_id, rutina_id, peso_maximo_lbs, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha 
            FROM historial_progreso WHERE id = ?`,
            [id]
        );

        res.json({ status: 'success', data: actualizado[0] });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
            return res.status(400).json({
                status: 'error',
                message: 'Error de integridad: El Atleta ID o la Rutina ID no existen.'
            });
        }
        console.error('Error al actualizar historial:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/historial/:id — Eliminar registro
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [registro] = await db.execute(
            'SELECT id FROM historial_progreso WHERE id = ?', [id]
        );

        if (registro.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Registro con ID ${id} no encontrado`
            });
        }

        await db.execute('DELETE FROM historial_progreso WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                eliminado: registro[0],
                mensaje: `Registro de historial con ID ${id} eliminado correctamente`
            }
        });

    } catch (error) {
        console.error('Error al eliminar registro de historial:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;