const express = require("express");
const router = express.Router();
const {
  getCompanyTypes,
  createCompanyType,
  getCompanyTypeById,
  updateCompanyType,
  deleteCompanyType,
} = require("../controllers/companyType.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả loại công ty
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("company_type", "view"),
  getCompanyTypes
);

// Tạo loại công ty
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("company_type", "create"),
  createCompanyType
);

// Lấy loại công ty theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company_type", "view"),
  getCompanyTypeById
);

// Cập nhật loại công ty
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company_type", "update"),
  updateCompanyType
);

// Xóa loại công ty
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company_type", "delete"),
  deleteCompanyType
);

module.exports = router;
