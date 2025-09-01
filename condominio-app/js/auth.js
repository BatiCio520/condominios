// auth.js
export const ROLES = ["admin", "conserje", "directiva", "residente"];

export async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const session = {
  save({ token, user }) { localStorage.setItem("auth", JSON.stringify({ token, user })); },
  load() { const raw = localStorage.getItem("auth"); return raw ? JSON.parse(raw) : null; },
  clear() { localStorage.removeItem("auth"); },
  isExpired(token) {
    try {
      const parts = atob(token).split(".");
      const expMs = parseInt(parts[2], 10);
      return Date.now() > expMs;
    } catch { return true; }
  },
  hasRole(required) {
    const s = session.load(); if (!s) return false;
    return s.user?.role === required || (Array.isArray(required) && required.includes(s.user?.role));
  }
};
