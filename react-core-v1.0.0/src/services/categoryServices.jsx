import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const CATEGORY_API = `${process.env.REACT_APP_URL_SERVER}/categories`;

const categoryServices = {
  getCategories: async ({ ID_COMPANY }) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(CATEGORY_API, { params });
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { error: error.response?.data || "Lỗi kết nối server" };
    }
  },

  getCategoryById: async (id) => {
    try {
      const res = await axiosInstance.get(`${CATEGORY_API}/${id}`);
      //  spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return { error: error.response?.data || "Lỗi kết nối server" };
    }
  },

  createCategory: async (data) => {
    try {
      const res = await axiosInstance.post(CATEGORY_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating category:", error);
      return { error: error.response?.data || "Lỗi server khi tạo danh mục" };
    }
  },

  updateCategory: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${CATEGORY_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      return {
        error: error.response?.data || "Lỗi server khi cập nhật danh mục",
      };
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await axiosInstance.delete(`${CATEGORY_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return { error: error.response?.data || "Lỗi server khi xóa danh mục" };
    }
  },
};

export default categoryServices;
