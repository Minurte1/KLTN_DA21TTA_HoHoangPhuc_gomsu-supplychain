const db = require("../config/database");

const create = async (data) => {
  const {
    ID_PRODUCTION_STEPS_,
    ID_PRODUCT,
    ID_USERS,
    CHECK_DATE,
    RESULT,
    NOTE,
  } = data;

  const [result] = await db.query(
    `INSERT INTO quality_control (
      ID_PRODUCTION_STEPS_, ID_PRODUCT, ID_USERS, CHECK_DATE, RESULT, NOTE
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [ID_PRODUCTION_STEPS_, ID_PRODUCT, ID_USERS, CHECK_DATE, RESULT, NOTE]
  );

  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM quality_control");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM quality_control WHERE ID_QUALITY_CONTROL = ?",
    [id]
  );
  return rows[0] || null;
};

const update = async (id, data) => {
  const {
    ID_PRODUCTION_STEPS_,
    ID_PRODUCT,
    ID_USERS,
    CHECK_DATE,
    RESULT,
    NOTE,
  } = data;

  const [result] = await db.query(
    `UPDATE quality_control SET
      ID_PRODUCTION_STEPS_ = ?, ID_PRODUCT = ?, ID_USERS = ?,
      CHECK_DATE = ?, RESULT = ?, NOTE = ?
    WHERE ID_QUALITY_CONTROL = ?`,
    [ID_PRODUCTION_STEPS_, ID_PRODUCT, ID_USERS, CHECK_DATE, RESULT, NOTE, id]
  );

  return result.affectedRows > 0;
};

const deleteRecord = async (id) => {
  const [result] = await db.query(
    "DELETE FROM quality_control WHERE ID_QUALITY_CONTROL = ?",
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
