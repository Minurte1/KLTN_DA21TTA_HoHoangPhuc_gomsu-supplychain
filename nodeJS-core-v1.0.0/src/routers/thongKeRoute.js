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

  // vận chuyển
  getTotalTransportRevenueController,
  getTotalTransportUsageController,
  getRevenueByDayController,
  getRevenueByYearController,
  getRevenueByMonthController,
  getRevenueStatsController,
  getTop5TransportCompaniesController,
} = require("../controllers/thongKe.controller");

// ==================== CTY SẢN XUẤT =======================================
router.get("/revenue-manufacturer", getRevenueByManufacturer);
router.get("/top-products", getTop10Products);
router.get("/revenue-stats-ss", getRevenueStatsAllController);
router.get("/product-stats-ss", getProductStatsAllController);

// =================== CTY VẬN CHUYỂN ======================================
// Doanh thu vận chuyển
router.get("/transport-revenue", getTotalTransportRevenueController);
// Số lần sử dụng dịch vụ vận chuyển
router.get("/transport-usage", getTotalTransportUsageController);
// Doanh thu theo ngày
router.get("/revenue-by-day", getRevenueByDayController);
// Doanh thu theo tháng
router.get("/revenue-by-month", getRevenueByMonthController);
// Doanh thu theo năm
router.get("/revenue-by-year", getRevenueByYearController);
router.get("/revenue-stats-transport", getRevenueStatsController);
router.get("/top5-companies-transport", getTop5TransportCompaniesController);

// ================= CTY CUNG CẤP ==========================================
// Nếu có ID_COMPANY thì lọc theo query, nếu không thì lấy all
router.get("/material", getTopMaterialByCompany);
router.get("/revenue-stats", getMonthlyRevenue);
router.get("/", getThongKeByCompanyId);

module.exports = router;
