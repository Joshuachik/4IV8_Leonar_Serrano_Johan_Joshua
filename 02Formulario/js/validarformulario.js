function validar(formulario) {

    // VALIDAR NOMBRE
    if (formulario.nombre.value.length < 3) {
        alert("Ingrese un nombre mayor a 3 caracteres");
        formulario.nombre.focus();
        return false;
    }

    var letras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!letras.test(formulario.nombre.value)) {
        alert("El nombre solo debe contener letras");
        formulario.nombre.focus();
        return false;
    }

    // VALIDAR EDAD
    if (formulario.edad.value < 1 || formulario.edad.value > 100) {
        alert("Ingrese una edad válida");
        formulario.edad.focus();
        return false;
    }

    // VALIDAR EMAIL
    var correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo.test(formulario.email.value)) {
        alert("Correo electrónico no válido");
        formulario.email.focus();
        return false;
    }

    alert("Formulario enviado correctamente");
    return true;
}