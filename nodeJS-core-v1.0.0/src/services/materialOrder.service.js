const db = require("../config/database");

const create = async (data) => {
  const {
    ID_MATERIALS_,
    ID_SUPPLIERS,
    QUANTITY_ORDERED,
    ORDER_DATE,
    DELIVERY_DATE,
    STATUS,
    TOTAL_COST,
  } = data;
  const [result] = await db.query(
    `INSERT INTO material_orders (ID_MATERIALS_, ID_SUPPLIERS, QUANTITY_ORDERED, ORDER_DATE, DELIVERY_DATE, STATUS, TOTAL_COST) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM material_orders`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM material_orders WHERE ID_MATERIAL_ORDER = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_MATERIALS_,
    ID_SUPPLIERS,
    QUANTITY_ORDERED,
    ORDER_DATE,
    DELIVERY_DATE,
    STATUS,
    TOTAL_COST,
  } = data;
  const [result] = await db.query(
    `UPDATE material_orders SET ID_MATERIALS_ = ?, ID_SUPPLIERS = ?, QUANTITY_ORDERED = ?, ORDER_DATE = ?, DELIVERY_DATE = ?, STATUS = ?, TOTAL_COST = ? WHERE ID_MATERIAL_ORDER = ?`,
    [
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteMaterialOrder = async (id) => {
  const [result] = await db.query(
    `DELETE FROM material_orders WHERE ID_MATERIAL_ORDER = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterialOrder,
};
