import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const PRODUCTION_MATERIAL_API = `${process.env.REACT_APP_URL_SERVER}/production-materials`;

const productionMaterialServices = {
  // Lấy danh sách tất cả nguyên liệu sản xuất
  getProductionMaterials: async () => {
    try {
      const res = await axiosInstance.get(PRODUCTION_MATERIAL_API);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProductionMaterials:", error);
      return { error: true, message: "Không thể tải danh sách nguyên liệu" };
    }
  },

  // Lấy nguyên liệu sản xuất theo ID
  getProductionMaterialById: async (id) => {
    try {
      const res = await axiosInstance.get(`${PRODUCTION_MATERIAL_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error getProductionMaterialById:", error);
      return { error: true, message: "Không thể tải nguyên liệu" };
    }
  },

  // Tạo nguyên liệu sản xuất mới
  createProductionMaterial: async (data) => {
    try {
      const res = await axiosInstance.post(PRODUCTION_MATERIAL_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error createProductionMaterial:", error);
      return { error: true, message: "Không thể tạo nguyên liệu mới" };
    }
  },

  // Cập nhật nguyên liệu sản xuất
  updateProductionMaterial: async (id, data) => {
    try {
      const res = await axiosInstance.put(
        `${PRODUCTION_MATERIAL_API}/${id}`,
        data
      );
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error updateProductionMaterial:", error);
      return { error: true, message: "Không thể cập nhật nguyên liệu" };
    }
  },

  // Xóa nguyên liệu sản xuất
  deleteProductionMaterial: async (id) => {
    try {
      const res = await axiosInstance.delete(
        `${PRODUCTION_MATERIAL_API}/${id}`
      );
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error deleteProductionMaterial:", error);
      return { error: true, message: "Không thể xóa nguyên liệu" };
    }
  },
};

export default productionMaterialServices;
