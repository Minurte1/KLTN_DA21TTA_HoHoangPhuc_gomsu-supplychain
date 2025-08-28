import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const EQUIPMENT_API = `${process.env.REACT_APP_URL_SERVER}/equipment`;

const equipmentServices = {
  // Lấy danh sách tất cả thiết bị, có thể lọc theo STATUS hoặc TYPE_EQUIPMENT
  getEquipments: async ({ ID_COMPANY, STATUS, TYPE_EQUIPMENT } = {}) => {
    try {
      const params = {};
      if (STATUS) params.STATUS = STATUS;
      if (TYPE_EQUIPMENT) params.TYPE_EQUIPMENT = TYPE_EQUIPMENT;
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(EQUIPMENT_API, { params });
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thiết bị:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Lấy thiết bị theo ID
  getEquipmentById: async (id) => {
    try {
      const res = await axiosInstance.get(`${EQUIPMENT_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy thiết bị:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Tạo thiết bị mới
  createEquipment: async (data) => {
    try {
      const res = await axiosInstance.post(EQUIPMENT_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo thiết bị:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Cập nhật thiết bị
  updateEquipment: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${EQUIPMENT_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thiết bị:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Xóa thiết bị
  deleteEquipment: async (id) => {
    try {
      const res = await axiosInstance.delete(`${EQUIPMENT_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },
};

export default equipmentServices;
