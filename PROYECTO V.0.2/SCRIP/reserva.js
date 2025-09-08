// Datos de ejemplo
const reservas = [
    { nombre: "Pepito Lopez", espacio: "Quincho", fecha: "2025-09-10", hora: "15:00", costo: 50000, estado: "Confirmado" },
    { nombre: "Luis Patricio", espacio: "Multicancha", fecha: "2025-09-12", hora: "10:00", costo: 0, estado: "Pendiente" },
    { nombre: "Jose Ignacio", espacio: "Sala de Eventos", fecha: "2025-09-15", hora: "18:00", costo: 100000, estado: "Confirmado" },
    { nombre: "Marcelo Burgues", espacio: "Estacionamiento", fecha: "2025-09-20", hora: "08:00", costo: 0, estado: "Cancelado" }
];

// Función para mostrar las reservas en la tabla
function mostrarReservas() {
    const tbody = document.querySelector("#tabla-reservas tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de llenarla

    reservas.forEach(reserva => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${reserva.nombre}</td>
            <td>${reserva.espacio}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td>$${reserva.costo.toLocaleString()}</td>
            <td class="${reserva.estado.toLowerCase()}">${reserva.estado}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Manejar el evento de envío del formulario
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fecha = document.getElementById("fecha-reserva").value;
    const hora = document.getElementById("hora-reserva").value;
    const espacio = document.querySelector('input[name="reserva[]"]:checked')?.value;
    const costoInput = document.querySelector(`#pago-${espacio}`); // Capturar el campo de monto asociado
    const costo = costoInput ? parseFloat(costoInput.value) || 0 : 0; // Convertir el valor a número
    const estado = "Pendiente";

    if (!espacio) {
        alert("Debe seleccionar un espacio para reservar.");
        return;
    }

    if (!hora) {
        alert("Debe seleccionar una hora para la reserva.");
        return;
    }

    agregarReserva(fecha, hora, espacio, costo, estado);
    this.reset();
});

// Función para agregar una nueva reserva
function agregarReserva(fecha, hora, espacio, costo, estado) {
    if (!fecha || !hora || !espacio || !estado) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (isNaN(costo) || costo < 0) {
        alert("El costo debe ser un número positivo o 0.");
        return;
    }

    reservas.push({
        nombre: "Usuario",
        espacio: espacio,
        fecha: fecha,
        hora: hora,
        costo: costo, // Asegurarse de que el costo sea un número
        estado: estado
    });

    mostrarReservas();
    alert("Reserva agregada correctamente.");
}

// Manejar el evento de selección de los checkboxes
document.querySelectorAll('input[name="reserva[]"]').forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        // Desmarcar todos los checkboxes excepto el actual
        document.querySelectorAll('input[name="reserva[]"]').forEach(cb => {
            if (cb !== this) cb.checked = false;
        });

        // Mostrar u ocultar el menú de pago asociado
        const pagoInput = document.querySelector(`#pago-${this.value}`);
        document.querySelectorAll('input[name^="pago-"]').forEach(input => {
            input.style.display = "none"; // Ocultar todos los menús de pago
        });

        if (this.checked && pagoInput) {
            pagoInput.style.display = "block"; // Mostrar el menú de pago asociado
        }
    });
});

// Mostrar las reservas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarReservas();

    // Ocultar todos los menús de pago al cargar la página
    document.querySelectorAll('input[name^="pago-"]').forEach(input => {
        input.style.display = "none";
    });
});

