import axiosInstance from "../authentication/axiosInstance";
import spService from "../share-service/spService";
const ORDER_API = `${process.env.REACT_APP_URL_SERVER}/orders`;

const orderServices = {
  // Lấy danh sách tất cả đơn hàng
  getOrders: async ({ ID_COMPANY, STATUS }) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
      if (STATUS) params.STATUS = STATUS;

      const res = await axiosInstance.get(ORDER_API, { params });
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return null;
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      const res = await axiosInstance.get(`${ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      return null;
    }
  },

  // Lấy danh sách đơn hàng theo user
  getOrderByUsers: async (id) => {
    try {
      const res = await axiosInstance.get(`${ORDER_API}/user/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching orders for user ID ${id}:`, error);
      return null;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (data) => {
    try {
      const res = await axiosInstance.post(ORDER_API, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },
  onUpdateStatus: async (ID_ORDERS_, STATUS) => {
    try {
      const res = await axiosInstance.put(`${ORDER_API}/${ID_ORDERS_}/status`, {
        STATUS,
      });
      spService.handleAxiosResponse(res);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },
  // Cập nhật đơn hàng
  updateOrder: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${ORDER_API}/${id}`, data);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (id) => {
    try {
      const res = await axiosInstance.delete(`${ORDER_API}/${id}`);
      spService.handleAxiosResponse(res);
      return res.data;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      return null;
    }
  },
};

export default orderServices;
