import { enqueueSnackbar } from "notistack";
import axiosInstance from "../authentication/axiosInstance";

const PRODUCTION_PLAN_API = `${process.env.REACT_APP_URL_SERVER}/production-plans`;

const productionPlanServices = {
  // Lấy danh sách tất cả kế hoạch sản xuất
  getProductionPlans: async (ID_COMPANY) => {
    const res = await axiosInstance.get(PRODUCTION_PLAN_API, {
      params: { ID_COMPANY: ID_COMPANY },
    });
    return res.data;
  },

  // Lấy kế hoạch sản xuất theo ID
  getProductionPlanById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCTION_PLAN_API}/${id}`);
    return res.data;
  },
  createProductionPlan: async (data) => {
    try {
      const res = await axiosInstance.post(PRODUCTION_PLAN_API, data);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi tạo kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
    }
  },

  updateProductionPlan: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${PRODUCTION_PLAN_API}/${id}`, data);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi cập nhật kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error saving production plan:", error);
    }
  },

  // Xóa kế hoạch sản xuất
  deleteProductionPlan: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCTION_PLAN_API}/${id}`);
    return res.data;
  },
};

export default productionPlanServices;
