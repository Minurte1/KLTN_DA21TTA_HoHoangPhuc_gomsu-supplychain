import { enqueueSnackbar } from "notistack";
import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const PRODUCTION_PLAN_API = `${process.env.REACT_APP_URL_SERVER}/production-plans`;

const productionPlanServices = {
  // Lấy danh sách tất cả kế hoạch sản xuất
  getProductionPlans: async (ID_COMPANY) => {
    try {
      const res = await axiosInstance.get(PRODUCTION_PLAN_API, {
        params: { ID_COMPANY },
      });
      //  spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Lỗi khi tải danh sách kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error getProductionPlans:", error);
      return null;
    }
  },

  // Lấy kế hoạch sản xuất theo ID
  getProductionPlanById: async (id) => {
    try {
      const res = await axiosInstance.get(`${PRODUCTION_PLAN_API}/${id}`);
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi tải kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error getProductionPlanById:", error);
      return null;
    }
  },

  // Tạo kế hoạch sản xuất
  createProductionPlan: async (data) => {
    try {
      const res = await axiosInstance.post(PRODUCTION_PLAN_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error || "Lỗi khi tạo kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error createProductionPlan:", error);
      return null;
    }
  },

  // Cập nhật kế hoạch sản xuất
  updateProductionPlan: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${PRODUCTION_PLAN_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi cập nhật kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error updateProductionPlan:", error);
      return null;
    }
  },

  // Xóa kế hoạch sản xuất
  deleteProductionPlan: async (id) => {
    try {
      const res = await axiosInstance.delete(`${PRODUCTION_PLAN_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi xóa kế hoạch sản xuất";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error deleteProductionPlan:", error);
      return null;
    }
  },
};

export default productionPlanServices;
