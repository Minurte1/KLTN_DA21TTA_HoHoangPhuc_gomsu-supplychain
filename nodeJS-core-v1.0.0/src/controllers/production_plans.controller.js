const ProductionPlansService = require("../services/production_plans.service");

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
    } = req.body;

    const id = await ProductionPlansService.create({
      ID_PRODUCT: parseInt(ID_PRODUCT, 10),
      ID_USERS: parseInt(ID_USERS, 10),
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
      ID_COMPANY: parseInt(ID_COMPANY, 10),
      NAME_PRODUCTION_PLAN,
    });

    res.status(201).json({ message: "Production plan created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
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
    } = req.body;

    const updated = await ProductionPlansService.update(id, {
      ID_PRODUCT: parseInt(ID_PRODUCT, 10),
      ID_USERS: parseInt(ID_USERS, 10),
      PLANNED_START_PRODUCTION_PLANS,
      PLANNED_END_PRODUCTION_PLANS,
      ACTUAL_START_PRODUCTION_PLANS,
      ACTUAL_END_PRODUCTION_PLANS,
      STATUS_PRODUCTION_PLANS,
      NOTE_PRODUCTION_PLANS,
      ID_COMPANY: parseInt(ID_COMPANY, 10),
      NAME_PRODUCTION_PLAN,
    });

    if (!updated) {
      return res.status(404).json({ message: "Production plan not found" });
    }

    res.json({ message: "Production plan updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductionPlansService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Production plan not found" });
    }
    res.json({ message: "Production plan deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductionPlans,
  createProductionPlan,
  getProductionPlanById,
  updateProductionPlan,
  deleteProductionPlan,
};
