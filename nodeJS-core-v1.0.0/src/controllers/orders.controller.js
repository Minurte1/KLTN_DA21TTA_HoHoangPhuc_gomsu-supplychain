const OrderService = require("../services/orders.service");

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAll();
    res.json(orders);
  } catch (err) {
    console.error("orders", err);
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const id = await OrderService.create(req.body);
    res.status(201).json({ message: "Order created", id });
  } catch (err) {
    console.error("orders", err);
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    console.error("orders", err);
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updated = await OrderService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Order updated" });
  } catch (err) {
    console.error("orders", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deleted = await OrderService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("orders", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
