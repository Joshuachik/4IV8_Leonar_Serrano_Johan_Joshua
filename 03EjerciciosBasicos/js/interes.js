function validarn(e){
    var teclado = (document.all)?e.KeyCode:e.which;
    if(teclado == 8) return true;
   
    var patron = /[0-9\d.]/;

    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);

    
}
function interes(){
    var valor = document.getElementById('cantidadi').value;

    var interes = parseFloat(valor);
    

    var subtotal = interes * .10;

    var total = subtotal + interes;
    document.getElementById('sueldoi').value = "$" + total;


}
function borrar(){
    document.getElementById('saldoi').value="";
    document.getElementById('cantidadi').value="";
}function validarn(e) {
    var teclado = (document.all) ? e.keyCode : e.which;

    
    if (teclado == 8) return true;

    var patron = /[0-9.]/;
    var codigo = String.fromCharCode(teclado);

    return patron.test(codigo);
}

function interes() {

    var valor = document.getElementById('cantidadi').value;

    // Validación
    if (valor === "" || isNaN(valor)) {
        alert("Ingresa una cantidad válida");
        return;
    }

    var cantidad = parseFloat(valor);

    

    var subtotal = cantidad * 0.01; 
    var total = cantidad + subtotal;

    document.getElementById('Sueldo1').value = "$" + total.toFixed(2);
}

function borrar() {
    document.getElementById('cantidadi').value = "";
    document.getElementById('Sueldo1').value = "";
}