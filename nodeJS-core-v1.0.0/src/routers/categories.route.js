const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các danh mục
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("categories", "view"),
  getAllCategories
);

// Tạo danh mục
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("categories", "create"),
  createCategory
);

// Lấy danh mục theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("categories", "view"),
  getCategoryById
);

// Cập nhật danh mục
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("categories", "update"),
  updateCategory
);

// Xóa danh mục
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("categories", "delete"),
  deleteCategory
);

module.exports = router;
