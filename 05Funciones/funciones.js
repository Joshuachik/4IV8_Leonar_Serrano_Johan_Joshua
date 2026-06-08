// Vamos a hacer un viaje en el tiempo y ahora vamos a programar bajo el esquema ES6

/*
Para javascript ya conocemos el concepto de variable

var

Se sustituye por las nuevas variables:

let --> es una variable de tipo protegida, ya que solo funciona dentro de un fragmento de codigo

const --> si es constante
*/

/*
if(true){
    let x = "x";
    //console.log(x);

    let x = "y"
    console.log(x);
}
*/

// Para declarar en js las funciones hay una forma mas efectiva para declararlas y a partir de una funcion flecha

// Una funcion flecha en JS a diferencia de una funcion normal, no genera su propio contexto (this),
// necesita ser declarada antes de ser usada y no necesita un return

// function cosa(String hola) { String cosa; this.cosa = hola }

// Vamos a hacer una funcion que sume dos numeros
function sumarnumeros(n1, n2){
    return n1 + n2;
}

const sumarDosNumeros = (n1, n2) => n1 + n2;

console.log(`La suma de la funcion es: (2,3): ${sumarnumeros(2,3)} `);

console.log(`La suma de la funcion es: (5,3): ${sumarDosNumeros(5,3)} `);
// Para armar una función flecha debemos de entender su estructura:
// "cadena" (el tipo de variable, nombre de la función y los argumentos) => operación

const razasDePerros = [
    "Gran Danes",
    "Doberman",
    "Chihuahua",
    "Pastor Aleman",
    "Pitbul",
    "San Bernardo",
    "Xoloescuincle"
];
/*
for (let i = 0; i < razasDePerros.length; i++){
    console.log(razasDePerros[i]);
}

for (const raza of razasDePerros){
    console.log(raza);
}

for (const indice in razasDePerros){
    console.log(razasDePerros[indice]);
} */

// forEach (queda incompleto en la imagen, pero sería algo así)
razasDePerros.forEach((raza) => {
    console.log(raza);
});