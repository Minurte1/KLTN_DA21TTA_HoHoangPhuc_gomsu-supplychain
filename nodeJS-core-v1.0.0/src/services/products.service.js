const db = require("../config/database");

const URL_IMAGE_BASE = `http://localhost:` + process.env.PORT + ``; // hoặc lấy từ config/env

const create = async (data) => {
  const {
    ID_CATEGORIES_,
    NAME_PRODUCTS,
    DESCRIPTION_PRODUCTS,

    IMAGE_URL_PRODUCTS,
    ID_COMPANY,
  } = data;
  const [result] = await db.query(
    `INSERT INTO products (ID_CATEGORIES_, NAME_PRODUCTS, DESCRIPTION_PRODUCTS,  IMAGE_URL_PRODUCTS , ID_COMPANY) 
    VALUES (?, ?,   ?, ? , ?)`,
    [
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,

      IMAGE_URL_PRODUCTS,
      ID_COMPANY,
    ]
  );
  return result.insertId;
};

const getAll = async (ID_COMPANY) => {
  let query = `SELECT * FROM products`;
  const params = [];

  if (ID_COMPANY) {
    query += ` WHERE ID_COMPANY = ?`;
    params.push(ID_COMPANY);
  }

  const [rows] = await db.query(query, params);

  return rows.map((item) => ({
    ...item,
    IMAGE_URL_PRODUCTS: item.IMAGE_URL_PRODUCTS
      ? URL_IMAGE_BASE + item.IMAGE_URL_PRODUCTS
      : null,
  }));
};

const getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM products WHERE ID_PRODUCT = ?`, [
    id,
  ]);
  if (!rows[0]) return null;

  const product = rows[0];
  product.IMAGE_URL_PRODUCTS = product.IMAGE_URL_PRODUCTS
    ? URL_IMAGE_BASE + product.IMAGE_URL_PRODUCTS
    : null;

  return product;
};

const update = async (id, data) => {
  // Tạo câu query linh hoạt khi có/không IMAGE_URL_PRODUCTS
  let query = `UPDATE products SET ID_CATEGORIES_ = ?, NAME_PRODUCTS = ?, DESCRIPTION_PRODUCTS = ?,  ID_COMPANY = ?, UPDATED_AT_PRODUCTS = NOW()`;
  const params = [
    data.ID_CATEGORIES_,
    data.NAME_PRODUCTS,
    data.DESCRIPTION_PRODUCTS,

    data.ID_COMPANY,
  ];

  if (data.IMAGE_URL_PRODUCTS) {
    query += `, IMAGE_URL_PRODUCTS = ?`;
    params.push(data.IMAGE_URL_PRODUCTS);
  }
  query += ` WHERE ID_PRODUCT = ?`;
  params.push(id);

  const [result] = await db.query(query, params);
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
