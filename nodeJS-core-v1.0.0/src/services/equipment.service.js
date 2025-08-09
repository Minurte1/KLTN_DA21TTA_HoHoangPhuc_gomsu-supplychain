const db = require("../config/database");
const moment = require("moment");

const create = async (data) => {
  try {
    const { NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE } = data;

    const lastMaintenanceFormatted = LAST_MAINTENANCE
      ? moment(LAST_MAINTENANCE).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const [result] = await db.query(
      `INSERT INTO equipment 
        (NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE, CREATED_AT, UPDATED_AT) 
      VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, lastMaintenanceFormatted]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
};

const getAll = async (STATUS, TYPE_EQUIPMENT) => {
  try {
    let query = `SELECT * FROM equipment`;
    const params = [];
    const conditions = [];

    if (STATUS) {
      conditions.push(`STATUS = ?`);
      params.push(STATUS);
    }
    if (TYPE_EQUIPMENT) {
      conditions.push(`TYPE_EQUIPMENT = ?`);
      params.push(TYPE_EQUIPMENT);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM equipment WHERE ID_EQUIPMENT = ?`,
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
    const { NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE } = data;

    const lastMaintenanceFormatted = LAST_MAINTENANCE
      ? moment(LAST_MAINTENANCE).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const [result] = await db.query(
      `UPDATE equipment 
       SET NAME_EQUIPMENT = ?, TYPE_EQUIPMENT = ?, STATUS = ?, LAST_MAINTENANCE = ?, UPDATED_AT = NOW()
       WHERE ID_EQUIPMENT = ?`,
      [NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, lastMaintenanceFormatted, id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in update:", error);
    throw error;
  }
};

const deleteEquipment = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM equipment WHERE ID_EQUIPMENT = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteEquipment:", error);
    throw error;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEquipment,
};
