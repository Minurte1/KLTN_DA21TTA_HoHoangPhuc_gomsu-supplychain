const { db } = require("../config/database");

const createRole = async ({ NAME_ROLE, LIST_PERMISSION, CODE_NAME }) => {
  const [result] = await db.query(
    "INSERT INTO roles (NAME_ROLE, LIST_PERMISSION, CODE_NAME) VALUES (?, ?, ?)",
    [NAME_ROLE, JSON.stringify(LIST_PERMISSION), CODE_NAME] // 👈 stringify để lưu
  );
  return result.insertId;
};

const getAllRoles = async () => {
  const [rows] = await db.query("SELECT * FROM roles WHERE IS_DELETE = FALSE");

  // 👇 parse lại LIST_PERMISSION từ chuỗi JSON về array
  return rows.map((role) => ({
    ...role,
    LIST_PERMISSION: JSON.parse(role.LIST_PERMISSION),
  }));
};

module.exports = {
  getAllRoles,
  createRole,
};
