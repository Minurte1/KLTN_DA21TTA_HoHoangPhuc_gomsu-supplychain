const MaterialsService = require("../services/materials.service");

const getAllMaterials = async (req, res) => {
  try {
    const materials = await MaterialsService.getAll();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const {
      ID_MATERIAL_TYPES,
      NAME_,
      UNIT_,
      QUANTITY,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
    } = req.body;
    const id = await MaterialsService.create({
      ID_MATERIAL_TYPES,
      NAME_,
      UNIT_,
      QUANTITY,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
      ID_COMPANY,
    });
    res.status(201).json({ message: "Material created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await MaterialsService.getById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_MATERIAL_TYPES,
      NAME_,
      UNIT_,
      QUANTITY_ORDER_ITEMS,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
    } = req.body;
    const updated = await MaterialsService.update(id, {
      ID_MATERIAL_TYPES,
      NAME_,
      UNIT_,
      QUANTITY,
      COST_PER_UNIT_,
      ORIGIN,
      EXPIRY_DATE,
    });
    if (!updated) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialsService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
