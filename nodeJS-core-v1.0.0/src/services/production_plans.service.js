const db = require("../config/database");

const create = async (data) => {
  const {
    ID_PRODUCT,
    ID_USERS,
    PLANNED_START_PRODUCTION_PLANS,
    PLANNED_END_PRODUCTION_PLANS,
    ACTUAL_START_PRODUCTION_PLANS,
    ACTUAL_END_PRODUCTION_PLANS,
    STATUS_PRODUCTION_PLANS,
    NOTE_PRODUCTION_PLANS,
  } = data;

  const [result] = await db.query(
    `INSERT INTO production_plans 
    (ID_PRODUCT, ID_USERS, PLANNED_START_PRODUCTION_PLANS, PLANNED_END_PRODUCTION_PLANS, ACTUAL_START_PRODUCTION_PLANS, ACTUAL_END_PRODUCTION_PLANS, STATUS_PRODUCTION_PLANS, NOTE_PRODUCTION_PLANS)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_PRODUCT,
      ID_USERS,
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM production_plans`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_PRODUCT,
    ID_USERS,
    PLANNED_START_PRODUCTION_PLANS,
    PLANNED_END_PRODUCTION_PLANS,
    ACTUAL_START_PRODUCTION_PLANS,
    ACTUAL_END_PRODUCTION_PLANS,
    STATUS_PRODUCTION_PLANS,
    NOTE_PRODUCTION_PLANS,
  } = data;

  const [result] = await db.query(
    `UPDATE production_plans SET 
      ID_PRODUCT = ?, 
      ID_USERS = ?, 
      PLANNED_START_PRODUCTION_PLANS = ?, 
      PLANNED_END_PRODUCTION_PLANS = ?, 
      ACTUAL_START_PRODUCTION_PLANS = ?, 
      ACTUAL_END_PRODUCTION_PLANS = ?, 
      STATUS_PRODUCTION_PLANS = ?, 
      NOTE_PRODUCTION_PLANS = ?
    WHERE ID_PRODUCTION_PLANS = ?`,
    [
      ID_PRODUCT,
      ID_USERS,
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query(
    `DELETE FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
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
