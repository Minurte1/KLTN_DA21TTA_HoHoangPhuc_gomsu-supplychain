const express = require("express");
const router = express.Router();
const {
  getAllOrderItems,
  createOrderItem,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
} = require("../controllers/order_items.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các order item
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("order_items", "view"),
  getAllOrderItems
);

// Tạo order item mới
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("order_items", "create"),
  createOrderItem
);

// Lấy order item theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("order_items", "view"),
  getOrderItemById
);

// Cập nhật order item
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("order_items", "update"),
  updateOrderItem
);

// Xóa order item
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("order_items", "delete"),
  deleteOrderItem
);

module.exports = router;
