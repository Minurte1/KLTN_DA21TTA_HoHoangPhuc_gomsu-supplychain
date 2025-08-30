import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const PRODUCTION_STEP_API = `${process.env.REACT_APP_URL_SERVER}/production-steps`;

const productionStepServices = {
  // Lấy danh sách tất cả các bước sản xuất
  getProductionSteps: async ({ ID_COMPANY, STATUS, ID_USERS }) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;
      if (ID_USERS) params.ID_USERS = ID_USERS;

      const res = await axiosInstance.get(PRODUCTION_STEP_API, { params });
      //     spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProductionSteps:", error);
      return null;
    }
  },

  // Lấy bước sản xuất theo ID
  getProductionStepById: async (id) => {
    try {
      const res = await axiosInstance.get(`${PRODUCTION_STEP_API}/${id}`);
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProductionStepById:", error);
      return null;
    }
  },

  // Tạo bước sản xuất mới
  createProductionStep: async (data) => {
    try {
      const res = await axiosInstance.post(PRODUCTION_STEP_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error createProductionStep:", error);
      return null;
    }
  },

  // Cập nhật bước sản xuất
  updateProductionStep: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${PRODUCTION_STEP_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error updateProductionStep:", error);
      return null;
    }
  },

  // Xóa bước sản xuất
  deleteProductionStep: async (id) => {
    try {
      const res = await axiosInstance.delete(`${PRODUCTION_STEP_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error deleteProductionStep:", error);
      return null;
    }
  },
};

export default productionStepServices;
