import axiosInstance from "../authentication/axiosInstance";

const FEE_API = `${process.env.REACT_APP_URL_SERVER}/transport-service-fees`;

const transportServiceFeesService = {
  // Lấy danh sách tất cả phí dịch vụ vận chuyển
  getFees: async ({ ID_COMPANY_SHIP, STATUS } = {}) => {
    const params = {};
    if (ID_COMPANY_SHIP) params.ID_COMPANY_SHIP = ID_COMPANY_SHIP;
    if (STATUS) params.STATUS = STATUS;

    const res = await axiosInstance.get(FEE_API, { params });
    return res.data;
  },

  // Lấy phí theo ID
  getFeeById: async (id) => {
    const res = await axiosInstance.get(`${FEE_API}/${id}`);
    return res.data;
  },

  // Tạo phí dịch vụ mới
  createFee: async (data) => {
    const res = await axiosInstance.post(FEE_API, data);
    return res.data;
  },

  // Cập nhật phí dịch vụ
  updateFee: async (id, data) => {
    const res = await axiosInstance.put(`${FEE_API}/${id}`, data);
    return res.data;
  },

  // Xóa phí dịch vụ
  deleteFee: async (id) => {
    const res = await axiosInstance.delete(`${FEE_API}/${id}`);
    return res.data;
  },
};

export default transportServiceFeesService;
