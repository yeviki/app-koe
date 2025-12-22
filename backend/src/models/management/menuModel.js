const db = require("../../config/db");

module.exports = {
  getAll() {
    return db.query(`
      SELECT id_menu, title_menu, url_menu, icon_menu, order_menu, parent_id, component 
      FROM syst_menu 
      ORDER BY id_menu ASC
    `);
  },

  getById(id) {
    return db.query("SELECT * FROM syst_menu WHERE id_menu = ?", [id]);
  },

  create({ title_menu, url_menu, icon_menu, order_menu, parent_id, component }) {
    return db.query(
      `INSERT INTO syst_menu 
        (title_menu, url_menu, icon_menu, order_menu, parent_id, component)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title_menu, url_menu, icon_menu, order_menu, parent_id, component || null]
    );
  },

  update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      if (key === "id_menu") continue; // ⛔ cegah update id_menu
      if (key === "parent_id" && data[key] === "") {
        fields.push("parent_id = NULL");
        continue;
      }
      fields.push(`${key}=?`);
      values.push(data[key]);
    }

    values.push(id);

    const sql = `UPDATE syst_menu SET ${fields.join(", ")} WHERE id_menu = ?`;

    return db.query(sql, values);
  },

  delete(id) {
    return db.query("DELETE FROM syst_menu WHERE id_menu = ?", [id]);
  },

  checkDuplicate(title_menu, url_menu) {
    return db.query(
      `SELECT id_menu, title_menu, url_menu 
       FROM syst_menu 
       WHERE title_menu = ? OR url_menu = ?`,
      [title_menu, url_menu]
    );
  },

  checkDuplicateOnUpdate(id, title_menu, url_menu) {
    return db.query(
      `SELECT id_menu, title_menu, url_menu 
       FROM syst_menu 
       WHERE (title_menu = ? OR url_menu = ?)
       AND id_menu != ?`,
      [title_menu, url_menu, id]
    );
  }
};
