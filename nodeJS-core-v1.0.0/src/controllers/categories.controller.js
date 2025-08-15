const CategoryService = require("../services/categories.service");

const getAllCategories = async (req, res) => {
  try {
    const companyId = req.query.ID_COMPANY; // lấy companyId từ query param
    const categories = await CategoryService.getAll(companyId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { NAME_CATEGORIES_, ID_COMPANY } = req.body;
    if (!ID_COMPANY) {
      return res.status(400).json({ message: "ID_COMPANY is required" });
    }
    const id = await CategoryService.create({ NAME_CATEGORIES_, ID_COMPANY });
    res.status(201).json({ message: "Category created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { NAME_CATEGORIES_, ID_COMPANY } = req.body;
    if (!ID_COMPANY) {
      return res.status(400).json({ message: "ID_COMPANY is required" });
    }
    const updated = await CategoryService.update(id, {
      NAME_CATEGORIES_,
      ID_COMPANY,
    });
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
