const db = require("../config/database");

const create = async (data) => {
  const {
    NAME_PRODUCTS,
    ADDRESS_SUPPLIERS,
    PHONE_SUPPLIERS,
    EMAIL_SUPPLIERS,
    STATUS_SUPPLIERS,
  } = data;
  const [result] = await db.query(
    `INSERT INTO suppliers (NAME_PRODUCTS, ADDRESS_SUPPLIERS, PHONE_SUPPLIERS, EMAIL_SUPPLIERS, STATUS_SUPPLIERS) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM suppliers`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM suppliers WHERE ID_SUPPLIERS = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    NAME_PRODUCTS,
    ADDRESS_SUPPLIERS,
    PHONE_SUPPLIERS,
    EMAIL_SUPPLIERS,
    STATUS_SUPPLIERS,
  } = data;
  const [result] = await db.query(
    `UPDATE suppliers SET NAME_PRODUCTS = ?, ADDRESS_SUPPLIERS = ?, PHONE_SUPPLIERS = ?, EMAIL_SUPPLIERS = ?, STATUS_SUPPLIERS = ? WHERE ID_SUPPLIERS = ?`,
    [
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteSupplier = async (id) => {
  const [result] = await db.query(
    `DELETE FROM suppliers WHERE ID_SUPPLIERS = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteSupplier,
};
