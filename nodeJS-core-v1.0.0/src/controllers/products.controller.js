const ProductService = require("../services/products.service");

const getAllProducts = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query; // Lấy param từ URL

    const products = await ProductService.getAll(ID_COMPANY);
    res.json(products);
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

const createProduct = async (req, res) => {
  try {
    const {
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,

      ID_COMPANY,
    } = req.body;

    // Lấy đường dẫn ảnh nếu có
    const IMAGE_URL_PRODUCTS = req.file ? `/images/${req.file.filename}` : null;

    const id = await ProductService.create({
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,

      IMAGE_URL_PRODUCTS,
      ID_COMPANY,
    });
    res.status(201).json({ message: "Product created", id });
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

      ID_COMPANY,
    } = req.body;

    const IMAGE_URL_PRODUCTS = req.file ? `/images/${req.file.filename}` : null;

    // Truyền IMAGE_URL_PRODUCTS chỉ khi có file mới
    const dataToUpdate = {
      ID_CATEGORIES_,
      NAME_PRODUCTS,
      DESCRIPTION_PRODUCTS,
      PRICE_PRODUCTS,

      ID_COMPANY,
    };
    if (IMAGE_URL_PRODUCTS) {
      dataToUpdate.IMAGE_URL_PRODUCTS = IMAGE_URL_PRODUCTS;
    }

    const updated = await ProductService.update(id, dataToUpdate);
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
