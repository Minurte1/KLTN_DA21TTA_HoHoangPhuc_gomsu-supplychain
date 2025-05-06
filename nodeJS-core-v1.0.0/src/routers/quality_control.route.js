const express = require("express");
const router = express.Router();
const {
  getAllQualityControls,
  createQualityControl,
  getQualityControlById,
  updateQualityControl,
  deleteQualityControl,
} = require("../controllers/quality_control.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả kiểm định chất lượng
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("quality_control", "view"),
  getAllQualityControls
);

// Tạo mới kiểm định chất lượng
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("quality_control", "create"),
  createQualityControl
);

// Lấy thông tin theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("quality_control", "view"),
  getQualityControlById
);

// Cập nhật kiểm định chất lượng
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("quality_control", "update"),
  updateQualityControl
);

// Xóa bản ghi kiểm định
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("quality_control", "delete"),
  deleteQualityControl
);

module.exports = router;
