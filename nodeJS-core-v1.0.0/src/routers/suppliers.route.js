const express = require("express");
const router = express.Router();
const {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/suppliers.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả nhà cung cấp
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("supplier", "view"),
  getAllSuppliers
);

// Tạo nhà cung cấp
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("supplier", "create"),
  createSupplier
);

// Lấy nhà cung cấp theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("supplier", "view"),
  getSupplierById
);

// Cập nhật nhà cung cấp
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("supplier", "update"),
  updateSupplier
);

// Xóa nhà cung cấp
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("supplier", "delete"),
  deleteSupplier
);

module.exports = router;
