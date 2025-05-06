const db = require("../config/database");

const create = async (data) => {
  const {
    ID_PRODUCTION_PLANS,
    ID_USERS,
    ID_EQUIPMENT,
    STEP_NAME_PRODUCTION_STEPS,
    START_TIME_PRODUCTION_STEPS,
    END_TIME_PRODUCTION_STEPS,
    STATUS_PRODUCTION_STEPS,
  } = data;

  const [result] = await db.query(
    `INSERT INTO production_steps 
    (ID_PRODUCTION_PLANS, ID_USERS, ID_EQUIPMENT, STEP_NAME_PRODUCTION_STEPS, START_TIME_PRODUCTION_STEPS, END_TIME_PRODUCTION_STEPS, STATUS_PRODUCTION_STEPS)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
    ]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM production_steps`);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM production_steps WHERE ID_PRODUCTION_STEPS_ = ?`,
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_PRODUCTION_PLANS,
    ID_USERS,
    ID_EQUIPMENT,
    STEP_NAME_PRODUCTION_STEPS,
    START_TIME_PRODUCTION_STEPS,
    END_TIME_PRODUCTION_STEPS,
    STATUS_PRODUCTION_STEPS,
  } = data;

  const [result] = await db.query(
    `UPDATE production_steps SET 
      ID_PRODUCTION_PLANS = ?, 
      ID_USERS = ?, 
      ID_EQUIPMENT = ?, 
      STEP_NAME_PRODUCTION_STEPS = ?, 
      START_TIME_PRODUCTION_STEPS = ?, 
      END_TIME_PRODUCTION_STEPS = ?, 
      STATUS_PRODUCTION_STEPS = ?
    WHERE ID_PRODUCTION_STEPS_ = ?`,
    [
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      id,
    ]
  );
  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query(
    `DELETE FROM production_steps WHERE ID_PRODUCTION_STEPS_ = ?`,
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
