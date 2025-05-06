const express = require("express");
const router = express.Router();
const {
  getAllMaterialOrders,
  createMaterialOrder,
  getMaterialOrderById,
  updateMaterialOrder,
  deleteMaterialOrder,
} = require("../controllers/materialOrder.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các đơn đặt hàng nguyên liệu
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_order", "view"),
  getAllMaterialOrders
);

// Tạo đơn đặt hàng nguyên liệu
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_order", "create"),
  createMaterialOrder
);

// Lấy đơn đặt hàng nguyên liệu theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order", "view"),
  getMaterialOrderById
);

// Cập nhật đơn đặt hàng nguyên liệu
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order", "update"),
  updateMaterialOrder
);

// Xóa đơn đặt hàng nguyên liệu
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_order", "delete"),
  deleteMaterialOrder
);

module.exports = router;
