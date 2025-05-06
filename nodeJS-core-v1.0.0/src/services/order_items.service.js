const db = require("../config/database");

const create = async (data) => {
  const { ID_PRODUCT, ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS } =
    data;
  const [result] = await db.query(
    `INSERT INTO order_items (
      ID_PRODUCT, ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS
    ) VALUES (?, ?, ?, ?)`,
    [ID_PRODUCT, ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM order_items");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM order_items WHERE ID_ORDER_ITEMS = ?",
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const { ID_PRODUCT, ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS } =
    data;
  const [result] = await db.query(
    `UPDATE order_items SET 
      ID_PRODUCT = ?, ID_ORDERS_ = ?, QUANTITY_INVENTORY = ?, PRICE_ORDER_ITEMS = ?
    WHERE ID_ORDER_ITEMS = ?`,
    [ID_PRODUCT, ID_ORDERS_, QUANTITY_INVENTORY, PRICE_ORDER_ITEMS, id]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query(
    "DELETE FROM order_items WHERE ID_ORDER_ITEMS = ?",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteRecord,
};
