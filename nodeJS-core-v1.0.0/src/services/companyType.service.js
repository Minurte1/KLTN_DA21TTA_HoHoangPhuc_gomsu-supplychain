const db = require("../config/database");

// Tạo company_type
const createCompanyType = async ({ NAME_COMPANY_TYPE, ROUTER_COMPANY }) => {
  const [result] = await db.query(
    "INSERT INTO company_types (NAME_COMPANY_TYPE ,ROUTER_COMPANY) VALUES (?,?)",
    [NAME_COMPANY_TYPE, ROUTER_COMPANY]
  );
  return result.insertId;
};

// Lấy tất cả company_types
const getAllCompanyTypes = async () => {
  const [rows] = await db.query("SELECT * FROM company_types");
  return rows;
};

// Lấy company_type theo ID
const getCompanyTypeById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM company_types WHERE ID_COMPANY_TYPE = ?",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Cập nhật company_type
const updateCompanyType = async (id, { NAME_COMPANY_TYPE, ROUTER_COMPANY }) => {
  const [result] = await db.query(
    "UPDATE company_types SET NAME_COMPANY_TYPE = ? ROUTER_COMPANY =? WHERE ID_COMPANY_TYPE = ?",
    [NAME_COMPANY_TYPE, ROUTER_COMPANY, id]
  );
  return result.affectedRows > 0;
};

// Xóa company_type
const deleteCompanyType = async (id) => {
  const [result] = await db.query(
    "DELETE FROM company_types WHERE ID_COMPANY_TYPE = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createCompanyType,
  getAllCompanyTypes,
  getCompanyTypeById,
  updateCompanyType,
  deleteCompanyType,
};
