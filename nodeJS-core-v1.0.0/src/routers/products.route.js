const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

// Tạo sản phẩm với upload ảnh
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("products", "create"),
  upload.single("IMAGE_URL_PRODUCTS"),
  createProduct
);

// Cập nhật sản phẩm có upload ảnh
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("products", "update"),
  upload.single("IMAGE_URL_PRODUCTS"),
  updateProduct
);

// Các route khác giữ nguyên
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

module.exports = router;
