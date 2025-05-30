import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_TYPE_API = `${process.env.REACT_APP_URL_SERVER}/material-types`;

const materialTypeServices = {
  // Lấy danh sách tất cả các loại nguyên vật liệu
  getMaterialTypes: async (companyId) => {
    const res = await axiosInstance.get(
      `${MATERIAL_TYPE_API}?id_company=${companyId}`
    );
    return res.data;
  },

  // Lấy loại nguyên vật liệu theo ID
  getMaterialTypeById: async (id) => {
    const res = await axiosInstance.get(`${MATERIAL_TYPE_API}/${id}`);
    return res.data;
  },

  // Tạo loại nguyên vật liệu mới
  createMaterialType: async (data) => {
    const res = await axiosInstance.post(MATERIAL_TYPE_API, data);
    return res.data;
  },

  // Cập nhật loại nguyên vật liệu
  updateMaterialType: async (id, data) => {
    const res = await axiosInstance.put(`${MATERIAL_TYPE_API}/${id}`, data);
    return res.data;
  },

  // Xóa loại nguyên vật liệu
  deleteMaterialType: async (id) => {
    const res = await axiosInstance.delete(`${MATERIAL_TYPE_API}/${id}`);
    return res.data;
  },
};

export default materialTypeServices;
