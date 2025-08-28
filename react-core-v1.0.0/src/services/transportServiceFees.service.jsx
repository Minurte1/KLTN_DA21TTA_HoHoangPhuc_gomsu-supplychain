import axiosInstance from "../authentication/axiosInstance";

const FEE_API = `${process.env.REACT_APP_URL_SERVER}/transport-service-fees`;

const transportServiceFeesService = {
  // Lấy danh sách tất cả phí dịch vụ vận chuyển
  getFees: async ({ ID_COMPANY_SHIP, STATUS } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY_SHIP) params.ID_COMPANY_SHIP = ID_COMPANY_SHIP;
      if (STATUS) params.STATUS = STATUS;

      const res = await axiosInstance.get(FEE_API, { params });
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phí dịch vụ vận chuyển:", error);
      return null;
    }
  },

  // Lấy phí theo ID
  getFeeById: async (id) => {
    try {
      const res = await axiosInstance.get(`${FEE_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy phí theo ID:", error);
      return null;
    }
  },

  // Tạo phí dịch vụ mới
  createFee: async (data) => {
    try {
      const res = await axiosInstance.post(FEE_API, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo phí dịch vụ:", error);
      return { success: false, message: "Không thể tạo phí dịch vụ" };
    }
  },

  // Cập nhật phí dịch vụ
  updateFee: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${FEE_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật phí dịch vụ:", error);
      return { success: false, message: "Không thể cập nhật phí dịch vụ" };
    }
  },

  // Xóa phí dịch vụ
  deleteFee: async (id) => {
    try {
      const res = await axiosInstance.delete(`${FEE_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xóa phí dịch vụ:", error);
      return { success: false, message: "Không thể xóa phí dịch vụ" };
    }
  },
};

export default transportServiceFeesService;
