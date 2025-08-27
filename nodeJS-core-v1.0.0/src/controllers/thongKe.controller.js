const thongKeService = require("../services/thongKe.service");

//Thống kê doanh thu theo công ty
const getThongKeByCompanyId = async (req, res) => {
  try {
    const { id } = req.params;
    const thongKeData = await thongKeService.getTotalCostByCompany(id);

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
    const { id } = req.params;
    const thongKeData = await thongKeService.getTop10MaterialByCompany(id);

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
    const id = req.query.id || null;

    const [dailyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
      thongKeService.getDailyRevenue(id),
      thongKeService.getMonthlyRevenue(id),
      thongKeService.getYearlyRevenue(id),
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
    const { id } = req.params;

    const data = await thongKeService.getRevenueByManufacturer(id);

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
    const { id } = req.params;
    const data = await thongKeService.getTop10Products(id || null);

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
    const { companyId } = req.query; // optional
    const data = await thongKeService.getRevenueStatsAll(companyId || null);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getProductStatsAllController = async (req, res) => {
  try {
    const { companyId } = req.query; // optional
    const data = await thongKeService.getProductStatsAll(companyId || null);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// ========================CTY VẬN CHUYỂN ===========================================
// Doanh thu vận chuyển
const getTotalTransportRevenueController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getTotalTransportRevenue(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getTotalTransportRevenueController:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Số lần sử dụng dịch vụ vận chuyển
const getTotalTransportUsageController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getTotalTransportUsage(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getTotalTransportUsageController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo ngày
const getRevenueByDayController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getRevenueByDay(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByDayController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo tháng
const getRevenueByMonthController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getRevenueByMonth(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByMonthController:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Doanh thu theo năm
const getRevenueByYearController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getRevenueByYear(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueByYearController:", err);
    res.status(500).json({ error: "Server error" });
  }
}; // Thống kê doanh thu theo ngày, tháng, năm
const getRevenueStatsController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getRevenueStats(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueStatsController:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const getTop5TransportCompaniesController = async (req, res) => {
  try {
    const { id } = req.params; // optional
    const data = await thongKeService.getTop5TransportCompanies(id || null);
    res.json(data);
  } catch (err) {
    console.error("Error in getRevenueStatsController:", err);
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
