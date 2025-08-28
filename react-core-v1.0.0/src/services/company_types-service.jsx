import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const COMPANY_TYPE_API = `${process.env.REACT_APP_URL_SERVER}/company-types`;

const companyTypeServices = {
  // Lấy danh sách tất cả loại công ty
  getCompanyTypes: async () => {
    try {
      const res = await axiosInstance.get(COMPANY_TYPE_API);
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching company types:", error);
      return { error: error.response?.data || "Lỗi kết nối server" };
    }
  },

  // Lấy công ty theo ROUTER_COMPANY
  getCompaniesByRouter: async (filters) => {
    try {
      const res = await axiosInstance.post(
        `${COMPANY_TYPE_API}/getCompaniesByRouter`,
        { filters }
      );
      //   spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching companies by router:", error);
      return {
        error: error.response?.data || "Lỗi khi lấy công ty theo router",
      };
    }
  },

  // Lấy loại công ty theo ID
  getCompanyTypeById: async (id) => {
    try {
      const res = await axiosInstance.get(`${COMPANY_TYPE_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error fetching company type ${id}:`, error);
      return { error: error.response?.data || "Lỗi khi lấy loại công ty" };
    }
  },

  // Tạo loại công ty mới
  createCompanyType: async (data) => {
    try {
      const res = await axiosInstance.post(COMPANY_TYPE_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating company type:", error);
      return { error: error.response?.data || "Lỗi khi tạo loại công ty" };
    }
  },

  // Cập nhật loại công ty
  updateCompanyType: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${COMPANY_TYPE_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating company type ${id}:`, error);
      return { error: error.response?.data || "Lỗi khi cập nhật loại công ty" };
    }
  },

  // Xóa loại công ty
  deleteCompanyType: async (id) => {
    try {
      const res = await axiosInstance.delete(`${COMPANY_TYPE_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting company type ${id}:`, error);
      return { error: error.response?.data || "Lỗi khi xóa loại công ty" };
    }
  },
};

export default companyTypeServices;
