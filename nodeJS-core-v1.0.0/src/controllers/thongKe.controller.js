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
module.exports = {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
  getMonthlyRevenue,
};
