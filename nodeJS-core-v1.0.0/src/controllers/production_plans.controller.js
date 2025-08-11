const ProductionPlansService = require("../services/production_plans.service");
const moment = require("moment");

const db = require("../config/database");
const getAllProductionPlans = async (req, res) => {
  try {
    const { ID_COMPANY, STATUS_PRODUCTION_PLANS } = req.query;
    const plans = await ProductionPlansService.getAll(
      ID_COMPANY,
      STATUS_PRODUCTION_PLANS
    );
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductionPlan = async (req, res) => {
  const connection = await db.getConnection(); // Dùng transaction để đảm bảo toàn vẹn
  try {
    await connection.beginTransaction();

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
      production_material = [],
    } = req.body;

    // Format ngày giờ
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

    // Kiểm tra QUANTITY_PER_UNIT_PRODUCT_MATERIALS với QUANTITY trong bảng materials
    for (const material of production_material) {
      const ID_MATERIALS = material.ID_MATERIALS_
        ? material.ID_MATERIALS_
        : material.ID_MATERIALS;

      // Lấy số lượng QUANTITY trong materials của vật liệu này
      const [rows] = await connection.query(
        "SELECT QUANTITY FROM materials WHERE ID_MATERIALS_ = ? AND ID_COMPANY = ?",
        [parseInt(ID_MATERIALS, 10), parseInt(material.ID_COMPANY, 10)]
      );

      if (rows.length === 0) {
        // Không tìm thấy vật liệu tương ứng
        await connection.rollback();
        return res.status(400).json({
          error: `Material with ID ${ID_MATERIALS} not found in materials table`,
        });
      }

      const availableQuantity = rows[0].QUANTITY;

      // So sánh với QUANTITY_PER_UNIT_PRODUCT_MATERIALS
      if (
        material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS !== null &&
        material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS !== undefined &&
        Number(material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS) > availableQuantity
      ) {
        await connection.rollback();
        return res.status(400).json({
          error: `Số lượng nguyên liệu trên mỗi đơn vị sản phẩm (${material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS}) lớn hơn số lượng hiện có (${availableQuantity}) đối với nguyên liệu ID ${ID_MATERIALS}`,
        });
      }
    }

    // Nếu qua hết vòng kiểm tra, bắt đầu tạo kế hoạch sản xuất
    const [planResult] = await connection.query(
      `INSERT INTO production_plans 
        (ID_PRODUCT, ID_USERS, PLANNED_START_PRODUCTION_PLANS, PLANNED_END_PRODUCTION_PLANS, ACTUAL_START_PRODUCTION_PLANS, ACTUAL_END_PRODUCTION_PLANS, STATUS_PRODUCTION_PLANS, NOTE_PRODUCTION_PLANS, ID_COMPANY, QUANTITY_PRODUCT, NAME_PRODUCTION_PLAN)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(ID_PRODUCT, 10) || null,
        parseInt(ID_USERS, 10) || null,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        STATUS_PRODUCTION_PLANS || null,
        NOTE_PRODUCTION_PLANS || null,
        parseInt(ID_COMPANY, 10) || null,
        parseInt(QUANTITY_PRODUCT, 10) || null,
        NAME_PRODUCTION_PLAN || null,
      ]
    );

    const newProductionPlanId = planResult.insertId;

    // Thêm dữ liệu vào production_materials
    for (const material of production_material) {
      const ID_MATERIALS = material.ID_MATERIALS_
        ? material.ID_MATERIALS_
        : material.ID_MATERIALS;

      await connection.query(
        `INSERT INTO production_materials 
          (ID_PRODUCT_MATERIALS, ID_PRODUCTION_PLANS, ID_MATERIALS_, QUANTITY_PER_UNIT_PRODUCT_MATERIALS, UNIT_PRODUCT_MATERIALS, ID_COMPANY)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          parseInt(material.ID_PRODUCT_MATERIALS, 10) || null,
          newProductionPlanId,
          parseInt(ID_MATERIALS, 10) || null,
          material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS || null,
          material.UNIT_PRODUCT_MATERIALS || null,
          parseInt(material.ID_COMPANY, 10),
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Production plan and materials created",
      productionPlanId: newProductionPlanId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error in createProductionPlan:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

const getProductionPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await ProductionPlansService.getById(id);
    if (!plan) {
      return res.status(404).json({ message: "Production plan not found" });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductionPlan = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
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
      production_material = [],
    } = req.body;

    // Format ngày giờ
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

    // Kiểm tra số lượng nguyên liệu có đủ trong materials hay không
    for (const material of production_material) {
      const materialId = material.ID_MATERIALS_
        ? material.ID_MATERIALS_
        : material.ID_MATERIALS;

      const requestedQuantity = parseFloat(
        material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS
      );

      if (!materialId) {
        await connection.rollback();
        return res.status(400).json({ message: "Invalid material ID" });
      }

      // Lấy số lượng hiện tại trong materials
      const [rows] = await connection.query(
        `SELECT QUANTITY FROM materials WHERE ID_MATERIALS_ = ? AND ID_COMPANY = ?`,
        [materialId, parseInt(material.ID_COMPANY, 10)]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ message: `Material with ID ${materialId} not found` });
      }

      const availableQuantity = parseFloat(rows[0].QUANTITY);

      if (requestedQuantity > availableQuantity) {
        await connection.rollback();
        return res.status(400).json({
          message: `Số lượng yêu cầu (${requestedQuantity}) cho nguyên liệu ID ${materialId} vượt quá số lượng hiện có (${availableQuantity})`,
        });
      }
    }

    // Nếu qua kiểm tra, thực hiện cập nhật production_plans
    const [updateResult] = await connection.query(
      `UPDATE production_plans
       SET ID_PRODUCT = ?, ID_USERS = ?, PLANNED_START_PRODUCTION_PLANS = ?, PLANNED_END_PRODUCTION_PLANS = ?, ACTUAL_START_PRODUCTION_PLANS = ?, ACTUAL_END_PRODUCTION_PLANS = ?, STATUS_PRODUCTION_PLANS = ?, NOTE_PRODUCTION_PLANS = ?, ID_COMPANY = ?, QUANTITY_PRODUCT = ?, NAME_PRODUCTION_PLAN = ?
       WHERE ID_PRODUCTION_PLANS = ?`,
      [
        parseInt(ID_PRODUCT, 10) || null,
        parseInt(ID_USERS, 10) || null,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        STATUS_PRODUCTION_PLANS || null,
        NOTE_PRODUCTION_PLANS || null,
        parseInt(ID_COMPANY, 10),
        parseInt(QUANTITY_PRODUCT, 10),
        NAME_PRODUCTION_PLAN || null,
        parseInt(id, 10),
      ]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Production plan not found" });
    }

    // Xóa dữ liệu cũ trong production_materials
    await connection.query(
      `DELETE FROM production_materials WHERE ID_PRODUCTION_PLANS = ?`,
      [parseInt(id, 10)]
    );

    // Thêm dữ liệu mới vào production_materials
    for (const material of production_material) {
      const ID_MATERIALS = material.ID_MATERIALS_
        ? material.ID_MATERIALS_
        : material.ID_MATERIALS;

      await connection.query(
        `INSERT INTO production_materials 
          (ID_PRODUCT_MATERIALS, ID_PRODUCTION_PLANS, ID_MATERIALS_, QUANTITY_PER_UNIT_PRODUCT_MATERIALS, UNIT_PRODUCT_MATERIALS, ID_COMPANY)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          parseInt(material.ID_PRODUCT_MATERIALS, 10) || null,
          parseInt(id, 10),
          parseInt(ID_MATERIALS, 10) || null,
          material.QUANTITY_PER_UNIT_PRODUCT_MATERIALS || null,
          material.UNIT_PRODUCT_MATERIALS || null,
          parseInt(material.ID_COMPANY, 10),
        ]
      );
    }

    await connection.commit();

    res.json({ message: "Production plan and materials updated" });
  } catch (error) {
    await connection.rollback();
    console.error("Error in updateProductionPlan:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

const deleteProductionPlan = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const planId = parseInt(id, 10);

    // Xóa production_materials trước
    await connection.query(
      `DELETE FROM production_materials WHERE ID_PRODUCTION_PLANS = ?`,
      [planId]
    );

    // Xóa production_plans
    const [deleteResult] = await connection.query(
      `DELETE FROM production_plans WHERE ID_PRODUCTION_PLANS = ?`,
      [planId]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Production plan not found" });
    }

    await connection.commit();

    res.json({ message: "Production plan and materials deleted" });
  } catch (error) {
    await connection.rollback();
    console.error("Error in deleteProductionPlan:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllProductionPlans,
  createProductionPlan,
  getProductionPlanById,
  updateProductionPlan,
  deleteProductionPlan,
};
