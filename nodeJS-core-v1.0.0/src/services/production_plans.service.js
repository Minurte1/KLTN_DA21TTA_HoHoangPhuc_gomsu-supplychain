const db = require("../config/database");
const moment = require("moment");

// Hàm tạo mới bản ghi production_plans
const create = async (data) => {
  try {
    const {
      ID_PRODUCT,
      ID_USERS,
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
      ID_COMPANY,
      NAME_PRODUCTION_PLAN,
      QUANTITY_PRODUCT,
    } = data;

    // Format ngày giờ (nếu có)
    const plannedStart = PLANNED_START_PRODUCTION_PLANS
      ? moment(PLANNED_START_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const plannedEnd = PLANNED_END_PRODUCTION_PLANS
      ? moment(PLANNED_END_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const actualStart = ACTUAL_START_PRODUCTION_PLANS
      ? moment(ACTUAL_START_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const actualEnd = ACTUAL_END_PRODUCTION_PLANS
      ? moment(ACTUAL_END_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;

    // Ép kiểu int cho các ID
    const idProduct = parseInt(ID_PRODUCT, 10);
    const idUsers = parseInt(ID_USERS, 10);
    const idCompany = parseInt(ID_COMPANY, 10);

    const [result] = await db.query(
      `INSERT INTO production_plans 
        (ID_PRODUCT, ID_USERS, PLANNED_START_PRODUCTION_PLANS, PLANNED_END_PRODUCTION_PLANS, ACTUAL_START_PRODUCTION_PLANS, ACTUAL_END_PRODUCTION_PLANS, STATUS_PRODUCTION_PLANS, NOTE_PRODUCTION_PLANS, ID_COMPANY,QUANTITY_PRODUCT, NAME_PRODUCTION_PLAN)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
      [
        idProduct,
        idUsers,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        STATUS_PRODUCTION_PLANS,
        NOTE_PRODUCTION_PLANS,
        idCompany,
        QUANTITY_PRODUCT,
        NAME_PRODUCTION_PLAN,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in create production_plan:", error);
    throw error;
  }
};

// Lấy tất cả production_plans kèm thông tin công ty
const getAll = async (ID_COMPANY, STATUS_PRODUCTION_PLANS) => {
  try {
    let query = `
      SELECT pp.*, 
             c.NAME_COMPANY, c.TYPE_COMPANY, c.ADDRESS, c.DIA_CHI_Provinces, c.DIA_CHI_Districts, 
             c.DIA_CHI_Wards, c.DIA_CHI_STREETNAME, c.PHONE, c.EMAIL, c.AVATAR, c.SLUG, 
             c.CREATED_AT, c.UPDATED_AT, c.STATUS as COMPANY_STATUS
      FROM production_plans pp
      LEFT JOIN companies c ON pp.ID_COMPANY = c.ID_COMPANY
    `;

    const params = [];
    const conditions = [];

    if (ID_COMPANY) {
      conditions.push(`pp.ID_COMPANY = ?`);
      params.push(ID_COMPANY);
    }

    if (STATUS_PRODUCTION_PLANS) {
      conditions.push(`pp.STATUS_PRODUCTION_PLANS = ?`);
      params.push(STATUS_PRODUCTION_PLANS);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [plans] = await db.query(query, params);

    // Lấy thêm production_material cho từng plan
    for (let plan of plans) {
      const [materials] = await db.query(
        `SELECT * FROM production_materials WHERE ID_PRODUCTION_PLANS = ?`,
        [plan.ID_PRODUCTION_PLANS]
      );

      plan.production_material = materials; // Gắn vào payload
    }

    return plans;
  } catch (error) {
    console.error("Error in getAll production_plans:", error);
    throw error;
  }
};

// Lấy 1 bản ghi theo ID_PRODUCTION_PLANS
const getById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getById production_plan:", error);
    throw error;
  }
};

// Cập nhật bản ghi production_plans theo ID
const update = async (id, data) => {
  try {
    const {
      ID_PRODUCT,
      ID_USERS,
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
      ID_COMPANY,
      NAME_PRODUCTION_PLAN,
      QUANTITY_PRODUCT,
    } = data;

    const plannedStart = PLANNED_START_PRODUCTION_PLANS
      ? moment(PLANNED_START_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const plannedEnd = PLANNED_END_PRODUCTION_PLANS
      ? moment(PLANNED_END_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const actualStart = ACTUAL_START_PRODUCTION_PLANS
      ? moment(ACTUAL_START_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;
    const actualEnd = ACTUAL_END_PRODUCTION_PLANS
      ? moment(ACTUAL_END_PRODUCTION_PLANS).format("YYYY-MM-DD HH:mm:ss")
      : null;

    const idProduct = parseInt(ID_PRODUCT, 10);
    const idUsers = parseInt(ID_USERS, 10);
    const idCompany = parseInt(ID_COMPANY, 10);

    const [result] = await db.query(
      `UPDATE production_plans
       SET ID_PRODUCT = ?, ID_USERS = ?, PLANNED_START_PRODUCTION_PLANS = ?, PLANNED_END_PRODUCTION_PLANS = ?, ACTUAL_START_PRODUCTION_PLANS = ?, ACTUAL_END_PRODUCTION_PLANS = ?, STATUS_PRODUCTION_PLANS = ?, NOTE_PRODUCTION_PLANS = ?, ID_COMPANY = ?, QUANTITY_PRODUCT = ?, NAME_PRODUCTION_PLAN = ?
       WHERE ID_PRODUCTION_PLANS = ?`,
      [
        idProduct,
        idUsers,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        STATUS_PRODUCTION_PLANS,
        NOTE_PRODUCTION_PLANS,
        idCompany,
        QUANTITY_PRODUCT,
        NAME_PRODUCTION_PLAN,
        id,
      ]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in update production_plan:", error);
    throw error;
  }
};

// Xoá bản ghi theo ID
const deleteProductionPlan = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in delete production_plan:", error);
    throw error;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteProductionPlan,
};
