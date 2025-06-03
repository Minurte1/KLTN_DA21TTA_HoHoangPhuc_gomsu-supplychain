const db = require("../config/database");
const moment = require("moment");
const create = async (data) => {
  try {
    const {
      ID_MATERIAL_TYPES,
      NAME_,
      UNIT_,
      QUANTITY,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
      STATUS,
    } = data;
    const expiryDateFormatted = moment(EXPIRY_DATE).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    // Ép kiểu các trường cần thiết
    const idMaterialType = parseInt(ID_MATERIAL_TYPES, 10);
    const quantity = parseFloat(QUANTITY);
    const costPerUnit = parseFloat(
      String(COST_PER_UNIT_).replace(/,/g, "") // Xoá dấu phẩy nếu có
    );
    const idCompany = parseInt(ID_COMPANY, 10);

    // Kiểm tra dữ liệu hợp lệ
    if (isNaN(costPerUnit)) {
      throw new Error("COST_PER_UNIT_ phải là số hợp lệ.");
    }

    const [result] = await db.query(
      `INSERT INTO materials 
        (ID_MATERIAL_TYPES, NAME_, UNIT_, QUANTITY, COST_PER_UNIT_, ORIGIN, EXPIRY_DATE, ID_COMPANY,STATUS) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        idMaterialType,
        NAME_,
        UNIT_,
        quantity,
        costPerUnit,
        ORIGIN,
        expiryDateFormatted,
        idCompany,
        STATUS,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
};

const getAll = async (ID_COMPANY) => {
  try {
    let query = `
      SELECT m.*, mt.NAME_MATERIAL_TYPES, c.NAME_COMPANY
      FROM materials m
      JOIN material_types mt ON m.ID_MATERIAL_TYPES = mt.ID_MATERIAL_TYPES
      JOIN companies c ON m.ID_COMPANY = c.ID_COMPANY
    `;

    const params = [];

    if (ID_COMPANY) {
      query += ` WHERE m.ID_COMPANY = ?`;
      params.push(ID_COMPANY);
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
      NAME_,
      UNIT_,
      QUANTITY,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
      STATUS,
    } = data;

    const [result] = await db.query(
      `UPDATE materials 
       SET ID_MATERIAL_TYPES = ?, NAME_ = ?, UNIT_ = ?, QUANTITY = ?, COST_PER_UNIT_ = ?, ORIGIN = ?, EXPIRY_DATE = ?,STATUS = ?, ID_COMPANY = ?
       WHERE ID_MATERIALS_ = ?`,
      [
        ID_MATERIAL_TYPES,
        NAME_,
        UNIT_,
        QUANTITY,
        COST_PER_UNIT_,
        ORIGIN,
        EXPIRY_DATE,
        STATUS,
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
