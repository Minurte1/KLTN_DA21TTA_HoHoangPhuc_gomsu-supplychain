import axiosInstance from "../authentication/axiosInstance";

const COMPANY_API = `${process.env.REACT_APP_URL_SERVER}/companies`;

const companyServices = {
  // Lấy danh sách tất cả công ty
  getCompanies: async () => {
    const res = await axiosInstance.get(COMPANY_API);
    return res.data;
  },

  // Lấy công ty theo ID
  getCompanyById: async (id) => {
    const res = await axiosInstance.get(`${COMPANY_API}/${id}`);
    return res.data;
  },

  // Tạo công ty mới
  createCompany: async (data) => {
    const res = await axiosInstance.post(COMPANY_API, data);
    return res.data;
  },

  // Cập nhật công ty
  updateCompany: async (id, data) => {
    const res = await axiosInstance.put(`${COMPANY_API}/${id}`, data);
    return res.data;
  },

  // Xóa công ty
  deleteCompany: async (id) => {
    const res = await axiosInstance.delete(`${COMPANY_API}/${id}`);
    return res.data;
  },
};

export default companyServices;
