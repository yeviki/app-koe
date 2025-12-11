// utils/validator.js
export function validate(data, rules) {
  const errors = {};

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {

      /* ------------------------------
       * 1. Required
       * ------------------------------ */
      if (rule === "required") {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === false
        ) {
          errors[field] = "Field wajib diisi";
          break;
        }
      }

      /* ------------------------------
       * 2. Required True (checkbox)
       * ------------------------------ */
      if (rule === "required_true") {
        if (!value) {
          errors[field] = "Harus dicentang";
          break;
        }
      }

      /* ------------------------------
       * 3. Email
       * ------------------------------ */
      if (rule === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors[field] = "Format email tidak valid";
          break;
        }
      }

      /* ------------------------------
       * 4. Min length (min:6)
       *    Catatan penting:
       *    - rule min TIDAK berjalan kalau value kosong
       *    - berlaku hanya jika value != "" dan bukan null
       * ------------------------------ */
      if (rule.startsWith("min:")) {
        const min = parseInt(rule.split(":")[1]);

        // Jika value kosong → SKIP (kecuali ada rule required)
        if (value && value.length < min) {
          errors[field] = `Minimal ${min} karakter`;
          break;
        }
      }

      /* ------------------------------
       * 5. File wajib
       * ------------------------------ */
      if (rule === "required_file") {
        if (!value) {
          errors[field] = "File wajib diupload";
          break;
        }
      }

      /* ------------------------------
       * 6. File size max (max:2mb)
       * ------------------------------ */
      if (rule.startsWith("max:")) {
        const size = parseInt(rule.split(":")[1]);
        const sizeMb = size * 1024 * 1024;
        if (value && value.size > sizeMb) {
          errors[field] = `Ukuran file maksimal ${size}MB`;
          break;
        }
      }
    }
  }

  return errors;
}
