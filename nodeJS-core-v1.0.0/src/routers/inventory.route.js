const express = require("express");
const router = express.Router();
const {
  getAllInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả thông tin kho
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("inventory", "view"),
  getAllInventories
);

// Tạo thông tin kho
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("inventory", "create"),
  createInventory
);

// Lấy thông tin kho theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("inventory", "view"),
  getInventoryById
);

// Cập nhật thông tin kho
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("inventory", "update"),
  updateInventory
);

// Xóa thông tin kho
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("inventory", "delete"),
  deleteInventory
);

module.exports = router;
