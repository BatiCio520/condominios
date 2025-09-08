// Datos de ejemplo
const gastos = [
    { nombre: "Pepito lopez", depto: "101", monto: 75000, estado: "Pagado" },
    { nombre: "luis patricio", depto: "102", monto: 82000, estado: "Pendiente" },
    { nombre: "jose ignacio", depto: "103", monto: 90000, estado: "Pendiente" },
    { nombre: "marcelo burgues", depto: "104", monto: 70000, estado: "Pagado" }
];

// Función para mostrar los gastos en la tabla
function mostrarGastos(lista) {
    const tbody = document.querySelector("#tabla-gastos tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

    let totalPagado = 0;
    let totalPendiente = 0;

    lista.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.depto}</td>
            <td>$${item.monto.toLocaleString()}</td>
            <td class="${item.estado.toLowerCase()}">${item.estado}</td>
        `;
        tbody.appendChild(fila);

        // Sumar al total según el estado
        if (item.estado === "Pagado") {
            totalPagado += item.monto;
        } else {
            totalPendiente += item.monto;
        }
    });

    // Mostrar totales
    document.getElementById("totales").textContent = `Total Pagado: $${totalPagado.toLocaleString()} | Total Pendiente: $${totalPendiente.toLocaleString()}`;

    // Mostrar mensaje de morosos
    if (totalPendiente > 0) {
        document.getElementById("mensaje").textContent = "Hay residentes con pagos pendientes.";
    } else {
        document.getElementById("mensaje").textContent = "Todos los residentes están al día con sus pagos.";
    }
}

// Función para agregar un nuevo gasto manualmente
function agregarGasto(nombre, depto, monto, estado) {
    // Validar que los datos no estén vacíos
    if (!nombre || !depto || !monto || !estado) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Validar que el monto sea un número positivo
    if (isNaN(monto) || monto <= 0) {
        alert("El monto debe ser un número positivo.");
        return;
    }

    // Agregar el nuevo gasto al arreglo
    gastos.push({
        nombre: nombre,
        depto: depto,
        monto: parseFloat(monto),
        estado: estado
    });

    // Actualizar la tabla
    mostrarTodos();
    alert("Gasto agregado correctamente.");
}

// Funciones de filtro
function mostrarTodos() {
    mostrarGastos(gastos);
}

function mostrarMorosos() {
    const morosos = gastos.filter(item => item.estado === "Pendiente");
    mostrarGastos(morosos);
}

function mostrarPagados() {
    const pagados = gastos.filter(item => item.estado === "Pagado");
    mostrarGastos(pagados);
}

// Mostrar todos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarTodos();

    // Vincular el evento submit del formulario
    const form = document.getElementById("form-agregar-gasto");
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar que la página se recargue

        // Capturar los valores del formulario
        const nombre = document.getElementById("nombre").value;
        const depto = document.getElementById("depto").value;
        const monto = document.getElementById("monto").value;
        const estado = document.getElementById("estado").value;

        // Llamar a la función para agregar el gasto
        agregarGasto(nombre, depto, monto, estado);

        // Limpiar el formulario
        form.reset();
    });
});

