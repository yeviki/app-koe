module.exports = {
  isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isStrongPassword(pw) {
    return pw && pw.length >= 6;
  },

  sanitize(str) {
    return String(str).trim();
  }
};
