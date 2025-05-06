const OrderItemsService = require("../services/order_items.service");

const getAllOrderItems = async (req, res) => {
  try {
    const data = await OrderItemsService.getAll();
    res.json(data);
  } catch (err) {
    console.error("order_items", err);
    res.status(500).json({ error: err.message });
  }
};

const createOrderItem = async (req, res) => {
  try {
    const id = await OrderItemsService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (err) {
    console.error("order_items", err);
    res.status(500).json({ error: err.message });
  }
};

const getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItemsService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("order_items", err);
    res.status(500).json({ error: err.message });
  }
};

const updateOrderItem = async (req, res) => {
  try {
    const updated = await OrderItemsService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("order_items", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItemsService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("order_items", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOrderItems,
  createOrderItem,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
