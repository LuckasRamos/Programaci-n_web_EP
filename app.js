const productos = [
  {
    id: 1,
    nombre: 'Panetón Clásico',
    descripcion: 'Con pasas y frutas confitadas.',
    precio: 24.90,
    imagen: 'img/PanetonClasico.jpg'
  },
  {
    id: 2,
    nombre: 'Panetón con Chispas de Chocolate',
    descripcion: 'Con deliciosas chispas de chocolate.',
    precio: 29.90,
    imagen: 'img/PanetonChocochips.jpg'
  },
  {
    id: 3,
    nombre: 'Panetón Chocolate',
    descripcion: 'Presentación especial con mucho chocolate.',
    precio: 39.90,
    imagen: 'img/PanetonChocolate.jpg'
  },
  {
    id: 4,
    nombre: 'Mini Panetón',
    descripcion: 'Presentación pequeña, ideal para regalar.',
    precio: 12.50,
    imagen: 'img/MiniPaneton.jpg'
  }
];

let carrito = [];
let pedidos = [];

const soles = valor => 'S/ ' + valor.toFixed(2);

// CALCULAR TOTAL DEL CARRITO
function calcularTotal() {
  return carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad, 0
  );
}

// MOSTRAR CATÁLOGO
function mostrarCatalogo() {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const columna = document.createElement('div');
    columna.className = 'col-12 col-sm-6 col-lg-3';

    columna.innerHTML = `
      <article class="card">
        <img class="card-img-top"
             src="${producto.imagen}"
             alt="Ilustración de ${producto.nombre}">

        <div class="card-body d-flex flex-column">
          <h3 class="card-title h5">${producto.nombre}</h3>
          <p class="card-text">${producto.descripcion}</p>
          <p class="precio mt-auto">${soles(producto.precio)}</p>

          <button type="button"
                  class="btn btn-navidad agregar"
                  data-id="${producto.id}">
            Agregar al carrito
          </button>
        </div>
      </article>
    `;

    contenedor.appendChild(columna);
  });
}

// AGREGAR PRODUCTO
function agregarProducto(id) {
  const producto = productos.find(p => p.id === id);

  if (!producto) return;

  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  mostrarCarrito();
}

// CAMBIAR CANTIDAD
function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);

  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  mostrarCarrito();
}

// ELIMINAR PRODUCTO
function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  mostrarCarrito();
}

// MOSTRAR CARRITO
function mostrarCarrito() {
  const lista = document.getElementById('lista-carrito');
  lista.innerHTML = '';

  if (carrito.length === 0) {
    const vacio = document.createElement('p');
    vacio.textContent = 'Tu carrito está vacío. ¡Agrega un panetón!';
    lista.appendChild(vacio);
  }

  carrito.forEach(item => {
    const fila = document.createElement('div');
    fila.className = 'fila-carrito';

    const descripcion = document.createElement('div');
    descripcion.textContent =
      `${item.nombre} · ${soles(item.precio)}`;

    const controles = document.createElement('div');
    controles.className = 'controles';

    const menos = document.createElement('button');
    menos.className = 'btn btn-outline-secondary btn-sm';
    menos.textContent = '−';
    menos.setAttribute(
      'aria-label',
      'Quitar una unidad de ' + item.nombre
    );
    menos.addEventListener('click', () =>
      cambiarCantidad(item.id, -1)
    );

    const cantidad = document.createElement('strong');
    cantidad.textContent = item.cantidad;

    const mas = document.createElement('button');
    mas.className = 'btn btn-outline-secondary btn-sm';
    mas.textContent = '+';
    mas.setAttribute(
      'aria-label',
      'Agregar una unidad de ' + item.nombre
    );
    mas.addEventListener('click', () =>
      cambiarCantidad(item.id, 1)
    );

    const borrar = document.createElement('button');
    borrar.className = 'btn btn-outline-danger btn-sm';
    borrar.textContent = 'Eliminar';
    borrar.addEventListener('click', () =>
      eliminarProducto(item.id)
    );

    controles.append(menos, cantidad, mas, borrar);
    fila.append(descripcion, controles);
    lista.appendChild(fila);
  });

  document.getElementById('total').textContent =
    soles(calcularTotal());

  document.getElementById('contador').textContent =
    carrito.reduce((suma, p) => suma + p.cantidad, 0);
}

// MOSTRAR MENSAJES
function mostrarMensaje(texto, exito) {
  const elemento = document.getElementById('mensaje');

  elemento.textContent = texto;

  elemento.className = exito
    ? 'mt-3 mensaje-ok'
    : 'mt-3 mensaje-error';
}

// MOSTRAR CAMPOS DE ENTREGA A DOMICILIO
function mostrarCamposDomicilio() {
  const entrega = document.getElementById('entrega').value;
  const campos = document.getElementById('camposDomicilio');

  const metodoPago = document.getElementById('metodoPago');
  const telefono = document.getElementById('telefono');
  const ubicacion = document.getElementById('ubicacion');

  // NUEVO: DIRECCIÓN
  const direccion = document.getElementById('direccion');

  if (entrega === 'Entrega a Domicilio') {
    campos.style.display = 'flex';

    metodoPago.required = true;
    telefono.required = true;
    ubicacion.required = true;
    direccion.required = true;

  } else {
    campos.style.display = 'none';

    metodoPago.required = false;
    telefono.required = false;
    ubicacion.required = false;
    direccion.required = false;

    metodoPago.value = '';
    telefono.value = '';
    ubicacion.value = '';
    direccion.value = '';
  }
}

// REGISTRAR PEDIDO
function registrarPedido(evento) {
  evento.preventDefault();

  const cliente = document.getElementById('cliente').value.trim();
  const entrega = document.getElementById('entrega').value;

  const consentimiento =
    document.getElementById('consentimiento').checked;

  const metodoPago =
    document.getElementById('metodoPago').value;

  const telefono =
    document.getElementById('telefono').value.trim();

  const ubicacion =
    document.getElementById('ubicacion').value.trim();

  // NUEVO: OBTENER DIRECCIÓN
  const direccion =
    document.getElementById('direccion').value.trim();

  // VALIDAR CARRITO
  if (carrito.length === 0) {
    mostrarMensaje(
      'Agrega al menos un producto antes de registrar el pedido.',
      false
    );
    return;
  }

  // VALIDAR CLIENTE
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]{3,30}$/.test(cliente)) {
    mostrarMensaje(
      'Escribe un cliente de 3 a 30 caracteres.',
      false
    );
    return;
  }

  // VALIDAR ENTREGA
  if (!entrega) {
    mostrarMensaje(
      'Selecciona una modalidad de entrega.',
      false
    );
    return;
  }

  // VALIDAR ENTREGA A DOMICILIO
  if (entrega === 'Entrega a Domicilio') {

    if (!['Efectivo', 'Yape', 'Plin'].includes(metodoPago)) {
      mostrarMensaje(
        'Selecciona un método de pago.',
        false
      );
      return;
    }

    if (!/^[0-9]{9}$/.test(telefono)) {
      mostrarMensaje(
        'Ingresa un número de teléfono válido de 9 dígitos.',
        false
      );
      return;
    }

    if (ubicacion === '') {
      mostrarMensaje(
        'Ingresa departamento, ciudad y distrito.',
        false
      );
      return;
    }

    const partes = ubicacion.split('-').map(p => p.trim());

    if (
      partes.length !== 3 ||
      partes.some(p => p.length === 0)
    ) {
      mostrarMensaje(
        'Escribe la ubicación así: Lima - Lima - Breña.',
        false
      );
      return;
    }

    // NUEVO: VALIDAR DIRECCIÓN DE ENTREGA
    if (direccion.length < 5 || direccion.length > 150) {
      mostrarMensaje(
        'Ingresa una dirección de entrega válida (mínimo 5 caracteres).',
        false
      );
      return;
    }
  }

  // VALIDAR CONFIRMACIÓN
  if (!consentimiento) {
    mostrarMensaje(
      'Debes confirmar tu pedido antes de continuar.',
      false
    );
    return;
  }

  // GENERAR CÓDIGO
  const codigo =
    'PED-' + String(pedidos.length + 1).padStart(3, '0');

  // GUARDAR PEDIDO
  pedidos.push({
    codigo,
    cliente,
    entrega,

    metodoPago: entrega === 'Entrega a Domicilio'
      ? metodoPago
      : 'No especificado',

    telefono: entrega === 'Entrega a Domicilio'
      ? telefono
      : '',

    ubicacion: entrega === 'Entrega a Domicilio'
      ? ubicacion
      : '',

    // NUEVO: GUARDAR DIRECCIÓN
    direccion: entrega === 'Entrega a Domicilio'
      ? direccion
      : '',

    productos: carrito.map(p => ({
      nombre: p.nombre,
      cantidad: p.cantidad
    })),

    total: calcularTotal(),
    estado: 'Pendiente'
  });

  // LIMPIAR CARRITO Y FORMULARIO
  carrito = [];

  mostrarCarrito();
  mostrarPedidos();

  document.getElementById('form-pedido').reset();

  // OCULTAR CAMPOS DESPUÉS DEL REGISTRO
  mostrarCamposDomicilio();

  mostrarMensaje(
    '¡Pedido registrado! Código: ' + codigo,
    true
  );
}

// MOSTRAR PEDIDOS REGISTRADOS
function mostrarPedidos() {
  const contenedor =
    document.getElementById('pedidos-registrados');

  contenedor.innerHTML = '';

  if (!pedidos.length) {
    contenedor.textContent = 'Aún no hay pedidos.';
    return;
  }

  pedidos.forEach(pedido => {
    const bloque = document.createElement('div');
    bloque.className = 'border-bottom py-3';

    const titulo = document.createElement('strong');
    titulo.textContent =
      pedido.codigo + ' · ' +
      pedido.cliente + ' · ' +
      soles(pedido.total);

    const detalle = document.createElement('p');
    detalle.className = 'mb-1';

    detalle.textContent = pedido.productos
      .map(p => p.nombre + ' x' + p.cantidad)
      .join(', ');

    const estado = document.createElement('p');
    estado.className = 'mb-1';
    estado.textContent =
      pedido.entrega + ' · Estado: ' + pedido.estado;

    bloque.append(titulo, detalle, estado);

    // MOSTRAR DATOS DE ENTREGA A DOMICILIO
    if (pedido.entrega === 'Entrega a Domicilio') {

      const pago = document.createElement('p');
      pago.className = 'mb-1';
      pago.textContent =
        'Método de pago: ' + pedido.metodoPago;

      const telefono = document.createElement('p');
      telefono.className = 'mb-1';
      telefono.textContent =
        'Teléfono: ' + pedido.telefono;

      const ubicacion = document.createElement('p');
      ubicacion.className = 'mb-1';
      ubicacion.textContent =
        'Ubicación: ' + pedido.ubicacion;

      // NUEVO: MOSTRAR DIRECCIÓN
      const direccion = document.createElement('p');
      direccion.className = 'mb-1';
      direccion.textContent =
        'Dirección de entrega: ' + pedido.direccion;

      bloque.append(pago, telefono, ubicacion, direccion);
    }

    contenedor.appendChild(bloque);
  });
}

// EVENTO: AGREGAR PRODUCTOS
document.getElementById('productos')
  .addEventListener('click', evento => {

    const boton = evento.target.closest('button.agregar');

    if (boton) {
      agregarProducto(Number(boton.dataset.id));
    }
  });

// EVENTO: VACIAR CARRITO
document.getElementById('vaciar')
  .addEventListener('click', () => {
    carrito = [];
    mostrarCarrito();
  });

// EVENTO: CAMBIAR MODALIDAD DE ENTREGA
document.getElementById('entrega')
  .addEventListener('change', mostrarCamposDomicilio);

// EVENTO: REGISTRAR PEDIDO
document.getElementById('form-pedido')
  .addEventListener('submit', registrarPedido);

// INICIAR PÁGINA
mostrarCatalogo();
mostrarCarrito();
mostrarPedidos();
mostrarCamposDomicilio();