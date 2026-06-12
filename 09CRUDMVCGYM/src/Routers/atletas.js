
// PROYECTO CRUD - GYM TRACKER: Rutas de Atletas (Usuarios)


const express = require('express');
const router = express.Router();
const db = require('../DB/database');


// FUNCIÓN: Validar datos del atleta

function validarAtleta(datos) {
    const errores = [];

    // 1. Validación estricta del Nombre (No vacío, mínimo 3 caracteres y SOLO letras/espacios)
    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 3) {
        errores.push('El nombre del atleta es obligatorio (mínimo 3 caracteres reales)');
    } else {
        const regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        if (!regexNombre.test(datos.nombre.trim())) {
            errores.push('El nombre del atleta solo debe contener letras y espacios (sin números ni caracteres especiales)');
        }
    }

    // 2. Validación de la Edad (Obligatoria y en un rango lógico coherente)
    if (datos.edad !== undefined && datos.edad !== null && datos.edad !== '') {
        const edad = parseInt(datos.edad);
        if (isNaN(edad) || edad < 14 || edad > 90) {
            errores.push('La edad debe ser un número entero válido entre 14 y 90 años');
        }
    } else {
        errores.push('La edad es obligatoria');
    }

    // 3. Validación del Correo Electrónico (Estructura estándar de email)
    if (!datos.email || typeof datos.email !== 'string') {
        errores.push('El correo electrónico es obligatorio');
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(datos.email.trim())) {
            errores.push('Debe proporcionar un formato de correo electrónico válido (ejemplo@dominio.com)');
        }
    }

    return errores;
}

// GET /api/atletas — Listar todos los atletas

router.get('/', async (req, res) => {
    try {
        const [atletas] = await db.execute(
            'SELECT id, nombre, edad, email FROM atletas ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: atletas,
            count: atletas.length
        });

    } catch (error) {
        console.error('Error al listar atletas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// GET /api/atletas/:id — Obtener uno solo

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [atletas] = await db.execute(
            'SELECT id, nombre, edad, email FROM atletas WHERE id = ?',
            [id]
        );

        if (atletas.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Atleta con ID ${id} no encontrado`
            });
        }

        res.json({ status: 'success', data: atletas[0] });

    } catch (error) {
        console.error('Error al obtener atleta:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// POST /api/atletas — Crear nuevo atleta

router.post('/', async (req, res) => {
    try {
        const errores = validarAtleta(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, edad, email } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO atletas (nombre, edad, email) VALUES (?, ?, ?)',
            [nombre.trim(), parseInt(edad), email.trim()]
        );

        const [nuevo] = await db.execute(
            'SELECT id, nombre, edad, email FROM atletas WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json({ status: 'success', data: nuevo[0] });

    } catch (error) {
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'error', message: 'El correo electrónico ya está registrado' });
        }
        console.error('Error al crear atleta:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// PUT /api/atletas/:id — Actualizar atleta

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.execute('SELECT id FROM atletas WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Atleta con ID ${id} no encontrado`
            });
        }

        const errores = validarAtleta(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, edad, email } = req.body;

        await db.execute(
            'UPDATE atletas SET nombre = ?, edad = ?, email = ? WHERE id = ?',
            [nombre.trim(), parseInt(edad), email.trim(), id]
        );

        const [actualizado] = await db.execute(
            'SELECT id, nombre, edad, email FROM atletas WHERE id = ?',
            [id]
        );

        res.json({ status: 'success', data: actualizado[0] });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'error', message: 'El correo electrónico ya está en uso por otro atleta' });
        }
        console.error('Error al actualizar atleta:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// DELETE /api/atletas/:id — Eliminar atleta

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [atleta] = await db.execute(
            'SELECT id, nombre FROM atletas WHERE id = ?', [id]
        );

        if (atleta.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Atleta con ID ${id} no encontrado`
            });
        }

        await db.execute('DELETE FROM atletas WHERE id = ?', [id]);

        res.json({
            status: 'success',
            data: {
                eliminado: atleta[0],
                mensaje: `Atleta "${atleta[0].nombre}" eliminado correctamente`
            }
        });

    } catch (error) {
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({
                status: 'error',
                message: 'No se puede eliminar al atleta porque tiene entrenamientos registrados en el historial'
            });
        }
        console.error('Error al eliminar atleta:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;