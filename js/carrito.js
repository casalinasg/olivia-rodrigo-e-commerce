/* ==========================================================================
   - Todos los productos y todas las filas del carrito ya están escritos en
     productos.html. Las filas del carrito empiezan escondidas.
   - Cuando el usuario toca "Comprar", el JS suma las unidades al producto y
     MUESTRA la fila de ese producto en el carrito.
   - Cuando toca "Eliminar", el JS pone las unidades en 0 y ESCONDE la fila.
   ========================================================================== */

const panelCarrito = bootstrap.Offcanvas.getOrCreateInstance("#offcanvas-carrito");

/*      MÚSICA      */
const cd = [
    {
        id: "cd-0",
        nombre: "SOUR",
        precio: 40000,
        img: "img/cd-sour.png",
        enCarrito: 0
    },
    {
        id: "cd-1",
        nombre: "GUTS",
        precio: 20000,
        img: "img/cd-guts.png",
        enCarrito: 0
    },
    {
        id: "cd-2",
        nombre: "You seem pretty sad for a girl so in love",
        precio: 50000,
        img: "img/cd-yspsfagsil.png",
        enCarrito: 0
    }
];

const vinilo = [
    {
        id: "vinilo-0",
        nombre: "SOUR",
        precio: 150000,
        img: "img/vinilo-sour.png",
        enCarrito: 0
    },
    {
        id: "vinilo-1",
        nombre: "GUTS",
        precio: 120000,
        img: "img/vinilo-guts.png",
        enCarrito: 0
    },
    {
        id: "vinilo-2",
        nombre: "You seem pretty sad for a girl so in love",
        precio: 200000,
        img: "img/vinilo-yspsfagsil.png",
        enCarrito: 0
    }
];

/*      MERCH       */
const merch = [
    {
        id: "merch-0",
        nombre: "The Unraveled Tour Tote bag",
        precio: 40000,
        img: "img/tote-bag-tour.png",
        enCarrito: 0
    },
    {
        id: "merch-1",
        nombre: "The Unraveled Tour Cuaderno",
        precio: 35000,
        img: "img/cuaderno-tour.png",
        enCarrito: 0
    },
    {
        id: "merch-2",
        nombre: "The Unraveled Tour Llaveros x3",
        precio: 40000,
        img: "img/llaveros-tour.png",
        enCarrito: 0
    },
    {
        id: "merch-3",
        nombre: "The Unraveled Tour Buzo",
        precio: 110000,
        img: "img/buzo-tour.png",
        enCarrito: 0
    },
    {
        id: "merch-4",
        nombre: "The Unraveled Tour Botella",
        precio: 40000,
        img: "img/botella-tour.png",
        enCarrito: 0
    },
    {
        id: "merch-5",
        nombre: "The Unraveled Tour Remera",
        precio: 50000,
        img: "img/remera-tour.png",
        enCarrito: 0
    }
];

// Máximo de unidades de un mismo producto que se pueden llevar.
let maximo = 10;


/* ==========================================================================
   2. FUNCIONES
   ========================================================================== */

function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

/* Suma el precio de todos los productos de UNA lista (cd, vinilo o merch),
multiplicando cada precio por las unidades que hay en el carrito.*/
function totalDeLista(lista) {
    let total = 0;
    for (let i = 0; i < lista.length; i++) {
        total = total + lista[i].precio * lista[i].enCarrito;
    }
    return total;
}

/* ==========================================================================
   VENTANA EMERGENTE (avisos y confirmaciones)
   Es la misma ventana que se ve en la página
   de contacto: está escrita una sola vez en productos.html (id="overlay") y
   empieza escondida. Estas funciones le cambian el texto y la muestran o esconden.
   ========================================================================== */

// Qué hay que hacer si la persona toca "Aceptar":
// "eliminar" (sacar un producto), "vaciar" (vaciar el carrito) o "" (era solo un aviso).
let accionPendiente = "";

// El producto que se quiere sacar del carrito (solo se usa con la acción "eliminar").
let productoPendiente = null;

// El botón que abrió la ventana: al cerrarla, el foco vuelve ahí (ayuda a quien usa el teclado).
let botonQueAbrio = null;

// Muestra la ventana con un título y un texto.
function abrirVentana(titulo, texto) {
    botonQueAbrio = document.activeElement;
    // El título y el texto están dentro de un <output>: su texto se cambia con .value
    document.getElementById("textoTitulo").value = titulo;
    document.getElementById("textoMensaje").value = texto;
    document.getElementById("overlay").style.display = "flex";
    document.getElementById("btnAceptar").focus(); // el foco pasa a la ventana
}

// Aviso: ventana con un solo botón. Reemplaza a alert().
function mostrarAviso(titulo, texto) {
    accionPendiente = "";
    document.getElementById("btnCancelar").style.display = "none";
    abrirVentana(titulo, texto);
}

// Confirmación: ventana con Cancelar y Aceptar. Reemplaza a confirm().
// "accion" dice qué hacer si toca Aceptar. "producto" solo se usa con "eliminar".
function pedirConfirmacion(titulo, texto, accion, producto) {
    accionPendiente = accion;
    productoPendiente = producto;
    document.getElementById("btnCancelar").style.display = "inline-block";
    abrirVentana(titulo, texto);
}

// Esconde la ventana y devuelve el foco al botón que la abrió.
function cerrarVentana() {
    document.getElementById("overlay").style.display = "none";
    if (botonQueAbrio !== null) {
        botonQueAbrio.focus();
    }
}

// Botón "Aceptar": cierra la ventana y, si era una confirmación, hace lo que se pidió.
function aceptarVentana() {
    cerrarVentana();

    if (accionPendiente === "eliminar") {
        productoPendiente.enCarrito = 0;
        actualizarCarrito();
    } else if (accionPendiente === "vaciar") {
        for (let i = 0; i < cd.length; i++) {
            cd[i].enCarrito = 0;
        }
        for (let i = 0; i < vinilo.length; i++) {
            vinilo[i].enCarrito = 0;
        }
        for (let i = 0; i < merch.length; i++) {
            merch[i].enCarrito = 0;
        }
        actualizarCarrito();
    }

    accionPendiente = "";
}

// Click en el fondo oscuro (fuera de la ventana): se cierra sin hacer nada.
// "evento.target" es el elemento donde se hizo click.
function clicFondo(evento) {
    if (evento.target === document.getElementById("overlay")) {
        cerrarVentana();
    }
}

// Teclado: Escape cierra la ventana y Tab no deja que el foco salga de ella.
function teclasVentana(evento) {
    if (evento.key === "Escape") {
        cerrarVentana();
    }

    if (evento.key === "Tab") {
        let cancelar = document.getElementById("btnCancelar");
        let aceptar = document.getElementById("btnAceptar");

        if (cancelar.style.display === "none") {
            // En un aviso solo hay un botón: el foco se queda ahí
            evento.preventDefault();
            aceptar.focus();
        } else if (evento.shiftKey && document.activeElement === cancelar) {
            evento.preventDefault();
            aceptar.focus();
        } else if (!evento.shiftKey && document.activeElement === aceptar) {
            evento.preventDefault();
            cancelar.focus();
        }
    }
}


function validarCantidad(producto) {
    /* getElementById busca en la página el elemento que tiene ese id.
     El id del campo es "cantidad-" + el id del producto,
     por ej "cantidad-vinilo-0".*/
    let campo = document.getElementById("cantidad-" + producto.id);
    let cantidad = Number(campo.value); // .value es el texto que hay escrito en el campo.
    if (isNaN(cantidad)) {
        mostrarAviso("Cantidad no válida", "Ingresá solo números en la cantidad.");
        campo.value = 1;
        return false;
    }

    if (cantidad % 1 !== 0) {
        mostrarAviso("Cantidad no válida", "La cantidad tiene que ser un número entero, sin decimales.");
        campo.value = 1;
        return false;
    }

    if (cantidad < 1) {
        mostrarAviso("Cantidad no válida", "La cantidad mínima es 1.");
        campo.value = 1;
        return false;
    }

    if (cantidad > maximo) {
        mostrarAviso("Límite de unidades", "Podés llevar hasta " + maximo + " unidades de cada producto.");
        campo.value = 1;
        return false;
    }

    return true;
}


/* ==========================================================================
    BOTONES + Y -
   ========================================================================== */

function sumar(producto) {
    if (validarCantidad(producto)) {
        let campo = document.getElementById("cantidad-" + producto.id);
        let cantidad = Number(campo.value);

        if (cantidad >= maximo) {
            mostrarAviso("Límite de unidades", "Podés llevar hasta " + maximo + " unidades de cada producto.");
        } else {
            campo.value = cantidad + 1;
        }
    }
}

function restar(producto) {
    if (validarCantidad(producto)) {
        let campo = document.getElementById("cantidad-" + producto.id);
        let cantidad = Number(campo.value);

        if (cantidad <= 1) {
            mostrarAviso("Cantidad no válida", "La cantidad mínima es 1.");
        } else {
            campo.value = cantidad - 1;
        }
    }
}


/* ==========================================================================
    BOTONES DE COMPRAR Y ELIMINAR
   ========================================================================== */

   function agregar(producto) {
    if (validarCantidad(producto)) {
        let campo = document.getElementById("cantidad-" + producto.id);
        let cantidad = Number(campo.value);

        if (producto.enCarrito + cantidad > maximo) {
            mostrarAviso("Límite de unidades", "Ya tenés " + producto.enCarrito + " en el carrito. " +
                "Podés llevar hasta " + maximo + " unidades de cada producto.");
        } else {
            producto.enCarrito = producto.enCarrito + cantidad;

            // El número del círculo vuelve a 1 para la próxima vez.
            campo.value = 1;

            actualizarCarrito();
            panelCarrito.show();
        }
    }
}


function eliminar(producto) {
    pedirConfirmacion("Eliminar producto", "¿Querés sacar \"" + producto.nombre + "\" del carrito?", "eliminar", producto);
}

function vaciarCarrito() {
    pedirConfirmacion("Vaciar carrito", "¿Querés vaciar el carrito?", "vaciar", null);
}


/* ==========================================================================
   MOSTRAR O ESCONDER LAS FILAS DEL CARRITO
   ========================================================================== */

// Actualiza la fila de UN producto en el carrito.
function actualizarFila(producto) {
    let fila = document.getElementById("fila-" + producto.id);

    if (producto.enCarrito > 0) {
        fila.style.display = "flex"; //style.display cambia el CSS del elemento desde JavaScript ("none"  esconde el elemento.)
        document.getElementById("unidades-" + producto.id).value = producto.enCarrito + " u.";
        document.getElementById("subtotal-" + producto.id).value = formatearPrecio(producto.precio * producto.enCarrito);
    } else {
        // Si no hay unidades: se esconde la fila.
        fila.style.display = "none";
    }
}

// Actualiza las filas de TODOS los productos de una lista.
function actualizarLista(lista) {
    for (let i = 0; i < lista.length; i++) {
        actualizarFila(lista[i]);
    }
}

// Actualiza todo el carrito: las filas, el total y las dos secciones.
// Se llama cada vez que se agrega o se saca algo.
function actualizarCarrito() {
    actualizarLista(vinilo);
    actualizarLista(cd);
    actualizarLista(merch);

    let total = totalDeLista(vinilo) + totalDeLista(cd) + totalDeLista(merch);
    document.getElementById("total-compra").value = formatearPrecio(total);

    let seccionCarrito = document.getElementById("seccion-carrito");
    let seccionResumen = document.getElementById("seccion-resumen");

    // Si el total es 0 no hay nada en el carrito: se esconden las dos secciones.
    // Si hay algo, se muestran.
    if (total === 0) {
        seccionCarrito.style.display = "none";
        seccionResumen.style.display = "none";

        panelCarrito.hide();
    } else {
        seccionCarrito.style.display = "block";
        seccionResumen.style.display = "block";
    }

    // Actualiza el globito del carrito en el header
    let totalUnidades = unidadesDeLista(vinilo) + unidadesDeLista(cd) + unidadesDeLista(merch);
    let contador = document.getElementById("contador-carrito");

    if (totalUnidades === 0) {
        contador.style.display = "none";
    } else {
        contador.style.display = "flex";
        contador.value = totalUnidades;
    }
}

/* Suma las unidades de todos los productos de UNA lista (cd, vinilo o merch). */
function unidadesDeLista(lista) {
    let unidades = 0;
    for (let i = 0; i < lista.length; i++) {
        unidades = unidades + lista[i].enCarrito;
    }
    return unidades;
}


actualizarCarrito();

