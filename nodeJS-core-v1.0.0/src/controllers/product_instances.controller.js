const ProductInstancesService = require("../services/product_instances.service");

const getAllProductInstances = async (req, res) => {
  try {
    const { ID_COMPANY, STATUS } = req.query;
    const productInstances = await ProductInstancesService.getAll(
      ID_COMPANY,
      STATUS
    );
    res.json(productInstances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductInstance = async (req, res) => {
  try {
    const {
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS,
      ID_COMPANY,
      QUANTITY,
    } = req.body;

    const id = await ProductInstancesService.create({
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS,
      ID_COMPANY,
      QUANTITY,
    });

    res.status(201).json({ message: "Product instance created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const productInstance = await ProductInstancesService.getById(id);
    if (!productInstance) {
      return res.status(404).json({ message: "Product instance not found" });
    }
    res.json(productInstance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS,
      ID_COMPANY,
      QUANTITY,
    } = req.body;

    const updated = await ProductInstancesService.update(id, {
      UID,
      ID_PRODUCT,
      SERIAL_CODE,
      ID_USERS,
      ID_PRODUCTION_PLANS,
      DATE_CREATED,
      STATUS,
      ID_COMPANY,
      QUANTITY,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product instance not found" });
    }

    res.json({ message: "Product instance updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductInstancesService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product instance not found" });
    }
    res.json({ message: "Product instance deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProductInstancesPublic = async (req, res) => {
  try {
    const { STATUS, SERIAL_CODE, LIMIT, ID_CATEGORIES_ } = req.query;
    const parsedLimit = LIMIT ? parseInt(LIMIT, 10) : 12;

    const productInstances =
      await ProductInstancesService.getAllProductInstancesPublic(
        STATUS,
        parsedLimit,
        SERIAL_CODE,
        ID_CATEGORIES_
      );

    res.json(productInstances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const globalSearchController = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: "Missing keyword" });
    }
    const results = await ProductInstancesService.globalSearch(keyword);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllProductInstances,
  createProductInstance,
  getProductInstanceById,
  updateProductInstance,
  deleteProductInstance,
  getAllProductInstancesPublic,
  globalSearchController,
};
