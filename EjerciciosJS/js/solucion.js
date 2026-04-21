// EVENTOS
document.getElementById("btn1").addEventListener("click", inversion);
document.getElementById("btn2").addEventListener("click", comisiones);
document.getElementById("btn3").addEventListener("click", descuento);
document.getElementById("btn4").addEventListener("click", calificacion);
document.getElementById("btn5").addEventListener("click", porcentajes);
document.getElementById("btn6").addEventListener("click", edad);

// REGEX
const numeroRegex = /^\d+(\.\d+)?$/;
const enteroRegex = /^\d+$/;

// FUNCIÓN GENERAL PARA PEDIR DATOS (🔥 clave)
function pedirNumero(mensaje, { min = -Infinity, max = Infinity, entero = false } = {}) {
    let valor = prompt(mensaje)?.trim();

    if (!valor) {
        alert("No puedes dejar el campo vacío");
        return null;
    }

    let esValido = entero ? enteroRegex.test(valor) : numeroRegex.test(valor);

    if (!esValido) {
        alert("Formato inválido");
        return null;
    }

    let num = Number(valor);

    if (num < min || num > max) {
        alert(`El valor debe estar entre ${min} y ${max}`);
        return null;
    }

    return num;
}

// FUNCIONES

function inversion() {
    let dinero = pedirNumero("¿Cuánto deseas invertir?", { min: 0.01 });

    if (dinero === null) return;

    let resultado = dinero * 1.02;

    alert(`Después de un mes tendrás: $${resultado.toFixed(2)}`);
}

function comisiones() {
    let base = pedirNumero("Sueldo base", { min: 0 });

    if (base === null) return;

    let ventas = [];

    for (let i = 1; i <= 3; i++) {
        let venta = pedirNumero(`Venta ${i}`, { min: 0 });
        if (venta === null) return;
        ventas.push(venta);
    }

    let suma = ventas.reduce((a, b) => a + b, 0);
    let extra = suma * 0.10;

    alert(`Comisión: $${extra.toFixed(2)} 
Total: $${(base + extra).toFixed(2)}`);
}

function descuento() {
    let compra = pedirNumero("Total de compra", { min: 0.01 });

    if (compra === null) return;

    let pagar = compra * 0.85;

    alert(`Total con descuento: $${pagar.toFixed(2)}`);
}

function calificacion() {
    let notas = [];

    for (let i = 1; i <= 3; i++) {
        let nota = pedirNumero(`Parcial ${i}`, { min: 0, max: 10 });
        if (nota === null) return;
        notas.push(nota);
    }

    let examen = pedirNumero("Examen final", { min: 0, max: 10 });
    let trabajo = pedirNumero("Trabajo final", { min: 0, max: 10 });

    if (examen === null || trabajo === null) return;

    let prom = notas.reduce((a, b) => a + b, 0) / 3;
    let final = (prom * 0.55) + (examen * 0.30) + (trabajo * 0.15);

    alert(`Calificación final: ${final.toFixed(2)}`);
}

function porcentajes() {
    let h = pedirNumero("Hombres", { min: 0, entero: true });
    let m = pedirNumero("Mujeres", { min: 0, entero: true });

    if (h === null || m === null) return;

    let total = h + m;

    if (total === 0) {
        return alert("El total no puede ser 0");
    }

    alert(`Hombres: ${(h / total * 100).toFixed(1)}%
Mujeres: ${(m / total * 100).toFixed(1)}%`);
}

function edad() {
    let nacimiento = pedirNumero("Año de nacimiento", { min: 1900, max: new Date().getFullYear(), entero: true });

    if (nacimiento === null) return;

    let actual = new Date().getFullYear();
    let edad = actual - nacimiento;

    if (edad > 120) {
        return alert("Edad no válida (máximo 120 años)");
    }

    alert(`Tu edad es: ${edad} años`);
}
