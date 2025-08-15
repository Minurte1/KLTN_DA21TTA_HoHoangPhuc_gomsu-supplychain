const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderUsersById,
} = require("../controllers/orders.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả đơn hàng
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("orders", "view"),
  getAllOrders
);

// Tạo đơn hàng
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("orders", "create"),
  createOrder
);
router.get(
  "/user/:id",
  // checkUserJWT,
  // checkUserPermission("orders", "view"),
  getOrderUsersById
); //get orders theo users
// Lấy đơn hàng theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("orders", "view"),
  getOrderById
);

// Cập nhật đơn hàng
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("orders", "update"),
  updateOrder
);

// Xóa đơn hàng
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("orders", "delete"),
  deleteOrder
);

module.exports = router;
