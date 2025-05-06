const db = require("../config/database");

const create = async (data) => {
  const {
    ID_PRODUCTION_PLANS,
    ID_MATERIALS_,
    QUANTITY_PER_UNIT_PRODUCT_MATERIALS,
    UNIT_PRODUCT_MATERIALS,
  } = data;

  const [result] = await db.query(
    `INSERT INTO production_materials 
    (ID_PRODUCTION_PLANS, ID_MATERIALS_, QUANTITY_PER_UNIT_PRODUCT_MATERIALS, UNIT_PRODUCT_MATERIALS)
    VALUES (?, ?, ?, ?)`,
    [
      ID_PRODUCTION_PLANS,
      ID_MATERIALS_,
      QUANTITY_PER_UNIT_PRODUCT_MATERIALS,
      UNIT_PRODUCT_MATERIALS,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM production_materials`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM production_materials WHERE ID_PRODUCT_MATERIALS = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_PRODUCTION_PLANS,
    ID_MATERIALS_,
    QUANTITY_PER_UNIT_PRODUCT_MATERIALS,
    UNIT_PRODUCT_MATERIALS,
  } = data;

  const [result] = await db.query(
    `UPDATE production_materials SET 
      ID_PRODUCTION_PLANS = ?, 
      ID_MATERIALS_ = ?, 
      QUANTITY_PER_UNIT_PRODUCT_MATERIALS = ?, 
      UNIT_PRODUCT_MATERIALS = ?
    WHERE ID_PRODUCT_MATERIALS = ?`,
    [
      ID_PRODUCTION_PLANS,
      ID_MATERIALS_,
      QUANTITY_PER_UNIT_PRODUCT_MATERIALS,
      UNIT_PRODUCT_MATERIALS,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query(
    `DELETE FROM production_materials WHERE ID_PRODUCT_MATERIALS = ?`,
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
