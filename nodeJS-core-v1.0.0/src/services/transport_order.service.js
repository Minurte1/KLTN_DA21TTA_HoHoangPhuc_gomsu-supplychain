const db = require("../config/database");

const create = async (data) => {
  const {
    ID_COMPANY,
    ID_MATERIAL_ORDER,
    ID_ORDER,
    DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
  } = data;

  const [result] = await db.query(
    `INSERT INTO transport_orders (
      ID_COMPANY, ID_MATERIAL_ORDER, ID_ORDER,
      DELIVERY_DATE, STATUS, SHIPPING_COST, NOTE
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_COMPANY,
      ID_MATERIAL_ORDER,
      ID_ORDER,
      DELIVERY_DATE,
      STATUS,
      SHIPPING_COST,
      NOTE,
    ]
  );

  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM transport_orders");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM transport_orders WHERE ID_TRANSPORT_ORDER = ?",
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_COMPANY,
    ID_MATERIAL_ORDER,
    ID_ORDER,
    DELIVERY_DATE,
    STATUS,
    SHIPPING_COST,
    NOTE,
  } = data;

  const [result] = await db.query(
    `UPDATE transport_orders SET
      ID_COMPANY = ?, ID_MATERIAL_ORDER = ?, ID_ORDER = ?,
      DELIVERY_DATE = ?, STATUS = ?, SHIPPING_COST = ?, NOTE = ?
    WHERE ID_TRANSPORT_ORDER = ?`,
    [
      ID_COMPANY,
      ID_MATERIAL_ORDER,
      ID_ORDER,
      DELIVERY_DATE,
      STATUS,
      SHIPPING_COST,
      NOTE,
      id,
    ]
  );

  return result.affectedRows > 0;
};

const deleteOrder = async (id) => {
  const [result] = await db.query(
    "DELETE FROM transport_orders WHERE ID_TRANSPORT_ORDER = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteOrder,
};
