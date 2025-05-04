const db = require("../config/database"); // KHÔNG destructure

// Tạo role
const createRole = async ({ NAME_ROLE, LIST_PERMISSION, CODE_NAME }) => {
  const IS_DELETE = 0;
  const [result] = await db.query(
    "INSERT INTO role (NAME_ROLE, LIST_PERMISION, CODE_NAME,IS_DELETE) VALUES (?, ?, ?,?)",
    [NAME_ROLE, LIST_PERMISSION, CODE_NAME, IS_DELETE]
  );
  return result.insertId;
};

// Lấy tất cả role chưa bị xóa mềm
const getAllRoles = async () => {
  const [rows] = await db.query("SELECT * FROM role WHERE IS_DELETE = FALSE");
  console.log("rows", rows);
  const result = rows.map((role) => ({
    ...role,
    LIST_PERMISION: role.LIST_PERMISION ? JSON.parse(role.LIST_PERMISION) : [],
  }));

  return result;
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
  try {
    // Thử xóa thẳng (hard delete)
    const [result] = await db.query(
      `DELETE FROM role WHERE ID_ROLE = ? AND IS_DELETE = FALSE`,
      [id]
    );

    // Nếu xóa thành công, trả về true
    if (result.affectedRows > 0) {
      return true;
    }

    // Nếu không xóa được, có thể role không tồn tại hoặc đã bị xóa mềm trước đó
    return false;
  } catch (error) {
    // Nếu lỗi do vi phạm khóa ngoại (foreign key constraint)
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
      // Thực hiện xóa mềm (soft delete)
      const [softDeleteResult] = await db.query(
        `UPDATE role SET IS_DELETE = TRUE WHERE ID_ROLE = ? AND IS_DELETE = FALSE`,
        [id]
      );
      return softDeleteResult.affectedRows > 0;
    }
    // Nếu lỗi khác, ném lỗi ra ngoài
    throw error;
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
