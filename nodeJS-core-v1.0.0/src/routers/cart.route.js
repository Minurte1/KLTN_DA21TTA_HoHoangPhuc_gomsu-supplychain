const express = require("express");
const router = express.Router();
const {
  getAllCarts,
  createCart,
  getCartById,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các giỏ hàng
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("cart", "view"),
  getAllCarts
);

// Tạo giỏ hàng
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("cart", "create"),
  createCart
);

// Lấy giỏ hàng theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("cart", "view"),
  getCartById
);

// Cập nhật giỏ hàng
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("cart", "update"),
  updateCart
);

// Xóa giỏ hàng
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("cart", "delete"),
  deleteCart
);

module.exports = router;
