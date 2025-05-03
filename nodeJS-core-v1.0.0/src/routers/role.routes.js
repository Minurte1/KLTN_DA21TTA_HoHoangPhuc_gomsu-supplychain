const express = require("express");
const router = express.Router();
const {
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/role.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả role
router.get("/", checkUserJWT, checkUserPermission("role", "view"), getRoles);

// Tạo role
router.post(
  "/",
  checkUserJWT,
  checkUserPermission("role", "create"),
  createRole
);

// Lấy role theo ID
router.get(
  "/:id",
  checkUserJWT,
  checkUserPermission("role", "view"),
  getRoleById
);

// Cập nhật role
router.put(
  "/:id",
  checkUserJWT,
  checkUserPermission("role", "update"),
  updateRole
);

// Xóa role
router.delete(
  "/:id",
  checkUserJWT,
  checkUserPermission("role", "delete"),
  deleteRole
);

module.exports = router;
