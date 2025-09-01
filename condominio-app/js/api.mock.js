// api.mock.js — simula endpoints REST y datos en memoria
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const db = {
  users: [
    { id: 1, email: "admin@condo.cl", passHash: "demo", role: "admin", nombre: "Admin Uno" },
    { id: 2, email: "conserje@condo.cl", passHash: "demo", role: "conserje", nombre: "Conserje" },
    { id: 3, email: "directiva@condo.cl", passHash: "demo", role: "directiva", nombre: "Directiva" },
    { id: 4, email: "residente@condo.cl", passHash: "demo", role: "residente", nombre: "Residente" },
  ],
  gastos: [
    { id: 101, residenteId: 4, mes: "2025-08", monto: 65000, pagado: false, multa: 0 },
    { id: 102, residenteId: 4, mes: "2025-07", monto: 65000, pagado: true, multa: 0 },
  ],
  reservas: [
    // { id, tipo, fechaISO, residenteId, pagado }
  ],
  // Abastecimiento: productos y paquetes
  productos: [
    { id: "INS-001", nombre: "Detergente Piscina 20L", tipo: "producto" },
    { id: "INS-002", nombre: "Foco LED 30W", tipo: "producto" },
  ],
  paquetes: [
    { id: "PAQ-100", nombre: "Kit Mantención Piscina", contiene: ["INS-001"] },
    { id: "PAQ-200", nombre: "Kit Iluminación Exterior", contiene: ["INS-002"] },
  ],
};

export const api = {
  async login({ email, passHash, role }) {
    await delay(300);
    const user = db.users.find(u => u.email === email && u.passHash === passHash && u.role === role);
    if (!user) throw new Error("Credenciales inválidas");
    // Token simulado (NO producción). En real: JWT desde backend.
    return { token: btoa(`${user.id}.${user.role}.${Date.now() + 1000 * 60 * 30}`), user };
  },

  async getGastos(residenteId) { await delay(200); return db.gastos.filter(g => g.residenteId === residenteId); },
  async pagarGasto(gastoId) { await delay(200); const g = db.gastos.find(x=>x.id===gastoId); if (g) g.pagado = true; return g; },

  async crearReserva({ tipo, fechaISO, residenteId }) {
    await delay(200);
    const id = crypto.getRandomValues(new Uint32Array(1))[0];
    const r = { id, tipo, fechaISO, residenteId, pagado: false };
    db.reservas.push(r); return r;
  },
  async listarReservas() { await delay(150); return db.reservas; },

  // Abastecimiento (búsqueda por código)
  async buscarPorCodigo(codigo) {
    await delay(150);
    const code = (codigo ?? "").toUpperCase();
    const prod = db.productos.find(p => p.id === code);
    const paq  = db.paquetes.find(p => p.id === code);
    return { producto: prod ?? null, paquete: paq ?? null };
  },
};
