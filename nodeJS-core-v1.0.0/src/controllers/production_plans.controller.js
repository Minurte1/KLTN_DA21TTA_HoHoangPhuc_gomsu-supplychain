const ProductionPlanService = require("../services/production_plans.service");

const getAllProductionPlans = async (req, res) => {
  try {
    const data = await ProductionPlanService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductionPlan = async (req, res) => {
  try {
    const id = await ProductionPlanService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductionPlanById = async (req, res) => {
  try {
    const data = await ProductionPlanService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductionPlan = async (req, res) => {
  try {
    const success = await ProductionPlanService.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductionPlan = async (req, res) => {
  try {
    const success = await ProductionPlanService.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
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
