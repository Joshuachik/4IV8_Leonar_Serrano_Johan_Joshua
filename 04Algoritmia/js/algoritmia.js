const $ = (s) => document.querySelector(s);

// PROBLEMA 1
function problema1() {
    const input = $('#p1-input').value.trim();

    if (!input) {
        $('#p1-output').textContent = 'Error: El campo no puede estar vacío';
        return;
    }

    const resultado = input.split(/\s+/).reverse().join(' ');
    $('#p1-output').textContent = resultado;
}

// PROBLEMA 2
function problema2() {
    const ids = [
        '#p2-x1','#p2-x2','#p2-x3','#p2-x4','#p2-x5',
        '#p2-y1','#p2-y2','#p2-y3','#p2-y4','#p2-y5'
    ];

    const valores = [];

    for (let id of ids) {
        const val = $(id).value.trim();

        // VALIDACIÓN VACÍO
        if (val === '') {
            $('#p2-output').textContent = 'Error: Todos los campos deben estar llenos';
            return;
        }

        // VALIDACIÓN NÚMERO
        if (isNaN(val)) {
            $('#p2-output').textContent = 'Error: Solo se permiten valores numéricos';
            return;
        }

        valores.push(Number(val));
    }

    const v1 = valores.slice(0,5).sort((a,b)=>b-a);
    const v2 = valores.slice(5).sort((a,b)=>a-b);

    let producto = 0;
    for (let i=0;i<5;i++){
        producto += v1[i]*v2[i];
    }

    $('#p2-output').textContent = 'El producto escalar mínimo es: ' + producto;
}

// PROBLEMA 3
function problema3() {
    const input = $('#p3-input').value.trim();

    if (!input) {
        $('#p3-output').textContent = 'Error: Debes ingresar al menos una palabra';
        return;
    }

    // ADVERTENCIA: sin comas
    if (!input.includes(',')) {
        $('#p3-output').textContent = 'Advertencia: separa las palabras con comas';
        return;
    }

    const palabras = input.split(',');
    let mejor = '';
    let max = 0;
    let hayLetras = false;

    palabras.forEach(p => {
        const limpia = p.trim().toUpperCase();
        const letras = limpia.replace(/[^A-Z]/g, '');

        if (letras.length > 0) {
            hayLetras = true;
        }

        const unicas = new Set(letras);

        if (unicas.size > max) {
            max = unicas.size;
            mejor = limpia;
        }
    });

    // VALIDACIÓN: sin letras válidas
    if (!hayLetras) {
        $('#p3-output').textContent = 'Error: No se encontraron caracteres válidos (A-Z)';
        return;
    }

    $('#p3-output').textContent =
        `La palabra con más caracteres únicos es: ${mejor} (${max} caracteres)`;
}


// 🔄 RESET PROBLEMA 1
function resetP1() {
    $('#p1-input').value = '';
    $('#p1-output').textContent = 'Esperando datos...';
}

// 🔄 RESET PROBLEMA 2
function resetP2() {
    const ids = [
        '#p2-x1','#p2-x2','#p2-x3','#p2-x4','#p2-x5',
        '#p2-y1','#p2-y2','#p2-y3','#p2-y4','#p2-y5'
    ];

    ids.forEach(id => {
        $(id).value = '';
    });

    $('#p2-output').textContent = 'Esperando datos...';
}

// 🔄 RESET PROBLEMA 3
function resetP3() {
    $('#p3-input').value = '';
    $('#p3-output').textContent = 'Esperando datos...';
}