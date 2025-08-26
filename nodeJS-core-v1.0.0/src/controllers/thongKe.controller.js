const thongKeService = require("../services/thongKe.service");

//Thống kê doanh thu theo công ty
const getThongKeByCompanyId = async (req, res) => {
  try {
    const { id } = req.params;
    const thongKeData = await thongKeService.getTotalCostByCompany(id); // <-- thêm await

    if (!thongKeData) {
      return res.status(404).json({ message: "Thống kê không tìm thấy" });
    }

    res.json(thongKeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thống kê số lượng vật liệu được mua nhiều nhất theo công ty
const getTopMaterialByCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const thongKeData = await thongKeService.getTop10MaterialByCompany(id); // <-- thêm await

    if (!thongKeData) {
      return res.status(404).json({ message: "Thống kê không tìm thấy" });
    }

    res.json(thongKeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getThongKeByCompanyId,
  getTopMaterialByCompany,
};
