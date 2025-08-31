import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const COMPANY_API = `${process.env.REACT_APP_URL_SERVER}/companies`;

const companyServices = {
  getCompanies: async (ID_COMPANY, STATUS, ID_COMPANY_TYPE, TABLE) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;
      if (ID_COMPANY_TYPE) params.ID_COMPANY_TYPE = ID_COMPANY_TYPE; // bổ sung
      if (TABLE) params.TABLE = TABLE;
      const res = await axiosInstance.get(COMPANY_API, { params });
      return res.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return { error: error.response?.data || "Lỗi kết nối server" };
    }
  },
  getCompanyById: async (id) => {
    try {
      const res = await axiosInstance.get(`${COMPANY_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      return { error: error.response?.data || "Lỗi kết nối server" };
    }
  },

  createCompany: async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const res = await axiosInstance.post(`${COMPANY_API}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating company:", error);
      return { error: error.response?.data || "Lỗi server khi tạo công ty" };
    }
  },

  updateCompany: async (id, data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const res = await axiosInstance.put(`${COMPANY_API}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating company ${id}:`, error);
      return {
        error: error.response?.data || "Lỗi server khi cập nhật công ty",
      };
    }
  },

  deleteCompany: async (id) => {
    try {
      const res = await axiosInstance.delete(`${COMPANY_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error);
      return { error: error.response?.data || "Lỗi server khi xóa công ty" };
    }
  },
};

export default companyServices;
