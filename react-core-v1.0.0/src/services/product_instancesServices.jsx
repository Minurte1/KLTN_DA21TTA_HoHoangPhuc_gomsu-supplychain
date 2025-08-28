import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const PRODUCT_INSTANCES_API = `${process.env.REACT_APP_URL_SERVER}/product_instances`;

const productInstancesServices = {
  // Lấy danh sách tất cả product_instances theo ID_COMPANY và STATUS
  getProductInstances: async ({ ID_COMPANY, STATUS }) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;

      const res = await axiosInstance.get(PRODUCT_INSTANCES_API, { params });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching product instances:", error);
      return null;
    }
  },

  // Public API lấy product_instances
  getProductInstancesPublic: async ({
    ID_COMPANY = null,
    STATUS = "AVAILABLE",
    SERIAL_CODE = null,
    LIMIT = null,
  } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;
      if (SERIAL_CODE) params.SERIAL_CODE = SERIAL_CODE;
      if (LIMIT) params.LIMIT = LIMIT;

      const res = await axiosInstance.get(`${PRODUCT_INSTANCES_API}/public`, {
        params,
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching public product instances:", error);
      return null;
    }
  },

  // Lấy product_instance theo ID
  getProductInstanceById: async (id) => {
    try {
      const res = await axiosInstance.get(`${PRODUCT_INSTANCES_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching product instance with ID ${id}:`, error);
      return null;
    }
  },

  // Tạo mới product_instance
  createProductInstance: async (data) => {
    try {
      const res = await axiosInstance.post(PRODUCT_INSTANCES_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating product instance:", error);
      return null;
    }
  },

  // Cập nhật product_instance theo ID
  updateProductInstance: async (id, data) => {
    try {
      const res = await axiosInstance.put(
        `${PRODUCT_INSTANCES_API}/${id}`,
        data
      );
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating product instance with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa product_instance theo ID
  deleteProductInstance: async (id) => {
    try {
      const res = await axiosInstance.delete(`${PRODUCT_INSTANCES_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting product instance with ID ${id}:`, error);
      return null;
    }
  },

  // 🔎 Search sản phẩm & công ty (global search)
  globalSearch: async (keyword) => {
    try {
      if (!keyword) return [];
      const res = await axiosInstance.get(`${PRODUCT_INSTANCES_API}/search`, {
        params: { keyword },
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error searching product instances:", error);
      return [];
    }
  },
};

export default productInstancesServices;
