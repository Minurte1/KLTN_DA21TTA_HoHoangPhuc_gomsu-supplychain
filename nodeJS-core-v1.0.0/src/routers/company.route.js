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
const upload = require("../config/multerConfig");

// Lấy tất cả công ty
router.get(
  "/",
  // checkUserJWT,
  // checkUserPermission("company", "view"),
  getCompanies
);

router.post(
  "/",
  upload.fields([
    { name: "AVATAR", maxCount: 1 },
    { name: "BACKGROUND", maxCount: 1 },
  ]),
  createCompany
);

router.put(
  "/:id",
  upload.fields([
    { name: "AVATAR", maxCount: 1 },
    { name: "BACKGROUND", maxCount: 1 },
  ]),
  updateCompany
);
// Lấy công ty theo ID
router.get(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company", "view"),
  getCompanyById
);

// Xóa công ty
router.delete(
  "/:id",
  // checkUserJWT,
  // checkUserPermission("company", "delete"),
  deleteCompany
);

module.exports = router;
