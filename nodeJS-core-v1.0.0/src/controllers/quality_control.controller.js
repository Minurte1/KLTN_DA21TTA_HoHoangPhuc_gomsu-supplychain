const QualityControlService = require("../services/quality_control.service");

const getAllQualityControls = async (req, res) => {
  try {
    const data = await QualityControlService.getAll();
    res.json(data);
  } catch (error) {
    console.error("quality_control", error);
    res.status(500).json({ error: error.message });
  }
};

const createQualityControl = async (req, res) => {
  try {
    const id = await QualityControlService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (error) {
    console.error("quality_control", error);
    res.status(500).json({ error: error.message });
  }
};

const getQualityControlById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await QualityControlService.getById(id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    console.error("quality_control", error);
    res.status(500).json({ error: error.message });
  }
};

const updateQualityControl = async (req, res) => {
  try {
    const updated = await QualityControlService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (error) {
    console.error("quality_control", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteQualityControl = async (req, res) => {
  try {
    const deleted = await QualityControlService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("quality_control", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllQualityControls,
  createQualityControl,
  getQualityControlById,
  updateQualityControl,
  deleteQualityControl,
};
