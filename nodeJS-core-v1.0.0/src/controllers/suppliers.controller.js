const SupplierService = require("../services/suppliers.service");

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierService.getAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const {
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
    } = req.body;
    const id = await SupplierService.create({
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
    });
    res.status(201).json({ message: "Supplier created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await SupplierService.getById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
    } = req.body;
    const updated = await SupplierService.update(id, {
      NAME_PRODUCTS,
      ADDRESS_SUPPLIERS,
      PHONE_SUPPLIERS,
      EMAIL_SUPPLIERS,
      STATUS_SUPPLIERS,
    });
    if (!updated) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SupplierService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
