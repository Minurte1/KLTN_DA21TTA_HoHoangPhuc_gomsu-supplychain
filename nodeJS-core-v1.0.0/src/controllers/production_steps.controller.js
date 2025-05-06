const ProductionStepService = require("../services/production_steps.service");

const getAllProductionSteps = async (req, res) => {
  try {
    const data = await ProductionStepService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductionStep = async (req, res) => {
  try {
    const id = await ProductionStepService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductionStepById = async (req, res) => {
  try {
    const data = await ProductionStepService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductionStep = async (req, res) => {
  try {
    const success = await ProductionStepService.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductionStep = async (req, res) => {
  try {
    const success = await ProductionStepService.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductionSteps,
  createProductionStep,
  getProductionStepById,
  updateProductionStep,
  deleteProductionStep,
};
