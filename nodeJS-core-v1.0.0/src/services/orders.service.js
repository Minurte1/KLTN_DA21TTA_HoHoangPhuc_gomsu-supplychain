const db = require("../config/database");

const create = async (data) => {
  const {
    ID_USERS,
    DATE_ORDER,
    TOTAL_AMOUNT_ORDER,
    PAYMENT_STATUS_ORDER,
    SHIPPING_STATUS_ORDER,
    SHIPPING_ADDRESS,
    SHIPPING_METHOD,
    SHIPPING_COST,
  } = data;

  const [result] = await db.query(
    `INSERT INTO orders (
      ID_USERS, DATE_ORDER, TOTAL_AMOUNT_ORDER,
      PAYMENT_STATUS_ORDER, SHIPPING_STATUS_ORDER,
      SHIPPING_ADDRESS, SHIPPING_METHOD, SHIPPING_COST
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_USERS,
      DATE_ORDER,
      TOTAL_AMOUNT_ORDER,
      PAYMENT_STATUS_ORDER,
      SHIPPING_STATUS_ORDER,
      SHIPPING_ADDRESS,
      SHIPPING_METHOD,
      SHIPPING_COST,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM orders");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM orders WHERE ID_ORDERS_ = ?", [
    id,
  ]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_USERS,
    DATE_ORDER,
    TOTAL_AMOUNT_ORDER,
    PAYMENT_STATUS_ORDER,
    SHIPPING_STATUS_ORDER,
    SHIPPING_ADDRESS,
    SHIPPING_METHOD,
    SHIPPING_COST,
  } = data;

  const [result] = await db.query(
    `UPDATE orders SET
      ID_USERS = ?, DATE_ORDER = ?, TOTAL_AMOUNT_ORDER = ?,
      PAYMENT_STATUS_ORDER = ?, SHIPPING_STATUS_ORDER = ?,
      SHIPPING_ADDRESS = ?, SHIPPING_METHOD = ?, SHIPPING_COST = ?
    WHERE ID_ORDERS_ = ?`,
    [
      ID_USERS,
      DATE_ORDER,
      TOTAL_AMOUNT_ORDER,
      PAYMENT_STATUS_ORDER,
      SHIPPING_STATUS_ORDER,
      SHIPPING_ADDRESS,
      SHIPPING_METHOD,
      SHIPPING_COST,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query("DELETE FROM orders WHERE ID_ORDERS_ = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteRecord,
};
