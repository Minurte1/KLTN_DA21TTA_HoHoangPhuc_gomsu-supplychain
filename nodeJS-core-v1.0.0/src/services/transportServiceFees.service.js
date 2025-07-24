const db = require("../config/database");

// CREATE
const create = async (data) => {
  const {
    ID_COMPANY_SHIP,
    SERVICE_NAME,
    UNIT,
    PRICE,
    NOTE,
    STATUS,
    CREATED_AT,
    UPDATED_AT,
  } = data;

  const [result] = await db.query(
    `INSERT INTO transport_service_fees (
      ID_COMPANY_SHIP, SERVICE_NAME, UNIT, PRICE, NOTE, STATUS, CREATED_AT, UPDATED_AT
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ID_COMPANY_SHIP,
      SERVICE_NAME,
      UNIT,
      PRICE,
      NOTE,
      STATUS,
      CREATED_AT,
      UPDATED_AT,
    ]
  );

  return result.insertId;
};

// GET ALL
const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM transport_service_fees");
  return rows;
};

// GET BY ID
const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM transport_service_fees WHERE ID_FEE = ?",
    [id]
  );
  return rows[0] || null;
};

// UPDATE
const update = async (id, data) => {
  const {
    ID_COMPANY_SHIP,
    SERVICE_NAME,
    UNIT,
    PRICE,
    NOTE,
    STATUS,
    CREATED_AT,
    UPDATED_AT,
  } = data;

  const [result] = await db.query(
    `UPDATE transport_service_fees SET
      ID_COMPANY_SHIP = ?, SERVICE_NAME = ?, UNIT = ?, PRICE = ?, NOTE = ?, STATUS = ?, CREATED_AT = ?, UPDATED_AT = ?
    WHERE ID_FEE = ?`,
    [
      ID_COMPANY_SHIP,
      SERVICE_NAME,
      UNIT,
      PRICE,
      NOTE,
      STATUS,
      CREATED_AT,
      UPDATED_AT,
      id,
    ]
  );

  return result.affectedRows > 0;
};

// DELETE
const deleteRecord = async (id) => {
  const [result] = await db.query(
    "DELETE FROM transport_service_fees WHERE ID_FEE = ?",
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
