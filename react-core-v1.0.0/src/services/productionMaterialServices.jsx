import axiosInstance from "../authentication/axiosInstance";

const PRODUCTION_MATERIAL_API = `${process.env.REACT_APP_URL_SERVER}/production_materials`;

const productionMaterialServices = {
  // Lấy danh sách tất cả nguyên liệu sản xuất
  getProductionMaterials: async () => {
    const res = await axiosInstance.get(PRODUCTION_MATERIAL_API);
    return res.data;
  },

  // Lấy nguyên liệu sản xuất theo ID
  getProductionMaterialById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCTION_MATERIAL_API}/${id}`);
    return res.data;
  },

  // Tạo nguyên liệu sản xuất mới
  createProductionMaterial: async (data) => {
    const res = await axiosInstance.post(PRODUCTION_MATERIAL_API, data);
    return res.data;
  },

  // Cập nhật nguyên liệu sản xuất
  updateProductionMaterial: async (id, data) => {
    const res = await axiosInstance.put(
      `${PRODUCTION_MATERIAL_API}/${id}`,
      data
    );
    return res.data;
  },

  // Xóa nguyên liệu sản xuất
  deleteProductionMaterial: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCTION_MATERIAL_API}/${id}`);
    return res.data;
  },
};

export default productionMaterialServices;
