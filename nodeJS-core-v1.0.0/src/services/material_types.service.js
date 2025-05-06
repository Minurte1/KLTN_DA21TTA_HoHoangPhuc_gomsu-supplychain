const db = require("../config/database");

const create = async (data) => {
  const { NAME_MATERIAL_TYPES } = data;
  const [result] = await db.query(
    `INSERT INTO material_types (NAME_MATERIAL_TYPES) VALUES (?)`,
    [NAME_MATERIAL_TYPES]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM material_types`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM material_types WHERE ID_MATERIAL_TYPES = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const { NAME_MATERIAL_TYPES } = data;
  const [result] = await db.query(
    `UPDATE material_types SET NAME_MATERIAL_TYPES = ? WHERE ID_MATERIAL_TYPES = ?`,
    [NAME_MATERIAL_TYPES, id]
  );
  return result.affectedRows > 0;
};

const deleteMaterialType = async (id) => {
  const [result] = await db.query(
    `DELETE FROM material_types WHERE ID_MATERIAL_TYPES = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteMaterialType,
};
