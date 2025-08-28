import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const QUALITY_CONTROL_API = `${process.env.REACT_APP_URL_SERVER}/quality-control`;

const qualityControlServices = {
  // Lấy danh sách tất cả kiểm định chất lượng
  getQualityControls: async () => {
    try {
      const res = await axiosInstance.get(QUALITY_CONTROL_API);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getQualityControls:", error);
      return null;
    }
  },

  // Lấy kiểm định chất lượng theo ID
  getQualityControlById: async (id) => {
    try {
      const res = await axiosInstance.get(`${QUALITY_CONTROL_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getQualityControlById:", error);
      return null;
    }
  },

  // Tạo kiểm định chất lượng mới
  createQualityControl: async (data) => {
    try {
      const res = await axiosInstance.post(QUALITY_CONTROL_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error createQualityControl:", error);
      return null;
    }
  },

  // Cập nhật kiểm định chất lượng
  updateQualityControl: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${QUALITY_CONTROL_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error updateQualityControl:", error);
      return null;
    }
  },

  // Xóa kiểm định chất lượng
  deleteQualityControl: async (id) => {
    try {
      const res = await axiosInstance.delete(`${QUALITY_CONTROL_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error deleteQualityControl:", error);
      return null;
    }
  },
};

export default qualityControlServices;
