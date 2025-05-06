const db = require("../config/database");

const create = async (data) => {
  const { ID_PRODUCT, ID_USERS } = data;
  const [result] = await db.query(
    `INSERT INTO cart (ID_PRODUCT, ID_USERS) VALUES (?, ?)`,
    [ID_PRODUCT, ID_USERS]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM cart`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM cart WHERE ID_CART = ?`, [id]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const { ID_PRODUCT, ID_USERS } = data;
  const [result] = await db.query(
    `UPDATE cart SET ID_PRODUCT = ?, ID_USERS = ? WHERE ID_CART = ?`,
    [ID_PRODUCT, ID_USERS, id]
  );
  return result.affectedRows > 0;
};

const deleteCart = async (id) => {
  const [result] = await db.query(`DELETE FROM cart WHERE ID_CART = ?`, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCart,
};
