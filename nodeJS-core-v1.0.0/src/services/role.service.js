const db = require("../config/database"); // KHÔNG destructure

// Tạo role
const createRole = async ({ NAME_ROLE, LIST_PERMISSION, CODE_NAME }) => {
  const [result] = await db.query(
    "INSERT INTO role (NAME_ROLE, LIST_PERMISSION, CODE_NAME) VALUES (?, ?, ?)",
    [NAME_ROLE, JSON.stringify(LIST_PERMISSION), CODE_NAME]
  );
  return result.insertId;
};

// Lấy tất cả role chưa bị xóa mềm
const getAllRoles = async () => {
  const [rows] = await db.query("SELECT * FROM role WHERE IS_DELETE = FALSE");
  return rows.map((role) => ({
    ...role,
    LIST_PERMISSION: JSON.parse(role.LIST_PERMISSION),
  }));
};

// Lấy role theo ID
const getRoleById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM role WHERE ID_ROLE = ? AND IS_DELETE = FALSE",
    [id]
  );
  if (rows.length === 0) return null;

  const role = rows[0];
  role.LIST_PERMISSION = JSON.parse(role.LIST_PERMISSION);
  return role;
};

// Cập nhật role
const updateRole = async (id, { NAME_ROLE, LIST_PERMISSION, CODE_NAME }) => {
  const [result] = await db.query(
    `UPDATE role SET NAME_ROLE = ?, LIST_PERMISSION = ?, CODE_NAME = ? WHERE ID_ROLE = ? AND IS_DELETE = FALSE`,
    [NAME_ROLE, JSON.stringify(LIST_PERMISSION), CODE_NAME, id]
  );
  return result.affectedRows > 0;
};

// Xóa mềm role
const deleteRole = async (id) => {
  const [result] = await db.query(
    `UPDATE role SET IS_DELETE = TRUE WHERE ID_ROLE = ? AND IS_DELETE = FALSE`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
