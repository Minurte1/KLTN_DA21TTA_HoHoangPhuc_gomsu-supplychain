const db = require("../config/database");

const create = async (data) => {
  const { NAME_CATEGORIES_ } = data;
  const [result] = await db.query(
    `INSERT INTO categories (NAME_CATEGORIES_) VALUES (?)`,
    [NAME_CATEGORIES_]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM categories`);
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
  const { NAME_CATEGORIES_ } = data;
  const [result] = await db.query(
    `UPDATE categories SET NAME_CATEGORIES_ = ? WHERE ID_CATEGORIES_ = ?`,
    [NAME_CATEGORIES_, id]
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
