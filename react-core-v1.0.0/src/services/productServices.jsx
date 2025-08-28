import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const PRODUCT_API = `${process.env.REACT_APP_URL_SERVER}/products`;

const productServices = {
  // Lấy danh sách tất cả sản phẩm
  getProducts: async ({ ID_COMPANY }) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(PRODUCT_API, { params });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProducts:", error);
      return null;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const res = await axiosInstance.get(`${PRODUCT_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProductById:", error);
      return null;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const res = await axiosInstance.post(PRODUCT_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error createProduct:", error);
      return null;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const res = await axiosInstance.put(`${PRODUCT_API}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error updateProduct:", error);
      return null;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const res = await axiosInstance.delete(`${PRODUCT_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error deleteProduct:", error);
      return null;
    }
  },
};

export default productServices;
