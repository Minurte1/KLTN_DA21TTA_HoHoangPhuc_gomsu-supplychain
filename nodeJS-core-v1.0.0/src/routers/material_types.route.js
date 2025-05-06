const express = require("express");
const router = express.Router();
const {
  getAllMaterialTypes,
  createMaterialType,
  getMaterialTypeById,
  updateMaterialType,
  deleteMaterialType,
} = require("../controllers/material_types.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả loại vật liệu
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_type", "view"),
  getAllMaterialTypes
);

// Tạo loại vật liệu
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("material_type", "create"),
  createMaterialType
);

// Lấy loại vật liệu theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_type", "view"),
  getMaterialTypeById
);

// Cập nhật loại vật liệu
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_type", "update"),
  updateMaterialType
);

// Xóa loại vật liệu
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material_type", "delete"),
  deleteMaterialType
);

module.exports = router;
