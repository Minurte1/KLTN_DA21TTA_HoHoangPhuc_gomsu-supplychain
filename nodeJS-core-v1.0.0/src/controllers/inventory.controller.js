const InventoryService = require("../services/inventory.service");

const getAllInventories = async (req, res) => {
  try {
    const inventories = await InventoryService.getAll();
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInventory = async (req, res) => {
  try {
    const {
      ID_MATERIALS_,
      QUANTITY_ORDER_ITEMS,
      LAST_UPDATED_,
      STORAGE_CONDITION,
    } = req.body;
    const id = await InventoryService.create({
      ID_MATERIALS_,
      QUANTITY_ORDER_ITEMS,
      LAST_UPDATED_,
      STORAGE_CONDITION,
    });
    res.status(201).json({ message: "Inventory created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await InventoryService.getById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_MATERIALS_,
      QUANTITY_ORDER_ITEMS,
      LAST_UPDATED_,
      STORAGE_CONDITION,
    } = req.body;
    const updated = await InventoryService.update(id, {
      ID_MATERIALS_,
      QUANTITY_ORDER_ITEMS,
      LAST_UPDATED_,
      STORAGE_CONDITION,
    });
    if (!updated) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.json({ message: "Inventory updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InventoryService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.json({ message: "Inventory deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
