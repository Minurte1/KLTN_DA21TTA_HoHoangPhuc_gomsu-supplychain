import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const ROLE_API = `${process.env.REACT_APP_URL_SERVER}/role`;

const roleServices = {
  // Lấy danh sách tất cả roles
  getRoles: async (ID_COMPANY) => {
    try {
      const res = await axiosInstance.get(ROLE_API, {
        params: ID_COMPANY ? { ID_COMPANY } : {},
      });
      // spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getRoles:", error);
      return null;
    }
  },

  // Lấy role theo ID
  getRoleById: async (id) => {
    try {
      const res = await axiosInstance.get(`${ROLE_API}/${id}`);
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getRoleById:", error);
      return null;
    }
  },

  // Tạo role mới
  createRole: async (data) => {
    try {
      const res = await axiosInstance.post(ROLE_API, data);

      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error createRole:", error);
      return null;
    }
  },

  // Cập nhật role
  updateRole: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${ROLE_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error updateRole:", error);
      return null;
    }
  },

  // Xóa role
  deleteRole: async (id) => {
    try {
      const res = await axiosInstance.delete(`${ROLE_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error deleteRole:", error);
      return null;
    }
  },
};

export default roleServices;
