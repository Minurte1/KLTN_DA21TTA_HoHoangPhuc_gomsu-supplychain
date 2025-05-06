const express = require("express");
const router = express.Router();
const {
  getAllProductionSteps,
  createProductionStep,
  getProductionStepById,
  updateProductionStep,
  deleteProductionStep,
} = require("../controllers/production_steps.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các bước sản xuất
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_steps", "view"),
  getAllProductionSteps
);

// Tạo bước sản xuất
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_steps", "create"),
  createProductionStep
);

// Lấy bước sản xuất theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_steps", "view"),
  getProductionStepById
);

// Cập nhật bước sản xuất
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_steps", "update"),
  updateProductionStep
);

// Xóa bước sản xuất
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_steps", "delete"),
  deleteProductionStep
);

module.exports = router;
