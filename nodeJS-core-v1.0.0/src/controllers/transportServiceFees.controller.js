const TransportServiceFeesService = require("../services/transportServiceFees.service");

const getAllFees = async (req, res) => {
  try {
    const data = await TransportServiceFeesService.getAll();
    res.json(data);
  } catch (err) {
    console.error("transport_service_fees", err);
    res.status(500).json({ error: err.message });
  }
};

const createFee = async (req, res) => {
  try {
    const id = await TransportServiceFeesService.create(req.body);
    res.status(201).json({ message: "Created", id });
  } catch (err) {
    console.error("transport_service_fees", err);
    res.status(500).json({ error: err.message });
  }
};

const getFeeById = async (req, res) => {
  try {
    const item = await TransportServiceFeesService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("transport_service_fees", err);
    res.status(500).json({ error: err.message });
  }
};

const updateFee = async (req, res) => {
  try {
    const updated = await TransportServiceFeesService.update(
      req.params.id,
      req.body
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("transport_service_fees", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteFee = async (req, res) => {
  try {
    const deleted = await TransportServiceFeesService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("transport_service_fees", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllFees,
  createFee,
  getFeeById,
  updateFee,
  deleteFee,
};
