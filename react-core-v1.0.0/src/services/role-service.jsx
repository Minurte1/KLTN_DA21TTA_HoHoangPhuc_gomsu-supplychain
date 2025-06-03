import axiosInstance from "../authentication/axiosInstance";

const ROLE_API = `${process.env.REACT_APP_URL_SERVER}/role`;

const roleServices = {
  // Lấy danh sách tất cả roles
  getRoles: async (ID_COMPANY) => {
    const res = await axiosInstance.get(ROLE_API, {
      params: ID_COMPANY ? { ID_COMPANY } : {},
    });
    return res.data;
  },

  // Lấy role theo ID
  getRoleById: async (id) => {
    const res = await axiosInstance.get(`${ROLE_API}/${id}`);
    return res.data;
  },

  // Tạo role mới
  createRole: async (data) => {
    const res = await axiosInstance.post(ROLE_API, data);
    return res.data;
  },

  // Cập nhật role
  updateRole: async (id, data) => {
    const res = await axiosInstance.put(`${ROLE_API}/${id}`, data);
    return res.data;
  },

  // Xóa role
  deleteRole: async (id) => {
    const res = await axiosInstance.delete(`${ROLE_API}/${id}`);
    return res.data;
  },
};

export default roleServices;
