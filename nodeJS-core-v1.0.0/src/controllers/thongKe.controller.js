const thongKeService = require("../services/thongKe.service");

// ==================== CÔNG TY SẢN XUẤT ==================================

// Thống kê doanh thu theo công ty
const getThongKeByCompanyId = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const thongKeData = await thongKeService.getTotalCostByCompany(
      ID_COMPANY || null
    );

    if (!thongKeData) {
      return res.status(404).json({ message: "Không có dữ liệu thống kê" });
    }

    res.json(thongKeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMaterialByCompany = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const thongKeData = await thongKeService.getTop10MaterialByCompany(
      ID_COMPANY || null
    );

    if (!thongKeData) {
      return res.status(404).json({ message: "Không có dữ liệu thống kê" });
    }

    res.json(thongKeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;

    const [dailyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
      thongKeService.getDailyRevenue(ID_COMPANY || null),
      thongKeService.getMonthlyRevenue(ID_COMPANY || null),
      thongKeService.getYearlyRevenue(ID_COMPANY || null),
    ]);

    res.json({
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching revenue statistics" });
  }
};

// API thống kê doanh thu bán ra
const getRevenueByManufacturer = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueByManufacturer(
      ID_COMPANY || null
    );

    if (!data) {
      return res.status(404).json({ message: "Không có dữ liệu thống kê" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTop10Products = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getTop10Products(ID_COMPANY || null);

    if (!data) {
      return res.status(404).json({ message: "Không có dữ liệu thống kê" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRevenueStatsAllController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueStatsAll(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProductStatsAllController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getProductStatsAll(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ==================== CÔNG TY VẬN CHUYỂN ==================================

// Doanh thu vận chuyển
const getTotalTransportRevenueController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getTotalTransportRevenue(
      ID_COMPANY || null
    );
    res.json(data);
  } catch (err) {
    console.error("Error in getTotalTransportRevenueController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Số lần sử dụng dịch vụ vận chuyển
const getTotalTransportUsageController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getTotalTransportUsage(
      ID_COMPANY || null
    );
    res.json(data);
  } catch (err) {
    console.error("Error in getTotalTransportUsageController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo ngày
const getRevenueByDayController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueByDay(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByDayController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo tháng
const getRevenueByMonthController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueByMonth(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByMonthController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo năm
const getRevenueByYearController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueByYear(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByYearController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Thống kê doanh thu theo ngày, tháng, năm
const getRevenueStatsController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getRevenueStats(ID_COMPANY || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueStatsController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Top 5 công ty vận chuyển
const getTop5TransportCompaniesController = async (req, res) => {
  try {
    const { ID_COMPANY } = req.query;
    const data = await thongKeService.getTop5TransportCompanies(
      ID_COMPANY || null
    );
    res.json(data);
  } catch (err) {
    console.error("Error in getTop5TransportCompaniesController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
  getMonthlyRevenue,
  // ====================CTY SẢN XUẤT=======================================
  getRevenueByManufacturer,
  getTop10Products,
  getRevenueStatsAllController,
  getProductStatsAllController,
  // =================CTY VẬN CHUYỂN =====================================
  getRevenueByYearController,
  getRevenueByMonthController,
  getRevenueByDayController,
  getTotalTransportUsageController,
  getTotalTransportRevenueController,
  getRevenueStatsController,
  getTop5TransportCompaniesController,
};
