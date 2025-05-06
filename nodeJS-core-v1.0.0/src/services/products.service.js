const db = require("../config/database");

const create = async (data) => {
  const {
    ID_CATEGORIES_,
    NAME_PRODUCTS,
    DESCRIPTION_PRODUCTS,
    PRICE_PRODUCTS,
    STOCK_PRODUCTS,
    IMAGE_URL_PRODUCTS,
  } = data;
  const [result] = await db.query(
    `INSERT INTO products (ID_CATEGORIES_, NAME_PRODUCTS, DESCRIPTION_PRODUCTS, PRICE_PRODUCTS, STOCK_PRODUCTS, IMAGE_URL_PRODUCTS) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM products`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM products WHERE ID_PRODUCT = ?`, [
    id,
  ]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_CATEGORIES_,
    NAME_PRODUCTS,
    DESCRIPTION_PRODUCTS,
    PRICE_PRODUCTS,
    STOCK_PRODUCTS,
    IMAGE_URL_PRODUCTS,
  } = data;
  const [result] = await db.query(
    `UPDATE products SET ID_CATEGORIES_ = ?, NAME_PRODUCTS = ?, DESCRIPTION_PRODUCTS = ?, PRICE_PRODUCTS = ?, STOCK_PRODUCTS = ?, IMAGE_URL_PRODUCTS = ? WHERE ID_PRODUCT = ?`,
    [
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteProduct = async (id) => {
  const [result] = await db.query(`DELETE FROM products WHERE ID_PRODUCT = ?`, [
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteProduct,
};
