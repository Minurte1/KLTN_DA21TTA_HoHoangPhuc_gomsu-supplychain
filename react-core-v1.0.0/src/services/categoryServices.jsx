import axiosInstance from "../authentication/axiosInstance";

const CATEGORY_API = `${process.env.REACT_APP_URL_SERVER}/categories`;

const categoryServices = {
  // Lấy danh sách tất cả danh mục
  getCategories: async ({ ID_COMPANY }) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(CATEGORY_API, { params });
    return res.data;
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    const res = await axiosInstance.get(`${CATEGORY_API}/${id}`);
    return res.data;
  },

  // Tạo danh mục mới
  createCategory: async (data) => {
    const res = await axiosInstance.post(CATEGORY_API, data);
    return res.data;
  },

  // Cập nhật danh mục
  updateCategory: async (id, data) => {
    const res = await axiosInstance.put(`${CATEGORY_API}/${id}`, data);
    return res.data;
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`${CATEGORY_API}/${id}`);
    return res.data;
  },
};

export default categoryServices;
