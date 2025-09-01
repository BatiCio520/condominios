// app.js
import { sha256, session } from "./auth.js";
import { api } from "./api.mock.js";
import { isEmail, minLength, isRequired } from "./validators.js";
import { renderDashboard, renderGastos, renderReservas, renderProductos, renderReportes } from "./ui.js";

const $ = (sel) => document.querySelector(sel);

function setView(appMode) {
  $("#view-login").classList.toggle("hidden", appMode === "app");
  $("#view-app").classList.toggle("hidden", appMode !== "app");
  $("#nav").classList.toggle("hidden", appMode !== "app");
}

function mountMenu() {
  document.querySelectorAll("nav [data-view]").forEach(btn => {
    btn.addEventListener("click", () => route(btn.dataset.view));
  });
  $("#btnLogout").addEventListener("click", () => {
    session.clear();
    setView("login");
  });
}

function route(view) {
  if (!session.load()) { setView("login"); return; }
  switch (view) {
    case "dashboard": renderDashboard(); break;
    case "gastos": renderGastos(); break;
    case "reservas": renderReservas(); break;
    case "productos": renderProductos(); break;
    case "reportes": renderReportes(); break;
    default: renderDashboard();
  }
}

async function tryAutoLogin() {
  const s = session.load();
  if (s && !session.isExpired(s.token)) {
    setView("app");
    route("dashboard");
  } else {
    session.clear();
    setView("login");
  }
}

function mountLogin() {
  const f = $("#formLogin");
  const err = $("#loginError");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.classList.add("hidden"); err.textContent = "";

    const rules = {
      email: [(v)=> isRequired(v) || "Email requerido", (v)=> isEmail(v) || "Formato de email inválido"],
      password: [(v)=> isRequired(v) || "Contraseña requerida", (v)=> minLength(v,6) || "Mínimo 6 caracteres"],
      role: [(v)=> isRequired(v) || "Selecciona un rol"]
    };
    // Validación sencilla
    for (const [name, tests] of Object.entries(rules)) {
      const val = f[name].value;
      for (const t of tests) {
        const ok = t(val); if (ok !== true) { err.textContent = ok; err.classList.remove("hidden"); return; }
      }
    }

    try {
      const passHash = await sha256(f.password.value); // demo; en real, servidor valida/hashea
      const { token, user } = await api.login({ email: f.email.value, passHash, role: f.role.value });
      session.save({ token, user });
      setView("app");
      route("dashboard");
      f.reset();
    } catch (e2) {
      err.textContent = "Usuario/contraseña/rol incorrectos";
      err.classList.remove("hidden");
    }
  });
}

(function init() {
  mountMenu();
  mountLogin();
  tryAutoLogin();
})();
