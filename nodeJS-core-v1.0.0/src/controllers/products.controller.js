const ProductService = require("../services/products.service");

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
    } = req.body;
    const id = await ProductService.create({
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
    });
    res.status(201).json({ message: "Product created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
    } = req.body;
    const updated = await ProductService.update(id, {
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,
      STOCK_PRODUCTS,
      IMAGE_URL_PRODUCTS,
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
