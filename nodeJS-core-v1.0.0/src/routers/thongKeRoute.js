// routes/thongKe.route.js
const express = require("express");
const router = express.Router();
const {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
  getMonthlyRevenue,
  getRevenueByManufacturer,
  getTop10Products,
  getRevenueStatsAllController,
  getProductStatsAllController,
} = require("../controllers/thongKe.controller");

// Nếu có id thì lọc theo công ty, nếu không thì lấy all
router.get("/material/:id?", getTopMaterialByCompany);
router.get("/revenue-stats/:id?", getMonthlyRevenue);
router.get("/:id?", getThongKeByCompanyId);

// ====================CTY SẢN XUẤT=======================================
router.get("/revenue-manufacturer/:id?", getRevenueByManufacturer);
router.get("/top-products/:id?", getTop10Products);
router.get("/revenue-stats-ss/:id?", getRevenueStatsAllController);
router.get("/product-stats-ss/:id?", getProductStatsAllController);
module.exports = router;
