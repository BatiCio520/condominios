// ui.js
import { validateForm, isEmail, minLength, isRequired, notPastDate, codePattern } from "./validators.js";
import { api } from "./api.mock.js";
import { session } from "./auth.js";

const $ = (sel) => document.querySelector(sel);
const content = () => $("#content");

export function renderDashboard() {
  content().innerHTML = `
    <section class="card">
      <h2>Bienvenido/a</h2>
      <p>Selecciona una sección del menú para gestionar el condominio.</p>
      <div class="chips">
        <span class="chip">Pagos en línea</span>
        <span class="chip">Reservas</span>
        <span class="chip">Reportes</span>
        <span class="chip">Abastecimiento</span>
      </div>
    </section>
  `;
}

export async function renderGastos() {
  const s = session.load();
  if (!s) return;
  const esResidente = s.user.role === "residente";
  if (!esResidente) {
    content().innerHTML = `<section class="card"><h2>Gastos</h2><p class="muted">Vista rápida (en demo solo datos del residente).</p></section>`;
    return;
  }
  const gastos = await api.getGastos(s.user.id);
  const rows = gastos.map(g => `
    <tr>
      <td>${g.mes}</td>
      <td>$${g.monto.toLocaleString("es-CL")}</td>
      <td><span class="badge ${g.pagado ? "ok" : "warn"}">${g.pagado ? "Pagado" : "Pendiente"}</span></td>
      <td>${g.multa ? "$"+g.multa.toLocaleString("es-CL") : "-"}</td>
      <td>${g.pagado ? "" : `<button data-id="${g.id}" class="btnPagar">Pagar</button>`}</td>
    </tr>`).join("");

  content().innerHTML = `
    <section class="card">
      <h2>Mis Gastos</h2>
      <table class="table">
        <thead><tr><th>Mes</th><th>Monto</th><th>Estado</th><th>Multa</th><th>Acción</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">Sin registros</td></tr>`}</tbody>
      </table>
    </section>
  `;

  content().querySelectorAll(".btnPagar").forEach(btn => {
    btn.addEventListener("click", async () => {
      await api.pagarGasto(parseInt(btn.dataset.id, 10));
      renderGastos();
      alert("Redirigiendo al proveedor de pago (demo)...");
    });
  });
}

export function renderReservas() {
  const today = new Date().toISOString().slice(0,10);
  content().innerHTML = `
    <section class="card">
      <h2>Reservas de Áreas Comunes</h2>
      <form id="formReserva" class="row" novalidate>
        <div class="col-6">
          <label>Tipo de espacio
            <select name="tipo" required>
              <option value="">Seleccionar</option>
              <option value="Quincho">Quincho</option>
              <option value="Estacionamiento">Estacionamiento</option>
              <option value="Multicancha">Multicancha</option>
              <option value="Sala de Eventos">Sala de Eventos</option>
            </select>
          </label>
        </div>
        <div class="col-6">
          <label>Fecha
            <input type="date" name="fecha" min="${today}" required />
          </label>
        </div>
        <div class="col-12">
          <button type="submit">Reservar</button>
          <span id="reservaMsg" class="error"></span>
        </div>
      </form>
      <div id="listaReservas" style="margin-top:14px;"></div>
    </section>
  `;

  $("#formReserva").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const rules = {
      tipo: [(v)=> isRequired(v) || "Selecciona un tipo"],
      fecha: [(v)=> isRequired(v) || "Fecha requerida", (v)=> notPastDate(v) || "No se permiten fechas pasadas"]
    };
    const errs = validateForm(f, rules);
    const out = $("#reservaMsg");
    if (Object.keys(errs).length) { out.textContent = Object.values(errs)[0]; return; }
    out.textContent = "";
    const s = session.load();
    await api.crearReserva({ tipo: f.tipo.value, fechaISO: f.fecha.value, residenteId: s.user.id });
    await listarReservas();
    alert("Reserva registrada. Debe validarse con el pago previo a la fecha.");
    f.reset();
  });

  listarReservas();
}

async function listarReservas() {
  const data = await api.listarReservas();
  $("#listaReservas").innerHTML = `
    <table class="table">
      <thead><tr><th>ID</th><th>Tipo</th><th>Fecha</th><th>Pago</th></tr></thead>
      <tbody>
        ${data.map(r=>`
          <tr>
            <td>${r.id}</td><td>${r.tipo}</td><td>${r.fechaISO}</td>
            <td><span class="badge ${r.pagado? "ok":"warn"}">${r.pagado? "Validado":"Pendiente"}</span></td>
          </tr>`).join("") || `<tr><td colspan="4">Sin reservas</td></tr>`}
      </tbody>
    </table>
  `;
}

export function renderProductos() {
  content().innerHTML = `
    <section class="card">
      <h2>Abastecimiento</h2>
      <p class="muted">Buscar por <strong>código de insumo</strong> o <strong>código de paquete</strong>.</p>
      <div class="searchbar">
        <input id="txtCodigo" placeholder="INS-001 o PAQ-100" maxlength="20" />
        <button id="btnBuscar">Buscar</button>
      </div>
      <div id="resultado" style="margin-top:14px;"></div>
    </section>
  `;

  $("#btnBuscar").addEventListener("click", async () => {
    const code = $("#txtCodigo").value.trim().toUpperCase();
    if (!codePattern(code)) { $("#resultado").innerHTML = `<p class="error">Código inválido (usa A-Z, 0-9 y -)</p>`; return; }
    const res = await (await import("./api.mock.js")).api.buscarPorCodigo(code);
    if (res.producto) {
      $("#resultado").innerHTML = `
        <div class="card">
          <h3>Producto</h3>
          <p><strong>${res.producto.id}</strong> — ${res.producto.nombre}</p>
        </div>`;
    } else if (res.paquete) {
      $("#resultado").innerHTML = `
        <div class="card">
          <h3>Paquete</h3>
          <p><strong>${res.paquete.id}</strong> — ${res.paquete.nombre}</p>
          <p>Contiene: ${res.paquete.contiene.join(", ")}</p>
        </div>`;
    } else {
      $("#resultado").innerHTML = `<p>No se encontraron resultados.</p>`;
    }
  });
}

export function renderReportes() {
  content().innerHTML = `
    <section class="card">
      <h2>Reportes (demo)</h2>
      <ul>
        <li>Morosidad por periodo</li>
        <li>Uso de espacios por tipo</li>
        <li>Pagos validados vs. pendientes</li>
      </ul>
      <p class="muted">En producción, estos datos vendrían de consultas agregadas en Oracle.</p>
    </section>
  `;
}
