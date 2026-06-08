// ============================================================
// GYM TRACKER - CONTROLADOR FRONTEND INTERACTIVO (app.js)
// Conexión total con los 4 endpoints de la API en Node.js
// ============================================================

const API_URL = 'http://localhost:3000/api';

// Estado global para controlar qué ID estamos editando
let editandoAtletaId = null;
let editandoEjercicioId = null;
let editandoRutinaId = null;
let editandoHistorialId = null;

// Inicializar la aplicación cuando cargue el navegador
document.addEventListener('DOMContentLoaded', () => {
    // Cargar los datos de la pestaña inicial (Atletas)
    cargarAtletas();

    // Configurar los manejadores de los formularios
    document.getElementById('form-atleta').addEventListener('submit', guardarAtleta);
    document.getElementById('form-ejercicio').addEventListener('submit', guardarEjercicio);
    document.getElementById('form-rutina').addEventListener('submit', guardarRutina);
    document.getElementById('form-historial').addEventListener('submit', guardarHistorial);
});

// ============================================================
// CONTROL DE PESTAÑAS (TABS)
// ============================================================
function switchTab(tabName) {
    // Quitar clase activa a todos los botones y contenidos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activar la pestaña seleccionada
    const btnActivo = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.textContent.toLowerCase().includes(tabName.substring(0,4)));
    if (btnActivo) btnActivo.classList.add('active');
    
    const contenedorActivo = document.getElementById(`section-${tabName}`);
    if (contenedorActivo) contenedorActivo.classList.add('active');

    // Cargar datos específicos al cambiar de sección
    if (tabName === 'atletas') cargarAtletas();
    if (tabName === 'ejercicios') cargarEjercicios();
    if (tabName === 'rutinas') cargarRutinas();
    if (tabName === 'historial') {
        cargarHistorial();
        actualizarSelectsHistorial(); // Rellenar los dropdowns dinámicos
    }
}

// ============================================================
// SECCIÓN: ATLETAS (CRUD)
// ============================================================
async function cargarAtletas() {
    try {
        const res = await fetch(`${API_URL}/atletas`);
        const json = await res.json();
        const tbody = document.getElementById('tabla-atletas-body');
        tbody.innerHTML = '';

        if (json.status === 'success') {
            json.data.forEach(atleta => {
                tbody.innerHTML += `
                    <tr>
                        <td>${atleta.id}</td>
                        <td>${atleta.nombre}</td>
                        <td>${atleta.edad}</td>
                        <td>${atleta.email}</td>
                        <td>
                            <div class="actions-btns">
                                <button class="action-btn btn-edit" onclick="prepararEditarAtleta(${atleta.id}, '${atleta.nombre}', ${atleta.edad}, '${atleta.email}')">Editar</button>
                                <button class="action-btn btn-delete" onclick="eliminarAtleta(${atleta.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (err) { console.error('Error al cargar atletas:', err); }
}

async function guardarAtleta(e) {
    e.preventDefault();
    const nombre = document.getElementById('atleta-nombre').value.trim();
    const edad = document.getElementById('atleta-edad').value.trim();
    const email = document.getElementById('atleta-email').value.trim();

    //  candado Validar Nombre (Mínimo 3 letras, sin números)
    const regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    if (nombre.length < 3 || !regexNombre.test(nombre)) {
        alert('Error: El nombre debe tener al menos 3 caracteres y contener solo letras y espacios.');
        return;
    }

    // 🛑 CANDADO: Validar Edad (Rango lógico)
    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 14 || edadNum > 90) {
        alert('Error: La edad debe ser un número entero válido entre 14 y 90 años.');
        return;
    }

    // CANDADO: Validar Correo Electrónico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Error: Por favor, introduce un correo electrónico válido (ejemplo@dominio.com).');
        return;
    }

    const datos = { nombre, edad, email };
    const URL = editandoAtletaId ? `${API_URL}/atletas/${editandoAtletaId}` : `${API_URL}/atletas`;
    const método = editandoAtletaId ? 'PUT' : 'POST';

    try {
        const res = await fetch(URL, {
            method: método,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const json = await res.json();

        if (json.status === 'success') {
            alert(editandoAtletaId ? 'Atleta actualizado con éxito' : 'Atleta registrado con éxito');
            resetFormAtleta();
            cargarAtletas();
        } else {
            alert('Error del servidor: ' + json.message);
        }
    } catch (err) { alert('Error en el servidor al guardar atleta'); }
}

function prepararEditarAtleta(id, nombre, edad, email) {
    editandoAtletaId = id;
    document.getElementById('form-title-atleta').textContent = 'Modificar Atleta';
    document.getElementById('atleta-nombre').value = nombre;
    document.getElementById('atleta-edad').value = edad;
    document.getElementById('atleta-email').value = email;
    document.getElementById('btn-cancel-atleta').style.display = 'block';
    document.getElementById('btn-submit-atleta').textContent = 'Actualizar Datos';
}

function resetFormAtleta() {
    editandoAtletaId = null;
    document.getElementById('form-atleta').reset();
    document.getElementById('form-title-atleta').textContent = 'Registrar Atleta';
    document.getElementById('btn-cancel-atleta').style.display = 'none';
    document.getElementById('btn-submit-atleta').textContent = 'Guardar Atleta';
}

async function eliminarAtleta(id) {
    if (!confirm('¿Estás seguro de eliminar este atleta?')) return;
    try {
        const res = await fetch(`${API_URL}/atletas/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.status === 'success') {
            alert(json.data.mensaje);
            cargarAtletas();
        } else {
            alert('Error: ' + json.message);
        }
    } catch (err) { alert('Error de conexión al eliminar'); }
}

// ============================================================
// SECCIÓN: EJERCICIOS (CRUD)
// ============================================================
async function cargarEjercicios() {
    try {
        const res = await fetch(`${API_URL}/ejercicios`);
        const json = await res.json();
        const tbody = document.getElementById('tabla-ejercicios-body');
        tbody.innerHTML = '';

        if (json.status === 'success') {
            json.data.forEach(ej => {
                tbody.innerHTML += `
                    <tr>
                        <td>${ej.id}</td>
                        <td>${ej.nombre}</td>
                        <td>${ej.musculo_principal}</td>
                        <td>
                            <div class="actions-btns">
                                <button class="action-btn btn-edit" onclick="prepararEditarEjercicio(${ej.id}, '${ej.nombre}', '${ej.musculo_principal}')">Editar</button>
                                <button class="action-btn btn-delete" onclick="eliminarEjercicio(${ej.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (err) { console.error(err); }
}

async function guardarEjercicio(e) {
    e.preventDefault();
    const nombre = document.getElementById('ejercicio-nombre').value.trim();
    const musculo_principal = document.getElementById('ejercicio-musculo').value.trim();

    // CANDADO: Validar Nombre (Mínimo 2 letras, permite cosas como "Press 30°" pero NO puros números)
    const regexNombreEj = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9°\s]+$/;
    // Evita que pongan puros números sueltos (como "777") usando una validación extra
    const contieneLetras = /[A-Za-zÑñÁáÉéÍíÓóÚúÜü]/.test(nombre);

    if (nombre.length < 2 || !regexNombreEj.test(nombre) || !contieneLetras) {
        alert('Error: El nombre del ejercicio debe tener al menos 2 caracteres y contener letras.');
        return;
    }

    // CANDADO: Validar Músculo (Solo letras y espacios, mínimo 3 letras)
    const regexMusculo = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    if (musculo_principal.length < 3 || !regexMusculo.test(musculo_principal)) {
        alert('Error: El músculo principal solo debe contener letras y espacios (mínimo 3 caracteres).');
        return;
    }

    const datos = { nombre, musculo_principal };
    const URL = editandoEjercicioId ? `${API_URL}/ejercicios/${editandoEjercicioId}` : `${API_URL}/ejercicios`;
    const método = editandoEjercicioId ? 'PUT' : 'POST';

    try {
        const res = await fetch(URL, {
            method: método,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const json = await res.json();
        
        if (json.status === 'success') {
            alert(editandoEjercicioId ? 'Ejercicio actualizado con éxito' : 'Ejercicio agregado con éxito');
            resetFormEjercicio();
            cargarEjercicios();
        } else { 
            alert('Error del servidor: ' + json.message); 
        }
    } catch (err) { console.error('Error al conectar con la API:', err); }
}

function prepararEditarEjercicio(id, nombre, musculo) {
    editandoEjercicioId = id;
    document.getElementById('form-title-ejercicio').textContent = 'Modificar Ejercicio';
    document.getElementById('ejercicio-nombre').value = nombre;
    document.getElementById('ejercicio-musculo').value = musculo;
    document.getElementById('btn-cancel-ejercicio').style.display = 'block';
}

function resetFormEjercicio() {
    editandoEjercicioId = null;
    document.getElementById('form-ejercicio').reset();
    document.getElementById('form-title-ejercicio').textContent = 'Agregar Ejercicio';
    document.getElementById('btn-cancel-ejercicio').style.display = 'none';
}

async function eliminarEjercicio(id) {
    if (!confirm('¿Borrar ejercicio?')) return;
    const res = await fetch(`${API_URL}/ejercicios/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.status === 'success') cargarEjercicios(); else alert(json.message);
}

// ============================================================
// SECCIÓN: RUTINAS (CRUD)
// ============================================================
async function cargarRutinas() {
    try {
        const res = await fetch(`${API_URL}/rutinas`);
        const json = await res.json();
        const tbody = document.getElementById('tabla-rutinas-body');
        tbody.innerHTML = '';

        if (json.status === 'success') {
            json.data.forEach(rut => {
                tbody.innerHTML += `
                    <tr>
                        <td>${rut.id}</td>
                        <td>${rut.nombre_rutina}</td>
                        <td>${rut.descripcion || 'Sin descripción'}</td>
                        <td>
                            <div class="actions-btns">
                                <button class="action-btn btn-edit" onclick="prepararEditarRutina(${rut.id}, '${rut.nombre_rutina}', '${rut.descripcion || ''}')">Editar</button>
                                <button class="action-btn btn-delete" onclick="eliminarRutina(${rut.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (err) { console.error(err); }
}

async function guardarRutina(e) {
    e.preventDefault();
    const nombre_rutina = document.getElementById('rutina-nombre').value.trim();
    const descripcion = document.getElementById('rutina-descripcion').value.trim();

    // CANDADO: Validar Nombre de Rutina (Mínimo 3 caracteres, letras obligatorias)
    const regexRutina = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9\s\-_]+$/;
    const contieneLetras = /[A-Za-zÑñÁáÉéÍíÓóÚúÜü]/.test(nombre_rutina);

    if (nombre_rutina.length < 3 || !regexRutina.test(nombre_rutina) || !contieneLetras) {
        alert('Error: El nombre de la rutina debe tener al menos 3 caracteres y contener letras (Ej: Push Day, Pierna-A).');
        return;
    }

    // CANDADO: Validar Descripción (Opcional, pero si la ponen, mínimo 4 letras coherentes y máximo 255)
    if (descripcion.length > 0) {
        if (descripcion.length < 4 || descripcion.length > 255) {
            alert('Error: La descripción debe ser una frase válida entre 4 y 255 caracteres.');
            return;
        }
    }

    const datos = { nombre_rutina, descripcion: descripcion || null };
    const URL = editandoRutinaId ? `${API_URL}/rutinas/${editandoRutinaId}` : `${API_URL}/rutinas`;
    const método = editandoRutinaId ? 'PUT' : 'POST';

    try {
        const res = await fetch(URL, {
            method: método,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const json = await res.json();
        
        if (json.status === 'success') { 
            alert(editandoRutinaId ? 'Rutina modificada con éxito' : 'Rutina creada con éxito');
            resetFormRutina(); 
            cargarRutinas(); 
        } else { 
            alert('Error del servidor: ' + json.message); 
        }
    } catch (err) { console.error('Error al conectar con la API:', err); }
}

function prepararEditarRutina(id, nombre, desc) {
    editandoRutinaId = id;
    document.getElementById('form-title-rutina').textContent = 'Modificar Rutina';
    document.getElementById('rutina-nombre').value = nombre;
    document.getElementById('rutina-descripcion').value = desc;
    document.getElementById('btn-cancel-rutina').style.display = 'block';
}

function resetFormRutina() {
    editandoRutinaId = null;
    document.getElementById('form-rutina').reset();
    document.getElementById('form-title-rutina').textContent = 'Crear Estructura Rutina';
    document.getElementById('btn-cancel-rutina').style.display = 'none';
}

async function eliminarRutina(id) {
    if (!confirm('¿Borrar rutina?')) return;
    const res = await fetch(`${API_URL}/rutinas/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.status === 'success') cargarRutinas(); else alert(json.message);
}

// ============================================================
// SECCIÓN: HISTORIAL DE PROGRESO (La tabla relacional)
// ============================================================
async function cargarHistorial() {
    try {
        const res = await fetch(`${API_URL}/historial`);
        const json = await res.json();
        const tbody = document.getElementById('tabla-historial-body');
        tbody.innerHTML = '';

        if (json.status === 'success') {
            json.data.forEach(h => {
                tbody.innerHTML += `
                    <tr>
                        <td>${h.id}</td>
                        <td><b>${h.atleta_nombre}</b> <small>(ID: ${h.atleta_id})</small></td>
                        <td>${h.nombre_rutina}</td>
                        <td>${h.peso_maximo_lbs} kg</td> <td>${h.fecha}</td>
                        <td>
                            <div class="actions-btns">
                                <button class="action-btn btn-edit" onclick="prepararEditarHistorial(${h.id}, ${h.atleta_id}, ${h.rutina_id}, ${h.peso_maximo_lbs}, '${h.fecha}')">Editar</button>
                                <button class="action-btn btn-delete" onclick="eliminarHistorial(${h.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (err) { console.error(err); }
}

// Rellena los Dropdowns de Atletas y Rutinas para evitar meter IDs incorrectos
async function actualizarSelectsHistorial() {
    try {
        const resAtletas = await fetch(`${API_URL}/atletas`);
        const jsonAtletas = await resAtletas.json();
        const selectAtleta = document.getElementById('select-atleta');
        selectAtleta.innerHTML = '<option value="">-- Selecciona un Atleta --</option>';
        if (jsonAtletas.status === 'success') {
            jsonAtletas.data.forEach(a => {
                selectAtleta.innerHTML += `<option value="${a.id}">${a.nombre} (ID: ${a.id})</option>`;
            });
        }

        const resRutinas = await fetch(`${API_URL}/rutinas`);
        const jsonRutinas = await resRutinas.json();
        const selectRutina = document.getElementById('select-rutina');
        selectRutina.innerHTML = '<option value="">-- Selecciona una Rutina --</option>';
        if (jsonRutinas.status === 'success') {
            jsonRutinas.data.forEach(r => {
                selectRutina.innerHTML += `<option value="${r.id}">${r.nombre_rutina}</option>`;
            });
        }
    } catch (err) { console.error(err); }
}

// 1. REEMPLAZA ESTA FUNCIÓN EN APP.JS
async function guardarHistorial(e) {
    e.preventDefault();
    const atleta_id = document.getElementById('select-atleta').value;
    const rutina_id = document.getElementById('select-rutina').value;
    const peso_maximo_lbs = document.getElementById('historial-peso').value.trim(); // Mantiene el nombre del input para no romper tu HTML
    const fecha = document.getElementById('historial-fecha').value;

    if (!atleta_id || !rutina_id) {
        alert('Error: Debes seleccionar un Atleta y una Rutina de las listas.');
        return;
    }

    // CANDADO EN KG: Ajustado de 1 a 500 kg (un rango ultra pesado pero real)
    const peso = parseInt(peso_maximo_lbs);
    if (isNaN(peso) || peso < 1 || peso > 500) {
        alert('Error: El peso máximo debe ser un número entero entre 1 y 500 kg.');
        return;
    }

    if (!fecha) {
        alert('Error: La fecha es obligatoria.');
        return;
    }
    const fechaInput = new Date(fecha);
    const hoy = new Date();
    fechaInput.setHours(0,0,0,0);
    hoy.setHours(0,0,0,0);

    if (fechaInput > hoy) {
        alert('Error: No puedes registrar marcas de entrenamientos en fechas futuras.');
        return;
    }

    const datos = { atleta_id, rutina_id, peso_maximo_lbs: peso, fecha };
    const URL = editandoHistorialId ? `${API_URL}/historial/${editandoHistorialId}` : `${API_URL}/historial`;
    const método = editandoHistorialId ? 'PUT' : 'POST';

    try {
        const res = await fetch(URL, {
            method: método,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const json = await res.json();
        if (json.status === 'success') { 
            alert(editandoHistorialId ? 'Registro de progreso actualizado' : 'Nueva marca registrada con éxito');
            resetFormHistorial(); 
            cargarHistorial(); 
        } else { alert('Error: ' + json.message); }
    } catch (err) { console.error(err); }
}
function prepararEditarHistorial(id, atleta_id, rutina_id, peso, fecha) {
    editandoHistorialId = id;
    document.getElementById('form-title-historial').textContent = 'Modificar Marca';
    document.getElementById('select-atleta').value = atleta_id;
    document.getElementById('select-rutina').value = rutina_id;
    document.getElementById('historial-peso').value = peso;
    document.getElementById('historial-fecha').value = fecha;
    document.getElementById('btn-cancel-historial').style.display = 'block';
}

function resetFormHistorial() {
    editandoHistorialId = null;
    document.getElementById('form-historial').reset();
    document.getElementById('form-title-historial').textContent = 'Registrar Marca Histórica';
    document.getElementById('btn-cancel-historial').style.display = 'none';
}

async function eliminarHistorial(id) {
    if (!confirm('¿Borrar registro de historial?')) return;
    const res = await fetch(`${API_URL}/historial/${id}`, { method: 'DELETE' });
    if (res.ok) cargarHistorial();
}