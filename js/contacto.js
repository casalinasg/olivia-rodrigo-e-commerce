/////// FUNCIONES ///////

// Muestra un error: pinta el campo en rojo y escribe el texto debajo
function mostrarError(input, contenedorError, mensaje) {
    contenedorError.textContent = mensaje;
    input.classList.add("is-invalid");           // Bootstrap pone el borde en rojo
    input.setAttribute("aria-invalid", "true");  // avisa al lector de pantalla
    input.setAttribute("aria-describedby", contenedorError.id); // lo conecta con su mensaje
}

// Saca el error de un campo
function limpiarError(input, contenedorError) {
    contenedorError.textContent = "";
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
}

// Devuelve true si el texto tiene algo que no sea una letra o un espacio
// Truco: una letra cambia al pasar a mayúscula/minúscula; un número o símbolo no
function tieneCaracteresInvalidos(texto) {
    for (var i = 0; i < texto.length; i++) {
        var caracter = texto[i];
        if (caracter !== " " && caracter.toLowerCase() === caracter.toUpperCase()) {
            return true;
        }
    }
    return false;
}

// Devuelve "" si el nombre está bien, o el mensaje del error
function validaNombre(nombre) {
    if (nombre === "") {
        return "Ingresá tu nombre y apellido.";
    }
    if (tieneCaracteresInvalidos(nombre)) {
        return "Usá solo letras, sin números.";
    }
    if (nombre.length < 3) {
        return "Mínimo 3 letras.";
    }
    return "";
}

// Devuelve "" si el gmail está bien, o el mensaje del error
function validaGmail(email) {
    if (email === "") {
        return "Ingresá tu Gmail.";
    }
    if (email.includes(" ")) {
        return "No puede tener espacios.";
    }
    if (email.indexOf("@") !== email.lastIndexOf("@")) {
        return "Tiene que tener un solo @.";
    }
    if (!email.endsWith("@gmail.com")) {
        return "Tiene que terminar en @gmail.com";
    }
    if (email === "@gmail.com") {
        return "Escribí tu usuario antes del @.";
    }
    return "";
}

// Devuelve "" si el mensaje está bien, o el mensaje del error
function validaMensaje(mensaje) {
    if (mensaje === "") {
        return "Escribí tu mensaje.";
    }
    if (mensaje.length < 10) {
        return "Escribí al menos 10 caracteres.";
    }
    return "";
}

/////// PROGRAMA PRINCIPAL ///////

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("formContacto");
    var nombreInput = document.getElementById("nombre");
    var emailInput = document.getElementById("email");
    var mensajeInput = document.getElementById("mensaje");
    var contador = document.getElementById("contador");
    var resultado = document.getElementById("resultado");

    // Elementos de la ventana de confirmación
    var overlay = document.getElementById("overlay");
    var btnConfirmar = document.getElementById("btnConfirmar");
    var btnCancelar = document.getElementById("btnCancelar");
    var btnEnviar = document.getElementById("btnEnviar");

    // Elementos de la ventana de "mensaje enviado"
    var overlayExito = document.getElementById("overlayExito");
    var textoExito = document.getElementById("textoExito");
    var btnCerrarExito = document.getElementById("btnCerrarExito");

    // Acá guardamos lo que escribió el usuario mientras espera la confirmación
    var datos = new Array();

    var errorNombre = document.getElementById("errorNombre");
    var errorEmail = document.getElementById("errorEmail");
    var errorMensaje = document.getElementById("errorMensaje");
    var errorMotivo = document.getElementById("errorMotivo");

    // Contador: se actualiza cada vez que el usuario escribe o borra
    mensajeInput.addEventListener("input", function () {
        contador.textContent = mensajeInput.value.length + " / 300";
    });

    // Al enviar el formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // evita que la página se recargue

        var hayErrores = false;
        var primerError = null; // guarda el primer campo con error para enfocarlo

        // Limpiamos los errores anteriores
        resultado.innerHTML = "";
        limpiarError(nombreInput, errorNombre);
        limpiarError(emailInput, errorEmail);
        limpiarError(mensajeInput, errorMensaje);
        errorMotivo.textContent = "";

        // Nombre
        var nombre = nombreInput.value.trim();
        var errorDelNombre = validaNombre(nombre);
        if (errorDelNombre !== "") {
            mostrarError(nombreInput, errorNombre, errorDelNombre);
            primerError = nombreInput;
            hayErrores = true;
        }

        // Gmail (pasamos a minúsculas para aceptar "@Gmail.com")
        var email = emailInput.value.trim().toLowerCase();
        var errorDelEmail = validaGmail(email);
        if (errorDelEmail !== "") {
            mostrarError(emailInput, errorEmail, errorDelEmail);
            if (primerError === null) {
                primerError = emailInput;
            }
            hayErrores = true;
        }

        // Motivo (radio buttons): hay que elegir uno
        var motivo = document.querySelector('input[name="motivo"]:checked');
        if (motivo === null) {
            errorMotivo.textContent = "Elegí un motivo de consulta.";
            if (primerError === null) {
                primerError = document.getElementById("m1");
            }
            hayErrores = true;
        }

        // Mensaje
        var mensaje = mensajeInput.value.trim();
        var errorDelMensaje = validaMensaje(mensaje);
        if (errorDelMensaje !== "") {
            mostrarError(mensajeInput, errorMensaje, errorDelMensaje);
            if (primerError === null) {
                primerError = mensajeInput;
            }
            hayErrores = true;
        }

        // Si hubo errores: avisamos y llevamos el foco al primero
        if (hayErrores) {
            resultado.innerHTML = '<p class="text-danger fw-bold mb-0" role="alert">Revisá los campos marcados en rojo.</p>';
            primerError.focus();
            return;
        }

        // Sin errores: guardamos los datos y abrimos la ventana de confirmación
        datos['Nombre'] = nombre;
        datos['Email'] = email;
        datos['Motivo'] = motivo.value;
        abrirConfirmacion();
    });

    // ----- VENTANA DE CONFIRMACIÓN -----

    // Muestra la ventana y el fondo oscuro encima de la página
    function abrirConfirmacion() {
        overlay.classList.remove("d-none");
        btnConfirmar.focus(); // el foco pasa a la ventana (teclado y lector de pantalla)
    }

    // Oculta la ventana y devuelve el foco al botón Enviar
    function cerrarConfirmacion() {
        overlay.classList.add("d-none");
        btnEnviar.focus();
    }

    // Limpia el formulario y abre la ventana de "mensaje enviado"
    function enviarFormulario() {
        textoExito.textContent = "¡Gracias " + datos['Nombre'] + '! Recibimos tu consulta sobre "' + datos['Motivo'] + '". ' +
            'Te responderemos a: ' + datos['Email'] + '.';

        form.reset();
        contador.textContent = "0 / 300";

        overlayExito.classList.remove("d-none");
        btnCerrarExito.focus(); // el foco pasa a la ventana
    }

    // Cierra la ventana de "mensaje enviado" y devuelve el foco al botón Enviar
    function cerrarExito() {
        overlayExito.classList.add("d-none");
        btnEnviar.focus();
    }

    // Botón "Sí, enviar"
    btnConfirmar.addEventListener("click", function () {
        overlay.classList.add("d-none");
        enviarFormulario();
    });

    // Botón "Cancelar"
    btnCancelar.addEventListener("click", function () {
        cerrarConfirmacion();
    });

    // Click en el fondo oscuro (fuera de la ventana) también cancela
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            cerrarConfirmacion();
        }
    });

    // Botón "Cerrar" de la ventana de "mensaje enviado"
    btnCerrarExito.addEventListener("click", function () {
        cerrarExito();
    });

    // Click en el fondo oscuro (fuera de la hoja) también la cierra
    overlayExito.addEventListener("click", function (e) {
        if (e.target === overlayExito) {
            cerrarExito();
        }
    });

    // Teclado: Escape cancela y Tab queda dentro de la ventana
    document.addEventListener("keydown", function (e) {
        // Ventana de "mensaje enviado": Escape la cierra y, como tiene un solo botón, Tab no sale de ahí
        if (!overlayExito.classList.contains("d-none")) {
            if (e.key === "Escape") {
                cerrarExito();
            }
            if (e.key === "Tab") {
                e.preventDefault();
                btnCerrarExito.focus();
            }
            return;
        }

        if (overlay.classList.contains("d-none")) {
            return; // si la ventana está cerrada, no hacemos nada
        }
        if (e.key === "Escape") {
            cerrarConfirmacion();
        }
        if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === btnCancelar) {
                e.preventDefault();
                btnConfirmar.focus();
            } else if (!e.shiftKey && document.activeElement === btnConfirmar) {
                e.preventDefault();
                btnCancelar.focus();
            }
        }
    });
});