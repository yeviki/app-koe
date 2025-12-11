// models/rolesModel.js
const db = require("../config/db");

module.exports = {
  getAll() {
    return db.query("SELECT id, roles_name FROM syst_roles ORDER BY id ASC");
  },

  getById(id) {
    return db.execute("SELECT * FROM syst_roles WHERE id = ?", [id]);
  },

  getByRoles(roles_name) {
    return db.query("SELECT * FROM syst_roles WHERE roles_name = ?", [roles_name]);
  },

  create(data) {
    return db.query(
      "INSERT INTO syst_roles (roles_name) VALUES (?)",
      [data.roles_name]
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

    const sql = `UPDATE syst_roles SET ${fields.join(", ")} WHERE id=?`;
    return db.query(sql, values);
  },

  delete(id) {
    return db.query("DELETE FROM syst_roles WHERE id=?", [id]);
  },

  checkDuplicate(roles_name) {
    return db.query(
      "SELECT id, roles_name FROM syst_roles WHERE (roles_name = ?)",
      [roles_name]
    );
  },

  checkDuplicateOnUpdate(id, roles_name) {
    return db.query(
      "SELECT id, roles_name FROM syst_roles WHERE (roles_name = ?) AND id != ?",
      [roles_name, id]
    );
  },

  // ------------------------------------------------ //
  // Ambil menu apa saja yang dimiliki role ini
  getAllMenu() {
    return db.query(`
      SELECT id_menu, title_menu, url_menu, icon_menu, order_menu, parent_id 
      FROM syst_menu 
      ORDER BY id_menu ASC
    `);
  },

  getRoleMenus(roles_id) {
    return db.query(
      "SELECT menu_id FROM syst_roles_menu WHERE id_status = 1 AND roles_id = ?",
      [roles_id]
    );
  },

  insertRoleMenu(roles_id, menu_id) {
    return db.query(
      "INSERT INTO syst_roles_menu (roles_id, menu_id, id_status) VALUES (?, ?, 1)",
      [roles_id, menu_id]
    );
  },

  updateRoleMenuStatus(roles_id, menu_id, status) {
    return db.query(
      "UPDATE syst_roles_menu SET id_status = ? WHERE roles_id = ? AND menu_id = ?",
      [status, roles_id, menu_id]
    );
  },

  getAllRoleMenus(roles_id) {
    return db.query(
      "SELECT menu_id FROM syst_roles_menu WHERE roles_id = ?",
      [roles_id]
    );
  },

  // Hapus semua menu pada role ini
  deleteRoleMenus(roles_id) {
    return db.query(
      "DELETE FROM syst_roles_menu WHERE roles_id = ?",
      [roles_id]
    );
  },

  // Simpan menu baru (pivot)
  addRoleMenus(roles_id, menu_ids) {
    if (menu_ids.length === 0) return Promise.resolve([true]);

    const values = menu_ids.map(menu_id => [roles_id, menu_id]);

    return db.query(
      "INSERT INTO syst_roles_menu (roles_id, menu_id) VALUES ?",
      [values]
    );
  },
  // Tutup
  // ------------------------------------------------ //


  // ------------------------------------------------ //
  // models/rolesModel.js
  // Ambil menu apa saja yang dimiliki role ini
  // ------------------------------------------------ //
  getAllPermissionWithModuleControl(roleId) {
    return db.query(`
      SELECT 
        p.id, 
        p.roles_id, 
        p.module_id, 
        p.control_id, 
        p.id_status,
        m.module_name, 
        c.control_name,
        c.label_control
      FROM syst_roles_permissions p
      LEFT JOIN syst_module m ON p.module_id = m.id
      LEFT JOIN syst_control c ON p.control_id = c.id
      WHERE p.roles_id = ?
      ORDER BY p.module_id ASC, p.control_id ASC
    `, [roleId]);
  },

  updatePermissionStatus(id, id_status) {
    return db.query(
      `UPDATE syst_roles_permissions 
      SET id_status = ? 
      WHERE id = ?`,
      [id_status, id]
    ).then(([result]) => result);
  },

  deletePermRoles(id) {
    return db.query("DELETE FROM syst_roles_permissions WHERE id=?", [id]);
  },

  // =========================== //
  //  Simpan PERMISSION baru
  // =========================== //
  savePermission(roles_id, module_id, controlIds, id_status) {
    if (!Array.isArray(controlIds) || controlIds.length === 0) {
      return Promise.resolve([true]);
    }

    const sql = `
      INSERT INTO syst_roles_permissions
      (roles_id, module_id, control_id, id_status)
      VALUES ?
    `;

    const values = controlIds.map(control_id => [
      roles_id,
      module_id,
      control_id,
      id_status
    ]);

    return db.query(sql, [values]);
  },

  // Ambil control_id yang sudah ada untuk roles_id + module_id
  getExistingControls(roles_id, module_id) {
    const sql = `
      SELECT control_id 
      FROM syst_roles_permissions
      WHERE roles_id = ? AND module_id = ?
    `;
    return db.query(sql, [roles_id, module_id])
      .then(([rows]) => rows.map(r => r.control_id));
  }



};
