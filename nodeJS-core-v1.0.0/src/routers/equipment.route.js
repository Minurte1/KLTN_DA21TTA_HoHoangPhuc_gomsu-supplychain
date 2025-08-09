const express = require("express");
const router = express.Router();

const {
  getAllEquipment,
  createEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipment.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả thiết bị
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("equipment", "view"),
  getAllEquipment
);

// Tạo thiết bị
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("equipment", "create"),
  createEquipment
);

// Lấy thiết bị theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("equipment", "view"),
  getEquipmentById
);

// Cập nhật thiết bị
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("equipment", "update"),
  updateEquipment
);

// Xóa thiết bị
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("equipment", "delete"),
  deleteEquipment
);

module.exports = router;
