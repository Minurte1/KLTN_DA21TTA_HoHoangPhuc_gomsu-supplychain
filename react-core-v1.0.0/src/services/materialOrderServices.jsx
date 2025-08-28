import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/material-orders`;

const materialOrderServices = {
  // Lấy danh sách tất cả các đơn hàng nguyên liệu
  getMaterialOrders: async () => {
    try {
      const res = await axiosInstance.get(MATERIAL_ORDER_API);
      return res.data;
    } catch (error) {
      console.error("Error fetching material orders:", error);
      return null;
    }
  },

  // Lấy đơn hàng nguyên liệu theo ID
  getMaterialOrderById: async (id) => {
    try {
      const res = await axiosInstance.get(`${MATERIAL_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching material order with ID ${id}:`, error);
      return null;
    }
  },

  // Tạo đơn hàng nguyên liệu mới
  createMaterialOrder: async (data) => {
    try {
      const res = await axiosInstance.post(MATERIAL_ORDER_API, data);
      return res.data;
    } catch (error) {
      console.error("Error creating material order:", error);
      return null;
    }
  },

  // Cập nhật đơn hàng nguyên liệu
  updateMaterialOrder: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${MATERIAL_ORDER_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`Error updating material order with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa đơn hàng nguyên liệu
  deleteMaterialOrder: async (id) => {
    try {
      const res = await axiosInstance.delete(`${MATERIAL_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting material order with ID ${id}:`, error);
      return null;
    }
  },
};

export default materialOrderServices;
