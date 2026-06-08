/**
 * primero tenemos que hacer un mapeo sobre las imagenes que se van a trabajar para el rompecabezas, porque debemos saber donde esta situada cada pieza y a partir de ello compararla con la imagen principal si hacen match ganamos sino hay que seguir comparando el orden hasta que coincidan
 */

var instrucciones = ["Utiliza las flechas de navegacion para mover las piezas", "Ordena las piezas hasta alcanzar el objetivo"];

//aqui van las flechas
var movimientos = [];

//vamos a crear la matriz para las posiciones del rompecabezas
var rompe = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
    ];

var rompeCorrecto = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
    ];    

//tenemos que identificar donde esta el punto de partida de la pieza vacia
var filaVacia = 2;
var columnaVacia = 2;

//necesito una funcion para recorrer el arreglo para pasar por cada elemento
function mostrarInstrucciones(instrucciones){
    for(var i = 0; i < instrucciones.length; i++){
        //otra funcion que enliste la instruccion
        mostrarInstruccionesEnLista(instrucciones[i], "lista-instrucciones");
    }
}

function mostrarInstruccionesEnLista(instruccion, idLista){
    var ul = document.getElementById(idLista);
    //ahora agregarmos li
    var li = document.createElement("li");
    //vamos a agregar
    li.textContent = instruccion;
    ul.appendChild(li);
}

function agregarUltimoMovimiento(direccion) {
    movimientos.push(direccion);
}

//vamos a crear una funcion para checar si ganamos
function checarSiGane(){
    //tengo que recorrer las piezas y saber si coinciden
    for(var i = 0; i < rompe.length; i++){
        for(var j = 0; j < rompe[i].length; j++){
            var rompeActual = rompe[i][j];
            if(rompeActual !== rompeCorrecto[i][j]){
                return false;
            }
        }
    }
    return true;
}

//funcion para decir que si gane wiiii
function mostrarCartelganador(){
    if(checarSiGane()){
        alert("Wiiiiiii a mimir (o.o)/ ");
    }
    return false;
}

/** vamos a crear una funcion que se encargue de poder intercambiar
 * las posiciones de las piezas porque dentro del rompecabezas necesitamos mover 
 * arreglo[1][2] = arreglo[0][0]
 * arreglo[0][0] = arreglo[1][2]
 */


function intercambiarPosicionesRompe(filaPos1, columnaPos1, filaPos2, columnaPos2){
    //mis variables de las posiciones
    var pos1 = rompe[filaPos1][columnaPos1];
    var pos2 = rompe[filaPos2][columnaPos2];

    //intercambio

    rompe[filaPos1][columnaPos1] = pos2;
    rompe[filaPos2][columnaPos2] = pos1;
}

//tenemos que actualizar la pieza vacia porque esa es la que se mueve
function actualizarPosicionVacia(nuevaFila, nuevaColumna){
    filaVacia = nuevaFila;
    columnaVacia = nuevaColumna;
}

//tengo que validar si la posicion dentro del rompecabezas es la correcta de la pieza
function posicionValida(fila, columna){
    return(fila >= 0 && fila <= 2 && columna >= 0 && columna <=2);
}

/**Ahora viene la parte del movimiento de las piezas, a lo que el hueco es lo se estara moviendo e intercambiando las posiciones para ello tenemos que saber que teclas de navegacion se estan presionando y hacia que direccion debe de moverse 
 * de ahi el codigo es: arriba 38 abajo 40 izquierda 37 derecha 39
 */

function moverEnDireccion(direccion){
    var nuevaFilaVacia;
    var nuevaColumnaVacia;

    //si se mueve hacia abajo?
    if(direccion === codigosDireccion.ABAJO){
        nuevaFilaVacia = filaVacia + 1;
        nuevaColumnaVacia = columnaVacia;
    }
    //si se mueve hacia arriba
    else if(direccion === codigosDireccion.ARRIBA){
        nuevaFilaVacia = filaVacia - 1;
        nuevaColumnaVacia = columnaVacia;
    }
    //si se mueve hacia derecha
    else if(direccion === codigosDireccion.DERECHA){
        nuevaFilaVacia = filaVacia;
        nuevaColumnaVacia = columnaVacia + 1;
    }
    //si se mueve hacia izquierda
    else if(direccion === codigosDireccion.IZQUIERDA){
        nuevaFilaVacia = filaVacia;
        nuevaColumnaVacia = columnaVacia - 1;
    }

    //tengo que checar su la nueva posicion es valida y sino intercambiarla
    if(posicionValida(nuevaFilaVacia, nuevaColumnaVacia)){
        //intercambio
        intercambiarPosiciones(filaVacia, columnaVacia, nuevaFilaVacia, nuevaColumnaVacia);
        //actualizar la posicion
        actualizarPosicionVacia(nuevaFilaVacia, nuevaColumnaVacia);
        //agregar el ultimo movimiento
        agregarUltimoMovimiento(direccion);
    }
}

function intercambiarPosiciones(fila1, columna1, fila2, columna2){
    //porque vamos a intercambiar posiciones de acuerdo a las piezas
    var pieza1 = rompe[fila1][columna1];
    var pieza2 = rompe[fila2][columna2];

    //mando a llamar a intercambiar las posiciones del rompecabezas
    intercambiarPosicionesRompe(fila1, columna1, fila2, columna2);
    //falta crear una funcion que cambie las posiciones en el DOM
    intercambiarPosicionesDOM('pieza' + pieza1, 'pieza' + pieza2 );
}

function intercambiarPosicionesDOM(idPieza1, idPieza2){
    //obtengo los elementos del dom
    var elementoPieza1 = document.getElementById(idPieza1);
    var elementoPieza2 = document.getElementById(idPieza2);

    //creo al padre
    var padre = elementoPieza1.parentNode;

    var cloneElemento1 = elementoPieza1.cloneNode(true);
    var cloneElemento2 = elementoPieza2.cloneNode(true);

    padre.replaceChild(cloneElemento1, elementoPieza2);
    padre.replaceChild(cloneElemento2, elementoPieza1);
}

//vamos a identificar los codigos de la direccion

var codigosDireccion = {
    IZQUIERDA : 37,
    ARRIBA : 38,
    DERECHA : 39,
    ABAJO : 40
};

//vamos actualizar los movientos

function actualizarUltimoMoviento(direccion){
    //obtenemos el elemento del dom
    var ultimoMov = document.getElementById('flecha');
    switch(direccion){
        case codigosDireccion.ARRIBA:
            ultimoMov.textContent = '↑';
            break;
        case codigosDireccion.ABAJO:
            ultimoMov.textContent = '↓';
            break;
        case codigosDireccion.DERECHA:
            ultimoMov.textContent = '→';
            break;
        case codigosDireccion.IZQUIERDA:
            ultimoMov.textContent = '←';
            break;
    }
}

//vamos a mezclar las piezas
function mezclarPiezas(veces){
    if(veces <= 0){
        alert("Holi wiii");
        return;
    }

    var direcciones = [codigosDireccion.ABAJO, codigosDireccion.ARRIBA, codigosDireccion.DERECHA, codigosDireccion.IZQUIERDA];

    //ahora vamos a meter en un random las direcciones
    var direccion = direcciones[Math.floor(Math.random) * direcciones.length];

    //mando a llamar a mover en direccion
    moverEnDireccion(direccion);

    //mando un retrazo
    setTimeout(function(){
        mezclarPiezas(veces - 1);
    }, 100);
}

//vamos a crear una funcion para saber ahora si que tecla esta presionando el jugador
function capturarTeclas(){
    document.body.onkeydown = (function(evento){
        if(evento.which === codigosDireccion.ABAJO || evento.which === codigosDireccion.ARRIBA || evento.which === codigosDireccion.DERECHA || evento.which === codigosDireccion.IZQUIERDA){
            //como ya se que tecla mando a llamar a moverendireccion
            moverEnDireccion(evento.which);
            //actualizo el ultimo movimento
            actualizarUltimoMoviento(evento.which);

            var gano = checarSiGane();

            if(gano){
                setTimeout(function(){
                    mostrarCartelganador();
                }, 500);
            }
            evento.preventDefault;
        }
    });
}

//funcion para iniciar
function iniciar(){
    mezclarPiezas(30);
    capturarTeclas();
}

iniciar();

mostrarInstrucciones(instrucciones);