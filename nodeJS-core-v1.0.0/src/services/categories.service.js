const create = async (data) => {
  const { NAME_CATEGORIES_, ID_COMPANY } = data;
  const [result] = await db.query(
    `INSERT INTO categories (NAME_CATEGORIES_, ID_COMPANY) VALUES (?, ?)`,
    [NAME_CATEGORIES_, ID_COMPANY]
  );
  return result.insertId;
};

const getAll = async (companyId) => {
  // Nếu có truyền companyId thì lấy theo công ty đó, không thì lấy hết
  let query = `SELECT * FROM categories`;
  let params = [];
  if (companyId) {
    query += ` WHERE ID_COMPANY = ?`;
    params.push(companyId);
  }
  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM categories WHERE ID_CATEGORIES_ = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const { NAME_CATEGORIES_, ID_COMPANY } = data;
  const [result] = await db.query(
    `UPDATE categories SET NAME_CATEGORIES_ = ?, ID_COMPANY = ? WHERE ID_CATEGORIES_ = ?`,
    [NAME_CATEGORIES_, ID_COMPANY, id]
  );
  return result.affectedRows > 0;
};

const deleteCategory = async (id) => {
  const [result] = await db.query(
    `DELETE FROM categories WHERE ID_CATEGORIES_ = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCategory,
};
