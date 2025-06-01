import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_API = `${process.env.REACT_APP_URL_SERVER}/materials`;

const materialServices = {
  // Lấy danh sách tất cả nguyên vật liệu
  getMaterials: async (ID_COMPANY) => {
    const res = await axiosInstance.get(MATERIAL_API, {
      params: { ID_COMPANY },
    });
    return res.data;
  },

  // Lấy nguyên vật liệu theo ID
  getMaterialById: async (id) => {
    const res = await axiosInstance.get(`${MATERIAL_API}/${id}`);
    return res.data;
  },

  // Tạo nguyên vật liệu mới
  createMaterial: async (data) => {
    const res = await axiosInstance.post(MATERIAL_API, data);
    return res.data;
  },

  // Cập nhật nguyên vật liệu
  updateMaterial: async (id, data) => {
    const res = await axiosInstance.put(`${MATERIAL_API}/${id}`, data);
    return res.data;
  },

  // Xóa nguyên vật liệu
  deleteMaterial: async (id) => {
    const res = await axiosInstance.delete(`${MATERIAL_API}/${id}`);
    return res.data;
  },
};

export default materialServices;
