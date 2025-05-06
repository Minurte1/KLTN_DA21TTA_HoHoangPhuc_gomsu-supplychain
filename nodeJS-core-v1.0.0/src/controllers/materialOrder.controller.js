const MaterialOrderService = require("../services/materialOrder.service");

const getAllMaterialOrders = async (req, res) => {
  try {
    const materialOrders = await MaterialOrderService.getAll();
    res.json(materialOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaterialOrder = async (req, res) => {
  try {
    const {
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;
    const id = await MaterialOrderService.create({
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    });
    res.status(201).json({ message: "Material Order created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const materialOrder = await MaterialOrderService.getById(id);
    if (!materialOrder) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json(materialOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterialOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    } = req.body;
    const updated = await MaterialOrderService.update(id, {
      ID_MATERIALS_,
      ID_SUPPLIERS,
      QUANTITY_ORDERED,
      ORDER_DATE,
      DELIVERY_DATE,
      STATUS,
      TOTAL_COST,
    });
    if (!updated) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json({ message: "Material Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterialOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaterialOrderService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Material Order not found" });
    }
    res.json({ message: "Material Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMaterialOrders,
  createMaterialOrder,
  getMaterialOrderById,
  updateMaterialOrder,
  deleteMaterialOrder,
};
