const ProductionMaterialService = require("../services/production_materials.service");

const getAllProductionMaterials = async (req, res) => {
  try {
    const data = await ProductionMaterialService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductionMaterial = async (req, res) => {
  try {
    const id = await ProductionMaterialService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductionMaterialById = async (req, res) => {
  try {
    const data = await ProductionMaterialService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductionMaterial = async (req, res) => {
  try {
    const success = await ProductionMaterialService.update(
      req.params.id,
      req.body
    );
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductionMaterial = async (req, res) => {
  try {
    const success = await ProductionMaterialService.delete(req.params.id);
    if (!success) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductionMaterials,
  createProductionMaterial,
  getProductionMaterialById,
  updateProductionMaterial,
  deleteProductionMaterial,
};
