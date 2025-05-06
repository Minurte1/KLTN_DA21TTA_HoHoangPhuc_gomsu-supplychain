const express = require("express");
const router = express.Router();
const {
  getAllProductionPlans,
  createProductionPlan,
  getProductionPlanById,
  updateProductionPlan,
  deleteProductionPlan,
} = require("../controllers/production_plans.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các kế hoạch sản xuất
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_plans", "view"),
  getAllProductionPlans
);

// Tạo kế hoạch sản xuất
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("production_plans", "create"),
  createProductionPlan
);

// Lấy kế hoạch sản xuất theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_plans", "view"),
  getProductionPlanById
);

// Cập nhật kế hoạch sản xuất
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_plans", "update"),
  updateProductionPlan
);

// Xóa kế hoạch sản xuất
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("production_plans", "delete"),
  deleteProductionPlan
);

module.exports = router;
