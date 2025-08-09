const ProductionStepsService = require("../services/production_steps.service");

const getAllProductionSteps = async (req, res) => {
  try {
    const { ID_COMPANY, STATUS } = req.query;
    const productionSteps = await ProductionStepsService.getAll(
      ID_COMPANY,
      STATUS
    );
    res.json(productionSteps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductionStep = async (req, res) => {
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
    } = req.body;

    const id = await ProductionStepsService.create({
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      ID_COMPANY,
    });

    res.status(201).json({ message: "Production step created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductionStepById = async (req, res) => {
  try {
    const { id } = req.params;
    const productionStep = await ProductionStepsService.getById(id);
    if (!productionStep) {
      return res.status(404).json({ message: "Production step not found" });
    }
    res.json(productionStep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductionStep = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      ID_COMPANY,
    } = req.body;

    const updated = await ProductionStepsService.update(id, {
      ID_PRODUCTION_PLANS,
      ID_USERS,
      ID_EQUIPMENT,
      STEP_NAME_PRODUCTION_STEPS,
      START_TIME_PRODUCTION_STEPS,
      END_TIME_PRODUCTION_STEPS,
      STATUS_PRODUCTION_STEPS,
      ID_COMPANY,
    });

    if (!updated) {
      return res.status(404).json({ message: "Production step not found" });
    }

    res.json({ message: "Production step updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductionStep = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductionStepsService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Production step not found" });
    }
    res.json({ message: "Production step deleted" });
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
