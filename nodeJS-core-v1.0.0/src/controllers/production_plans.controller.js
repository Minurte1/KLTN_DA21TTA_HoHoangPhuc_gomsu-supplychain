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

    // Thêm vào production_plans
    const [planResult] = await connection.query(
      `INSERT INTO production_plans 
        (ID_PRODUCT, ID_USERS, PLANNED_START_PRODUCTION_PLANS, PLANNED_END_PRODUCTION_PLANS, ACTUAL_START_PRODUCTION_PLANS, ACTUAL_END_PRODUCTION_PLANS, STATUS_PRODUCTION_PLANS, NOTE_PRODUCTION_PLANS, ID_COMPANY, NAME_PRODUCTION_PLAN)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        NAME_PRODUCTION_PLAN || null,
      ]
    );

    const newProductionPlanId = planResult.insertId;

    // Thêm dữ liệu vào production_materials
    for (const material of production_material) {
      await connection.query(
        `INSERT INTO production_materials 
          (ID_PRODUCT_MATERIALS, ID_PRODUCTION_PLANS, ID_MATERIALS_, QUANTITY_PER_UNIT_PRODUCT_MATERIALS, UNIT_PRODUCT_MATERIALS, ID_COMPANY)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          parseInt(material.ID_PRODUCT_MATERIALS, 10) || null,
          newProductionPlanId,
          parseInt(material.ID_MATERIALS, 10) || null,
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

    // Cập nhật production_plans
    const [updateResult] = await connection.query(
      `UPDATE production_plans
        SET ID_PRODUCT = ?, ID_USERS = ?, PLANNED_START_PRODUCTION_PLANS = ?, PLANNED_END_PRODUCTION_PLANS = ?, ACTUAL_START_PRODUCTION_PLANS = ?, ACTUAL_END_PRODUCTION_PLANS = ?, STATUS_PRODUCTION_PLANS = ?, NOTE_PRODUCTION_PLANS = ?, ID_COMPANY = ?, NAME_PRODUCTION_PLAN = ?
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
      await connection.query(
        `INSERT INTO production_materials 
          (ID_PRODUCT_MATERIALS, ID_PRODUCTION_PLANS, ID_MATERIALS_, QUANTITY_PER_UNIT_PRODUCT_MATERIALS, UNIT_PRODUCT_MATERIALS, ID_COMPANY)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          parseInt(material.ID_PRODUCT_MATERIALS, 10) || null,
          parseInt(id, 10),
          parseInt(material.ID_MATERIALS, 10) || null,
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
