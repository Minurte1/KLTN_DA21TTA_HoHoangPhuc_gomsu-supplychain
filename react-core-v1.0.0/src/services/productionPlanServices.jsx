import axiosInstance from "../authentication/axiosInstance";

const PRODUCTION_PLAN_API = `${process.env.REACT_APP_URL_SERVER}/production-plans`;

const productionPlanServices = {
  // Lấy danh sách tất cả kế hoạch sản xuất
  getProductionPlans: async (companyId) => {
    const res = await axiosInstance.get(PRODUCTION_PLAN_API, {
      params: { ID_COMPANY: companyId },
    });
    return res.data;
  },

  // Lấy kế hoạch sản xuất theo ID
  getProductionPlanById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCTION_PLAN_API}/${id}`);
    return res.data;
  },

  // Tạo kế hoạch sản xuất mới
  createProductionPlan: async (data) => {
    const res = await axiosInstance.post(PRODUCTION_PLAN_API, data);
    return res.data;
  },

  // Cập nhật kế hoạch sản xuất
  updateProductionPlan: async (id, data) => {
    const res = await axiosInstance.put(`${PRODUCTION_PLAN_API}/${id}`, data);
    return res.data;
  },

  // Xóa kế hoạch sản xuất
  deleteProductionPlan: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCTION_PLAN_API}/${id}`);
    return res.data;
  },
};

export default productionPlanServices;
