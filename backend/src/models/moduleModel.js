// models/rolesModel.js
const db = require("../config/db");

module.exports = {
  getAll() {
    return db.query("SELECT id, module_name, label_module, id_status FROM syst_module ORDER BY id ASC");
  },

  getById(id) {
    return db.execute("SELECT * FROM syst_module WHERE id = ?", [id]);
  },

  getByRoles(module_name) {
    return db.query("SELECT * FROM syst_module WHERE module_name = ?", [module_name]);
  },

  create(data) {
    return db.query(
      "INSERT INTO syst_module (module_name, label_module, id_status) VALUES (?, ?, ?)",
      [data.module_name, data.label_module, data.id_status]
    );
  },

  update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key}=?`);
      values.push(data[key]);
    }

    values.push(id);

    const sql = `UPDATE syst_module SET ${fields.join(", ")} WHERE id=?`;
    return db.query(sql, values);
  },

  delete(id) {
    return db.query("DELETE FROM syst_module WHERE id=?", [id]);
  },

  checkDuplicate(module_name) {
    return db.query(
      "SELECT id, module_name FROM syst_module WHERE (module_name = ?)",
      [module_name]
    );
  },

  checkDuplicateOnUpdate(id, module_name) {
    return db.query(
      "SELECT id, module_name FROM syst_module WHERE (module_name = ?) AND id != ?",
      [module_name, id]
    );
  }
};
