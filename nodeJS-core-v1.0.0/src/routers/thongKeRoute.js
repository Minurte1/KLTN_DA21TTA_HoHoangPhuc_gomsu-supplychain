const express = require("express");
const router = express.Router();
const {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
} = require("../controllers/thongKe.controller");
// Lấy loại vật liệu theo ID
router.get("/material/:id", getTopMaterialByCompany);

router.get("/:id", getThongKeByCompanyId);

module.exports = router;
