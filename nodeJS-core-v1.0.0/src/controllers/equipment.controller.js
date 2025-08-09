const EquipmentService = require("../services/equipment.service");

const getAllEquipment = async (req, res) => {
  try {
    const { STATUS, TYPE_EQUIPMENT } = req.query;
    const equipmentList = await EquipmentService.getAll(STATUS, TYPE_EQUIPMENT);
    res.json(equipmentList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const { NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE } =
      req.body;

    const id = await EquipmentService.create({
      NAME_EQUIPMENT,
      TYPE_EQUIPMENT,
      STATUS,
      LAST_MAINTENANCE,
    });

    res.status(201).json({ message: "Equipment created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await EquipmentService.getById(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME_EQUIPMENT, TYPE_EQUIPMENT, STATUS, LAST_MAINTENANCE } =
      req.body;

    const updated = await EquipmentService.update(id, {
      NAME_EQUIPMENT,
      TYPE_EQUIPMENT,
      STATUS,
      LAST_MAINTENANCE,
    });

    if (!updated) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json({ message: "Equipment updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EquipmentService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEquipment,
  createEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
