const express = require("express");
const router = express.Router();
const {
  getCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTaction");

// Lấy tất cả công ty
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("company", "view"),
  getCompanies
);

// Tạo công ty
router.post(
  "/",
  // checkUserJWT,
  // checkUserPermission("company", "create"),
  createCompany
);

// Lấy công ty theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company", "view"),
  getCompanyById
);

// Cập nhật công ty
router.put(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company", "update"),
  updateCompany
);

// Xóa công ty
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company", "delete"),
  deleteCompany
);

module.exports = router;
