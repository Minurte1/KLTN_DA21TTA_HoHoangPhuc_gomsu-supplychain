const db = require("../config/database");
const moment = require("moment");

const create = async (data) => {
  try {
    const {
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      ID_COMPANY,
    } = data;

    // Format ngày giờ
    const startTime = START_TIME_PRODUCTION_STEPS
      ? moment(START_TIME_PRODUCTION_STEPS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const endTime = END_TIME_PRODUCTION_STEPS
      ? moment(END_TIME_PRODUCTION_STEPS).format("YYYY-MM-DD HH:mm:ss")
      : null;

    // Ép kiểu số
    const idProductionPlans = parseInt(ID_PRODUCTION_PLANS, 10);
    const idUsers = parseInt(ID_USERS, 10);
    const idEquipment = parseInt(ID_EQUIPMENT, 10);
    const idCompany = parseInt(ID_COMPANY, 10);

    // Kiểm tra dữ liệu hợp lệ
    if (
      isNaN(idProductionPlans) ||
      isNaN(idUsers) ||
      isNaN(idEquipment) ||
      isNaN(idCompany)
    ) {
      throw new Error(
        "ID_PRODUCTION_PLANS, ID_USERS, ID_EQUIPMENT và ID_COMPANY phải là số hợp lệ."
      );
    }

    const [result] = await db.query(
      `INSERT INTO production_steps
      (ID_PRODUCTION_PLANS, ID_USERS, ID_EQUIPMENT, STEP_NAME_PRODUCTION_STEPS, START_TIME_PRODUCTION_STEPS, END_TIME_PRODUCTION_STEPS, STATUS_PRODUCTION_STEPS, ID_COMPANY)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idProductionPlans,
        idUsers,
        idEquipment,
        STEP_NAME_PRODUCTION_STEPS,
        startTime,
        endTime,
        STATUS_PRODUCTION_STEPS,
        idCompany,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create production_steps:", error);
    throw error;
  }
};

const getAll = async (ID_COMPANY, STATUS) => {
  try {
    let query = `
      SELECT 
        ps.*, 
        pp.NAME_PRODUCTION_PLAN, 
        u.HO_TEN, 
        e.NAME_EQUIPMENT, 
        c.NAME_COMPANY,
        c.TYPE_COMPANY,
        c.ADDRESS,
        c.DIA_CHI_Provinces,
        c.DIA_CHI_Districts,
        c.DIA_CHI_Wards,
        c.DIA_CHI_STREETNAME,
        c.PHONE,
        c.EMAIL,
        c.AVATAR,
        c.SLUG,
        c.CREATED_AT,
        c.UPDATED_AT,
        c.STATUS AS COMPANY_STATUS,
        c.ID_COMPANY_TYPE
      FROM production_steps ps
      LEFT JOIN production_plans pp ON ps.ID_PRODUCTION_PLANS = pp.ID_PRODUCTION_PLANS
      LEFT JOIN users u ON ps.ID_USERS = u.ID_USERS
      LEFT JOIN equipment e ON ps.ID_EQUIPMENT = e.ID_EQUIPMENT
      LEFT JOIN companies c ON ps.ID_COMPANY = c.ID_COMPANY
    `;

    const params = [];
    const conditions = [];

    if (ID_COMPANY) {
      conditions.push(`ps.ID_COMPANY = ?`);
      params.push(ID_COMPANY);
    }

    if (STATUS) {
      conditions.push(`ps.STATUS_PRODUCTION_STEPS = ?`);
      params.push(STATUS);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getAll production_steps:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM production_steps WHERE ID_PRODUCTION_STEPS_ = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getById production_steps:", error);
    throw error;
  }
};

const update = async (id, data) => {
  try {
    const {
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      ID_COMPANY,
    } = data;

    const startTime = START_TIME_PRODUCTION_STEPS
      ? moment(START_TIME_PRODUCTION_STEPS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const endTime = END_TIME_PRODUCTION_STEPS
      ? moment(END_TIME_PRODUCTION_STEPS).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const [result] = await db.query(
      `UPDATE production_steps
       SET ID_PRODUCTION_PLANS = ?, ID_USERS = ?, ID_EQUIPMENT = ?, STEP_NAME_PRODUCTION_STEPS = ?, START_TIME_PRODUCTION_STEPS = ?, END_TIME_PRODUCTION_STEPS = ?, STATUS_PRODUCTION_STEPS = ?, ID_COMPANY = ?
       WHERE ID_PRODUCTION_STEPS_ = ?`,
      [
        ID_PRODUCTION_PLANS,
        ID_USERS,
        ID_EQUIPMENT,
        STEP_NAME_PRODUCTION_STEPS,
        startTime,
        endTime,
        STATUS_PRODUCTION_STEPS,
        ID_COMPANY,
        id,
      ]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in update production_steps:", error);
    throw error;
  }
};

const deleteProductionStep = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM production_steps WHERE ID_PRODUCTION_STEPS_ = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in delete production_steps:", error);
    throw error;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteProductionStep,
};
