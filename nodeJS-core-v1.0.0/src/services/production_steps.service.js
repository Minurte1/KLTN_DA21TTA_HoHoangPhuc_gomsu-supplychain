const db = require("../config/database");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid"); // nhớ import thư viện uuid nếu chưa có

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

const getAll = async (ID_COMPANY, STATUS, ID_USERS) => {
  try {
    let query = `
      SELECT 
        ps.*, 
        pp.NAME_PRODUCTION_PLAN, 

        -- Thông tin người dùng (users)
        u.HO_TEN AS USER_HO_TEN, 
        u.EMAIL AS USER_EMAIL,
        u.SO_DIEN_THOAI AS USER_PHONE,
        u.AVATAR AS USER_AVATAR,
        u.TRANG_THAI_USER AS USER_STATUS,
        u.ID_ROLE AS USER_ROLE,
        u.DIA_CHI_Provinces AS USER_PROVINCE,
        u.DIA_CHI_Districts AS USER_DISTRICT,
        u.DIA_CHI_Wards AS USER_WARD,
        u.DIA_CHI_STREETNAME AS USER_STREET,

        -- Thông tin thiết bị (equipment)
        e.NAME_EQUIPMENT,
        e.TYPE_EQUIPMENT,
        e.STATUS AS EQUIPMENT_STATUS,
        e.LAST_MAINTENANCE,
        e.CREATED_AT AS EQUIPMENT_CREATED_AT,
        e.UPDATED_AT AS EQUIPMENT_UPDATED_AT,
        e.ID_COMPANY AS EQUIPMENT_COMPANY_ID,

        -- Thông tin công ty (companies)
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

    if (ID_COMPANY != null) {
      conditions.push(`ps.ID_COMPANY = ?`);
      params.push(ID_COMPANY);
    }

    if (STATUS != null) {
      conditions.push(`ps.STATUS_PRODUCTION_STEPS = ?`);
      params.push(STATUS);
    }

    if (ID_USERS != null) {
      conditions.push(`ps.ID_USERS = ?`);
      params.push(ID_USERS);
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

    // Cập nhật production_steps
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

    if (result.affectedRows === 0) return false;

    // Lấy tất cả bước của kế hoạch production_plans
    const [steps] = await db.query(
      `SELECT STATUS_PRODUCTION_STEPS, ID_USERS FROM production_steps WHERE ID_PRODUCTION_PLANS = ?`,
      [ID_PRODUCTION_PLANS]
    );

    // Kiểm tra xem tất cả bước đã hoàn thành chưa
    const allCompleted = steps.every(
      (step) => step.STATUS_PRODUCTION_STEPS === "COMPLETED"
    );

    if (allCompleted) {
      // Cập nhật trạng thái kế hoạch sản xuất thành COMPLETED
      await db.query(
        `UPDATE production_plans SET STATUS_PRODUCTION_PLANS = ? WHERE ID_PRODUCTION_PLANS = ?`,
        ["COMPLETED", ID_PRODUCTION_PLANS]
      );

      // Lấy thông tin kế hoạch sản xuất
      const [plans] = await db.query(
        `SELECT ID_PRODUCT, ID_USERS, QUANTITY_PRODUCT FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
        [ID_PRODUCTION_PLANS]
      );
      if (plans.length === 0) throw new Error("Production plan not found");

      const plan = plans[0];

      // Lấy thông tin sản phẩm
      const [products] = await db.query(
        `SELECT * FROM products WHERE ID_PRODUCT = ?`,
        [plan.ID_PRODUCT]
      );
      if (products.length === 0) throw new Error("Product not found");

      const product = products[0];

      // Tổng hợp ID_USERS từ tất cả bước (có thể là JSON hoặc id đơn)
      let usersSet = new Set();

      for (const step of steps) {
        try {
          let usersInStep = JSON.parse(step.ID_USERS);
          if (Array.isArray(usersInStep)) {
            usersInStep.forEach((u) => usersSet.add(u));
          } else {
            usersSet.add(usersInStep);
          }
        } catch {
          usersSet.add(step.ID_USERS);
        }
      }

      // Thêm người chịu trách nhiệm kế hoạch sản xuất
      try {
        let planUsers = JSON.parse(plan.ID_USERS);
        if (Array.isArray(planUsers)) {
          planUsers.forEach((u) => usersSet.add(u));
        } else {
          usersSet.add(planUsers);
        }
      } catch {
        usersSet.add(plan.ID_USERS);
      }

      // Lấy thông tin user chi tiết từ bảng users
      const userIds = Array.from(usersSet);

      const [usersDetails] = await db.query(
        `SELECT ID_USERS, HO_TEN, EMAIL, SO_DIEN_THOAI, AVATAR, DIA_CHI_Provinces, DIA_CHI_Districts, DIA_CHI_Wards, DIA_CHI_STREETNAME, TRANG_THAI_USER, ID_COMPANY 
         FROM users 
         WHERE ID_USERS IN (?) AND IS_DELETE_USERS = 0`,
        [userIds]
      );

      const usersJsonDetailed = JSON.stringify(usersDetails);

      // Tạo UID và SERIAL_CODE cho product_instances
      const uid = uuidv4();
      const serialCode = `PROD${product.ID_PRODUCT}${Date.now()}`;

      const STATUS = {
        AVAILABLE: "AVAILABLE",
        OUT_OF_STOCK: "OUT_OF_STOCK",
        DISCONTINUED: "DISCONTINUED",
        SOLD: "SOLD",
        RESERVED: "RESERVED",
        DAMAGED: "DAMAGED",
      };

      // Insert bản ghi mới vào product_instances với thông tin user chi tiết
      await db.query(
        `INSERT INTO product_instances 
         (UID, ID_PRODUCT, SERIAL_CODE, ID_USERS, ID_PRODUCTION_PLANS, DATE_CREATED, STATUS, ID_COMPANY,QUANTITY) 
         VALUES (?, ?, ?, ?, ?, NOW(), ?, ? , ?)`,
        [
          uid,
          product.ID_PRODUCT,
          serialCode,
          usersJsonDetailed,
          ID_PRODUCTION_PLANS,
          STATUS.AVAILABLE,
          product.ID_COMPANY,
          plan?.QUANTITY_PRODUCT,
        ]
      ); // Lấy danh sách nguyên liệu cần dùng cho kế hoạch sản xuất đó

      const [materialsNeeded] = await db.query(
        `SELECT pm.ID_MATERIALS_, pm.QUANTITY_PER_UNIT_PRODUCT_MATERIALS, m.QUANTITY
   FROM production_materials pm
   JOIN materials m ON pm.ID_MATERIALS_ = m.ID_MATERIALS_
   WHERE pm.ID_PRODUCTION_PLANS = ? AND pm.ID_COMPANY = ? AND m.ID_COMPANY = ?`,
        [ID_PRODUCTION_PLANS, product.ID_COMPANY, product.ID_COMPANY]
      );

      // Cập nhật lại số lượng nguyên liệu sau khi tạo product_instance (giả sử tạo 1 sản phẩm mới)
      for (const material of materialsNeeded) {
        const newQuantity =
          material.QUANTITY - material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS;

        // Bạn có thể thêm kiểm tra newQuantity không âm, tránh âm kho nếu muốn
        if (newQuantity < 0) {
          console.warn(
            `Warning: Nguyên liệu ${material.ID_MATERIALS_} bị trừ vượt mức (âm).`
          );
        }

        await db.query(
          `UPDATE materials SET QUANTITY = ? WHERE ID_MATERIALS_ = ? AND ID_COMPANY = ?`,
          [newQuantity, material.ID_MATERIALS_, product.ID_COMPANY]
        );
      }
    }

    return true;
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
