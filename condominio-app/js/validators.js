// validators.js
export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
export const minLength = (v, n) => (v ?? "").length >= n;
export const isRequired = (v) => (v ?? "").toString().trim().length > 0;
export const isNumeric = (v) => /^-?\d+(\.\d+)?$/.test((v ?? "").toString());
export const codePattern = (v) => /^[A-Z0-9-]{3,20}$/.test((v ?? "").toUpperCase()); // código insumo/paquete
export const notPastDate = (value) => {
  const d = new Date(value); const today = new Date(); today.setHours(0,0,0,0);
  return !isNaN(d) && d >= today;
};

export function validateForm(form, rules) {
  // rules: { fieldName: [(val)=>true || "mensaje"], ... }
  const errors = {};
  Object.entries(rules).forEach(([name, validators]) => {
    const val = form[name]?.value ?? "";
    for (const rule of validators) {
      const res = rule(val);
      if (res !== true) { errors[name] = res; break; }
    }
  });
  return errors;
}
