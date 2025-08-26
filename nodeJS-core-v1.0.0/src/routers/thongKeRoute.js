// routes/thongKe.route.js
const express = require("express");
const router = express.Router();
const {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
  getMonthlyRevenue,
} = require("../controllers/thongKe.controller");

// Nếu có id thì lọc theo công ty, nếu không thì lấy all
router.get("/material/:id?", getTopMaterialByCompany);
router.get("/revenue-stats/:id?", getMonthlyRevenue);
router.get("/:id?", getThongKeByCompanyId);

module.exports = router;
