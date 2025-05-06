const db = require("../config/database");

const create = async (data) => {
  const {
    ID_MATERIAL_TYPES,
    NAME_MATERIALS,
    UNIT_MATERIALS,
    QUANTITY_ORDER_ITEMS,
    COST_PER_UNIT_,
    ORIGIN,
    EXPIRY_DATE,
  } = data;
  const [result] = await db.query(
    `INSERT INTO materials (ID_MATERIAL_TYPES, NAME_MATERIALS, UNIT_MATERIALS, QUANTITY_ORDER_ITEMS, COST_PER_UNIT_, ORIGIN, EXPIRY_DATE) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_MATERIAL_TYPES,
      NAME_MATERIALS,
      UNIT_MATERIALS,
      QUANTITY_ORDER_ITEMS,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM materials`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM materials WHERE ID_MATERIALS_ = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_MATERIAL_TYPES,
    NAME_MATERIALS,
    UNIT_MATERIALS,
    QUANTITY_ORDER_ITEMS,
    COST_PER_UNIT_,
    ORIGIN,
    EXPIRY_DATE,
  } = data;
  const [result] = await db.query(
    `UPDATE materials SET ID_MATERIAL_TYPES = ?, NAME_MATERIALS = ?, UNIT_MATERIALS = ?, QUANTITY_ORDER_ITEMS = ?, COST_PER_UNIT_ = ?, ORIGIN = ?, EXPIRY_DATE = ? WHERE ID_MATERIALS_ = ?`,
    [
      ID_MATERIAL_TYPES,
      NAME_MATERIALS,
      UNIT_MATERIALS,
      QUANTITY_ORDER_ITEMS,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteMaterial = async (id) => {
  const [result] = await db.query(
    `DELETE FROM materials WHERE ID_MATERIALS_ = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterial,
};
