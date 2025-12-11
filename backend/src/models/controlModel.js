// models/rolesModel.js
const db = require("../config/db");

module.exports = {
  getAll() {
    return db.query(`SELECT sc.id, 
                    sc.control_name, 
                    sc.label_control, 
                    sc.id_status,
                    st.status_name 
                    FROM syst_control sc
                    LEFT JOIN syst_status st ON sc.id_status = st.id
                    ORDER BY sc.id ASC`);
  },

  create(data) {
    return db.query(
      "INSERT INTO syst_control (control_name, label_control, id_status) VALUES (?, ?, ?)",
      [data.control_name, data.label_control, data.id_status]
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

    const sql = `UPDATE syst_control SET ${fields.join(", ")} WHERE id=?`;
    return db.query(sql, values);
  },

  delete(id) {
    return db.query("DELETE FROM syst_control WHERE id=?", [id]);
  },

  checkDuplicate(control_name) {
    return db.query(
      "SELECT id, control_name FROM syst_control WHERE (control_name = ?)",
      [control_name]
    );
  },

  checkDuplicateOnUpdate(id, control_name) {
    return db.query(
      "SELECT id, control_name FROM syst_control WHERE (control_name = ?) AND id != ?",
      [control_name, id]
    );
  }

};
