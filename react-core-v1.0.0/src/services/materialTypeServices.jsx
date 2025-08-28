import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const MATERIAL_TYPE_API = `${process.env.REACT_APP_URL_SERVER}/material-types`;

const materialTypeServices = {
  // Lấy danh sách tất cả các loại nguyên vật liệu
  getMaterialTypes: async (companyId) => {
    try {
      const res = await axiosInstance.get(
        `${MATERIAL_TYPE_API}?id_company=${companyId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching material types:", error);
      return null;
    }
  },

  // Lấy loại nguyên vật liệu theo ID
  getMaterialTypeById: async (id) => {
    try {
      const res = await axiosInstance.get(`${MATERIAL_TYPE_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching material type with ID ${id}:`, error);
      return null;
    }
  },

  // Tạo loại nguyên vật liệu mới
  createMaterialType: async (data) => {
    try {
      const res = await axiosInstance.post(MATERIAL_TYPE_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating material type:", error);
      return null;
    }
  },

  // Cập nhật loại nguyên vật liệu
  updateMaterialType: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${MATERIAL_TYPE_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating material type with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa loại nguyên vật liệu
  deleteMaterialType: async (id) => {
    try {
      const res = await axiosInstance.delete(`${MATERIAL_TYPE_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting material type with ID ${id}:`, error);
      return null;
    }
  },
};

export default materialTypeServices;
