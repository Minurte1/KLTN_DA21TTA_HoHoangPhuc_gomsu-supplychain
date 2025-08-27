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

  //
  getTotalTransportRevenueController,
  getTotalTransportUsageController,
  getRevenueByDayController,
  getRevenueByYearController,
  getRevenueByMonthController,
  getRevenueStatsController,
} = require("../controllers/thongKe.controller");
// ====================CTY SẢN XUẤT=======================================
router.get("/revenue-manufacturer/:id?", getRevenueByManufacturer);
router.get("/top-products/:id?", getTop10Products);
router.get("/revenue-stats-ss/:id?", getRevenueStatsAllController);
router.get("/product-stats-ss/:id?", getProductStatsAllController);

//===================CTY VẬN CHUYỂN ======================================
// Doanh thu vận chuyển
router.get("/transport-revenue/:id?", getTotalTransportRevenueController);
// Số lần sử dụng dịch vụ vận chuyển
router.get("/transport-usage/:id?", getTotalTransportUsageController);
// Doanh thu theo ngày
router.get("/revenue-by-day/:id?", getRevenueByDayController);
// Doanh thu theo tháng
router.get("/revenue-by-month/:id?", getRevenueByMonthController);
// Doanh thu theo năm
router.get("/revenue-by-year/:id?", getRevenueByYearController);
router.get("/revenue-stats-transport/:id?", getRevenueStatsController);

// ================= CTY CUNG CẤP =========================================
// Nếu có id thì lọc theo công ty, nếu không thì lấy all
router.get("/material/:id?", getTopMaterialByCompany);
router.get("/revenue-stats/:id?", getMonthlyRevenue);
router.get("/:id?", getThongKeByCompanyId);

module.exports = router;
