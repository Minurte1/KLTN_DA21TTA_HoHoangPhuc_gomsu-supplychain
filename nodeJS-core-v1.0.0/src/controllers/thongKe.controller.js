const thongKeService = require("../services/thongKe.service");

const getThongKeByCompanyId = (req, res) => {
  try {
    const { id } = req.params;
    // Giả sử bạn có một hàm để lấy thống kê theo ID công ty
    const thongKeData = thongKeService.getTotalCostByCompany(id);

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
};
