const db = require("../config/database");

const create = async (data) => {
  const {
    ID_MATERIALS_,
    QUANTITY_ORDER_ITEMS,
    LAST_UPDATED_,
    STORAGE_CONDITION,
  } = data;
  const [result] = await db.query(
    `INSERT INTO inventory (ID_MATERIALS_, QUANTITY_ORDER_ITEMS, LAST_UPDATED_, STORAGE_CONDITION) 
    VALUES (?, ?, ?, ?)`,
    [ID_MATERIALS_, QUANTITY_ORDER_ITEMS, LAST_UPDATED_, STORAGE_CONDITION]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM inventory`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM inventory WHERE ID_INVENTORY_ = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_MATERIALS_,
    QUANTITY_ORDER_ITEMS,
    LAST_UPDATED_,
    STORAGE_CONDITION,
  } = data;
  const [result] = await db.query(
    `UPDATE inventory SET ID_MATERIALS_ = ?, QUANTITY_ORDER_ITEMS = ?, LAST_UPDATED_ = ?, STORAGE_CONDITION = ? WHERE ID_INVENTORY_ = ?`,
    [ID_MATERIALS_, QUANTITY_ORDER_ITEMS, LAST_UPDATED_, STORAGE_CONDITION, id]
  );
  return result.affectedRows > 0;
};

const deleteInventory = async (id) => {
  const [result] = await db.query(
    `DELETE FROM inventory WHERE ID_INVENTORY_ = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteInventory,
};
