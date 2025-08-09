const db = require("../config/database");
const moment = require("moment");

const create = async (data) => {
  try {
    const {
      NAME_EQUIPMENT,
      TYPE_EQUIPMENT,
      STATUS,
      LAST_MAINTENANCE,
      ID_COMPANY,
    } = data;

    const lastMaintenanceFormatted = LAST_MAINTENANCE
      ? moment(LAST_MAINTENANCE).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const [result] = await db.query(
      `INSERT INTO equipment 
        (NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE, ID_COMPANY, CREATED_AT, UPDATED_AT) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        NAME_EQUIPMENT,
        TYPE_EQUIPMENT,
        STATUS,
        lastMaintenanceFormatted,
        ID_COMPANY,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
};

const getAll = async (STATUS, TYPE_EQUIPMENT, ID_COMPANY) => {
  try {
    let query = `
      SELECT e.*, c.NAME_COMPANY, c.TYPE_COMPANY, c.ADDRESS, c.PHONE, c.EMAIL
      FROM equipment e
      LEFT JOIN companies c ON e.ID_COMPANY = c.ID_COMPANY
    `;
    const params = [];
    const conditions = [];

    if (STATUS) {
      conditions.push(`e.STATUS = ?`);
      params.push(STATUS);
    }
    if (TYPE_EQUIPMENT) {
      conditions.push(`e.TYPE_EQUIPMENT = ?`);
      params.push(TYPE_EQUIPMENT);
    }
    if (ID_COMPANY) {
      conditions.push(`e.ID_COMPANY = ?`);
      params.push(ID_COMPANY);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Sắp xếp theo thời gian cập nhật mới nhất (giảm dần)
    query += " ORDER BY e.UPDATED_AT DESC";

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
    let {
      NAME_EQUIPMENT,
      TYPE_EQUIPMENT,
      STATUS,
      LAST_MAINTENANCE,
      ID_COMPANY,
    } = data;

    // Nếu STATUS là MAINTENANCE thì LAST_MAINTENANCE = thời gian hiện tại
    if (STATUS === "MAINTENANCE") {
      LAST_MAINTENANCE = moment().format("YYYY-MM-DD HH:mm:ss");
    } else {
      // Nếu không phải, thì format theo dữ liệu đầu vào, hoặc null nếu không có
      LAST_MAINTENANCE = LAST_MAINTENANCE
        ? moment(LAST_MAINTENANCE).format("YYYY-MM-DD HH:mm:ss")
        : null;
    }

    const [result] = await db.query(
      `UPDATE equipment 
       SET NAME_EQUIPMENT = ?, TYPE_EQUIPMENT = ?, STATUS = ?, LAST_MAINTENANCE = ?, ID_COMPANY = ?, UPDATED_AT = NOW()
       WHERE ID_EQUIPMENT = ?`,
      [NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE, ID_COMPANY, id]
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
