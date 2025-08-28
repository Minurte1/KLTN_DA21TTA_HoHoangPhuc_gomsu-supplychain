import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_API = `${process.env.REACT_APP_URL_SERVER}/materials`;

const materialServices = {
  // Lấy danh sách tất cả nguyên vật liệu
  getMaterials: async ({ ID_COMPANY, STATUS } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;

      const res = await axiosInstance.get(MATERIAL_API, { params });
      return res.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      return null;
    }
  },

  // Lấy nguyên vật liệu theo ID
  getMaterialById: async (id) => {
    try {
      const res = await axiosInstance.get(`${MATERIAL_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching material with ID ${id}:`, error);
      return null;
    }
  },

  // Tạo nguyên vật liệu mới
  createMaterial: async (data) => {
    try {
      const res = await axiosInstance.post(MATERIAL_API, data);
      return res.data;
    } catch (error) {
      console.error("Error creating material:", error);
      return null;
    }
  },

  // Cập nhật nguyên vật liệu
  updateMaterial: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${MATERIAL_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`Error updating material with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa nguyên vật liệu
  deleteMaterial: async (id) => {
    try {
      const res = await axiosInstance.delete(`${MATERIAL_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting material with ID ${id}:`, error);
      return null;
    }
  },
};

export default materialServices;
