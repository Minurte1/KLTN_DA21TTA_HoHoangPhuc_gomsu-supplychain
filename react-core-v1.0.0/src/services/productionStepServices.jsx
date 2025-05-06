import axiosInstance from "../authentication/axiosInstance";

const PRODUCTION_STEP_API = `${process.env.REACT_APP_URL_SERVER}/production-steps`;

const productionStepServices = {
  // Lấy danh sách tất cả các bước sản xuất
  getProductionSteps: async () => {
    const res = await axiosInstance.get(PRODUCTION_STEP_API);
    return res.data;
  },

  // Lấy bước sản xuất theo ID
  getProductionStepById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCTION_STEP_API}/${id}`);
    return res.data;
  },

  // Tạo bước sản xuất mới
  createProductionStep: async (data) => {
    const res = await axiosInstance.post(PRODUCTION_STEP_API, data);
    return res.data;
  },

  // Cập nhật bước sản xuất
  updateProductionStep: async (id, data) => {
    const res = await axiosInstance.put(`${PRODUCTION_STEP_API}/${id}`, data);
    return res.data;
  },

  // Xóa bước sản xuất
  deleteProductionStep: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCTION_STEP_API}/${id}`);
    return res.data;
  },
};

export default productionStepServices;
