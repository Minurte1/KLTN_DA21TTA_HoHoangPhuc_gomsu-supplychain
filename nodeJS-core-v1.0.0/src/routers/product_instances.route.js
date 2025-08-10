const express = require("express");
const router = express.Router();

const {
  getAllProductInstances,
  createProductInstance,
  getProductInstanceById,
  updateProductInstance,
  deleteProductInstance,
} = require("../controllers/product_instances.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả bản ghi product_instances
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("product_instance", "view"),
  getAllProductInstances
);

// Tạo mới product_instance
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("product_instance", "create"),
  createProductInstance
);

// Lấy product_instance theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("product_instance", "view"),
  getProductInstanceById
);

// Cập nhật product_instance
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("product_instance", "update"),
  updateProductInstance
);

// Xóa product_instance
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("product_instance", "delete"),
  deleteProductInstance
);

module.exports = router;
