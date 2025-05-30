const db = require("../config/database");

const create = async (data) => {
  try {
    const {
      ID_MATERIAL_TYPES,
      NAME_MATERIALS,
      UNIT_MATERIALS,
      QUANTITY_ORDER_ITEMS,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
    } = data;

    const [result] = await db.query(
      `INSERT INTO materials (ID_MATERIAL_TYPES, NAME_MATERIALS, UNIT_MATERIALS, QUANTITY_ORDER_ITEMS, COST_PER_UNIT_, ORIGIN, EXPIRY_DATE, ID_COMPANY) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ID_MATERIAL_TYPES,
        NAME_MATERIALS,
        UNIT_MATERIALS,
        QUANTITY_ORDER_ITEMS,
        COST_PER_UNIT_,
        ORIGIN,
        EXPIRY_DATE,
        ID_COMPANY,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
};

const getAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM materials`);
    return rows;
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM materials WHERE ID_MATERIALS_ = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getById:", error);
    throw error;
  }
};

const update = async (id, data) => {
  try {
    const {
      ID_MATERIAL_TYPES,
      NAME_MATERIALS,
      UNIT_MATERIALS,
      QUANTITY_ORDER_ITEMS,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
    } = data;

    const [result] = await db.query(
      `UPDATE materials SET ID_MATERIAL_TYPES = ?, NAME_MATERIALS = ?, UNIT_MATERIALS = ?, QUANTITY_ORDER_ITEMS = ?, COST_PER_UNIT_ = ?, ORIGIN = ?, EXPIRY_DATE = ?, ID_COMPANY = ? WHERE ID_MATERIALS_ = ?`,
      [
        ID_MATERIAL_TYPES,
        NAME_MATERIALS,
        UNIT_MATERIALS,
        QUANTITY_ORDER_ITEMS,
        COST_PER_UNIT_,
        ORIGIN,
        EXPIRY_DATE,
        ID_COMPANY,
        id,
      ]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in update:", error);
    throw error;
  }
};

const deleteMaterial = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM materials WHERE ID_MATERIALS_ = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteMaterial:", error);
    throw error;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterial,
};
