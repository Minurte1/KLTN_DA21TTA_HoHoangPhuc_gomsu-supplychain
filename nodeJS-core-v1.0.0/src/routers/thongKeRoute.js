// routes/thongKe.route.js
const express = require("express");
const router = express.Router();
const {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
  getMonthlyRevenue,
  getRevenueByManufacturer,
  getTop10Products,
} = require("../controllers/thongKe.controller");

// Nếu có id thì lọc theo công ty, nếu không thì lấy all
router.get("/material/:id?", getTopMaterialByCompany);
router.get("/revenue-stats/:id?", getMonthlyRevenue);
router.get("/:id?", getThongKeByCompanyId);

// Thống kê doanh thu công ty sản xuất (có id thì lọc, không có thì lấy all)
router.get("/revenue-manufacturer/:id?", getRevenueByManufacturer);
router.get("/top-products/:id?", getTop10Products);

module.exports = router;
