const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả các sản phẩm
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("products", "view"),
  getAllProducts
);

// Tạo sản phẩm
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("products", "create"),
  createProduct
);

// Lấy sản phẩm theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("products", "view"),
  getProductById
);

// Cập nhật sản phẩm
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("products", "update"),
  updateProduct
);

// Xóa sản phẩm
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("products", "delete"),
  deleteProduct
);

module.exports = router;
