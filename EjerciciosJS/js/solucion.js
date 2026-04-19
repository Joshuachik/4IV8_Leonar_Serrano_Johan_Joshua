// EVENTOS
document.getElementById("btn1").addEventListener("click", inversion);
document.getElementById("btn2").addEventListener("click", comisiones);
document.getElementById("btn3").addEventListener("click", descuento);
document.getElementById("btn4").addEventListener("click", calificacion);
document.getElementById("btn5").addEventListener("click", porcentajes);
document.getElementById("btn6").addEventListener("click", edad);

// FUNCIONES

function inversion() {
    let dinero = Number(prompt("¿Cuánto deseas invertir?"));

    if (!dinero || dinero <= 0) return alert("Valor incorrecto");

    let resultado = dinero * 1.02;

    alert(`Después de un mes tendrás: $${resultado.toFixed(2)}`);
}

function comisiones() {
    let base = Number(prompt("Sueldo base"));
    let ventas = [];

    for (let i = 1; i <= 3; i++) {
        ventas.push(Number(prompt("Venta " + i)));
    }

    if ([base, ...ventas].some(x => isNaN(x))) {
        return alert("Error en datos");
    }

    let suma = ventas.reduce((a, b) => a + b, 0);
    let extra = suma * 0.10;

    alert(`Comisión: $${extra.toFixed(2)} 
Total: $${(base + extra).toFixed(2)}`);
}

function descuento() {
    let compra = Number(prompt("Total de compra"));

    if (!compra) return alert("Dato inválido");

    let pagar = compra * 0.85;

    alert(`Total con descuento: $${pagar.toFixed(2)}`);
}

function calificacion() {
    let notas = [
        Number(prompt("Parcial 1")),
        Number(prompt("Parcial 2")),
        Number(prompt("Parcial 3"))
    ];

    let examen = Number(prompt("Examen final"));
    let trabajo = Number(prompt("Trabajo final"));

    if ([...notas, examen, trabajo].some(x => isNaN(x))) {
        return alert("Datos incorrectos");
    }

    let prom = notas.reduce((a, b) => a + b, 0) / 3;

    let final = (prom * 0.55) + (examen * 0.30) + (trabajo * 0.15);

    alert(`Calificación final: ${final.toFixed(2)}`);
}

function porcentajes() {
    let h = Number(prompt("Hombres"));
    let m = Number(prompt("Mujeres"));

    let total = h + m;

    if (!total) return alert("Error");

    alert(`Hombres: ${(h/total*100).toFixed(1)}%
Mujeres: ${(m/total*100).toFixed(1)}%`);
}

function edad() {
    let nacimiento = Number(prompt("Año de nacimiento"));
    let actual = new Date().getFullYear();

    if (!nacimiento) return alert("Dato inválido");

    alert(`Tu edad es: ${actual - nacimiento} años`);
}