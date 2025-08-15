const TransportOrderService = require("../services/transport_order.service");

const getTransportOrders = async (req, res) => {
  try {
    const { STATUS } = req.query; // 👈 nhận status từ query
    const status = STATUS || null;
    const data = await TransportOrderService.getAll(status); // truyền vào service

    res.json(data);
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};

const createTransportOrder = async (req, res) => {
  try {
    const id = await TransportOrderService.create(req.body);
    if (!id) {
      res
        .status(400)
        .json({ message: "Thiếu thông tin người ship người dùng" });
    } else {
      res.status(201).json({ message: "Created", id });
    }
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};

const getTransportOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await TransportOrderService.getById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTransportOrder = async (req, res) => {
  try {
    const updated = await TransportOrderService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTransportOrder = async (req, res) => {
  try {
    const deleted = await TransportOrderService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};
const transportOrdersShipDELIVERING = async (req, res) => {
  try {
    const data = await TransportOrderService.transport_ordersShipDELIVERING();
    res.json(data);
  } catch (error) {
    console.log("transport_order", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTransportOrders,
  createTransportOrder,
  getTransportOrderById,
  updateTransportOrder,
  deleteTransportOrder,
  transportOrdersShipDELIVERING,
};
