import axiosInstance from "../authentication/axiosInstance";

const COMPANY_TYPE_API = `${process.env.REACT_APP_URL_SERVER}/company-types`;

const companyTypeServices = {
  // Lấy danh sách tất cả loại công ty
  getCompanyTypes: async () => {
    const res = await axiosInstance.get(COMPANY_TYPE_API);
    return res.data;
  },
  // New function to get companies by ROUTER_COMPANY
  getCompaniesByRouter: async (filters) => {
    try {
      const res = await axiosInstance.post(
        `${COMPANY_TYPE_API}/getCompaniesByRouter`,
        { filters: filters }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching companies by router:", error);
      throw error; // Or handle error as needed
    }
  },

  // Lấy loại công ty theo ID
  getCompanyTypeById: async (id) => {
    const res = await axiosInstance.get(`${COMPANY_TYPE_API}/${id}`);
    return res.data;
  },

  // Tạo loại công ty mới
  createCompanyType: async (data) => {
    const res = await axiosInstance.post(COMPANY_TYPE_API, data);
    return res.data;
  },

  // Cập nhật loại công ty
  updateCompanyType: async (id, data) => {
    const res = await axiosInstance.put(`${COMPANY_TYPE_API}/${id}`, data);
    return res.data;
  },

  // Xóa loại công ty
  deleteCompanyType: async (id) => {
    const res = await axiosInstance.delete(`${COMPANY_TYPE_API}/${id}`);
    return res.data;
  },
};

export default companyTypeServices;
