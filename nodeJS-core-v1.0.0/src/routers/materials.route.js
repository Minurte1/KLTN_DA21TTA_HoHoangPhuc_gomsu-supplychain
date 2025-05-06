const express = require("express");
const router = express.Router();
const {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materials.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả vật liệu
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("material", "view"),
  getAllMaterials
);

// Tạo vật liệu
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("material", "create"),
  createMaterial
);

// Lấy vật liệu theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material", "view"),
  getMaterialById
);

// Cập nhật vật liệu
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material", "update"),
  updateMaterial
);

// Xóa vật liệu
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("material", "delete"),
  deleteMaterial
);

module.exports = router;
