const express = require("express");
const router = express.Router();
const {
  getAllProductionMaterials,
  createProductionMaterial,
  getProductionMaterialById,
  updateProductionMaterial,
  deleteProductionMaterial,
} = require("../controllers/production_materials.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả nguyên liệu sản xuất
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_materials", "view"),
  getAllProductionMaterials
);

// Tạo nguyên liệu sản xuất
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_materials", "create"),
  createProductionMaterial
);

// Lấy nguyên liệu theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_materials", "view"),
  getProductionMaterialById
);

// Cập nhật nguyên liệu sản xuất
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_materials", "update"),
  updateProductionMaterial
);

// Xóa nguyên liệu sản xuất
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_materials", "delete"),
  deleteProductionMaterial
);

module.exports = router;
