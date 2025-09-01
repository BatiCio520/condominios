let currentRole = null;

document.getElementById("formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value.trim();
  const role = document.getElementById("role").value;

  if (!user || !role) {
    document.getElementById("errorMsg").classList.remove("hidden");
    return;
  }

  // Simulación login exitoso
  currentRole = role;
  document.getElementById("welcomeMsg").innerText = `Has iniciado sesión como ${role}`;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("menu").classList.remove("hidden");

  configurarMenu(role);
});

// Configuración dinámica del menú según rol
function configurarMenu(role) {
  const botones = document.querySelectorAll("nav button[data-view]");
  botones.forEach(b => b.style.display = "inline-block");

  if (role === "residente") {
    ocultar(["reportes"]);
  } else if (role === "conserje") {
    ocultar(["reportes"]);
  } else if (role === "directiva") {
    ocultar(["reservas"]);
  } else if (role === "admin") {
    // Admin ve todo
  }
}

function ocultar(vistas) {
  vistas.forEach(v => {
    document.querySelector(`nav button[data-view='${v}']`).style.display = "none";
  });
}

// Cambio de vista
document.querySelectorAll("nav button[data-view]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    mostrar(btn.dataset.view);
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

function mostrar(vista) {
  document.querySelectorAll(".vista").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(vista).classList.remove("hidden");
}

// Logout
document.getElementById("btnLogout").addEventListener("click", () => {
  currentRole = null;
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("menu").classList.add("hidden");
});
