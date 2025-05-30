const MaterialTypesService = require("../services/material_types.service");

const getAllMaterialTypes = async (req, res) => {
  try {
    let { id_company } = req.query;

    // Nếu id_company = 'undefined' hoặc '', chuyển thành undefined thật
    if (id_company === "undefined" || id_company === "") {
      id_company = undefined;
    }

    const materialTypes = await MaterialTypesService.getAll(id_company);
    res.json(materialTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterialType = async (req, res) => {
  try {
    const { NAME_MATERIAL_TYPES, ID_COMPANY } = req.body;
    const id = await MaterialTypesService.create({
      NAME_MATERIAL_TYPES,
      ID_COMPANY,
    });
    res.status(201).json({ message: "Material type created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const materialType = await MaterialTypesService.getById(id);
    if (!materialType) {
      return res.status(404).json({ message: "Material type not found" });
    }
    res.json(materialType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterialType = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME_MATERIAL_TYPES } = req.body;
    const updated = await MaterialTypesService.update(id, {
      NAME_MATERIAL_TYPES,
    });
    if (!updated) {
      return res.status(404).json({ message: "Material type not found" });
    }
    res.json({ message: "Material type updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterialType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialTypesService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Material type not found" });
    }
    res.json({ message: "Material type deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMaterialTypes,
  createMaterialType,
  getMaterialTypeById,
  updateMaterialType,
  deleteMaterialType,
};
