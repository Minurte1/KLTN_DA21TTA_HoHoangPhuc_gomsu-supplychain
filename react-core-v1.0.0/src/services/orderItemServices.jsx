import axiosInstance from "../authentication/axiosInstance";

const ORDER_ITEM_API = `${process.env.REACT_APP_URL_SERVER}/order-items`;

const orderItemServices = {
  // Lấy danh sách tất cả các mặt hàng trong đơn hàng
  getOrderItems: async () => {
    try {
      const res = await axiosInstance.get(ORDER_ITEM_API);
      return res.data;
    } catch (error) {
      console.error("Error fetching order items:", error);
      return null;
    }
  },

  // Lấy thông tin mặt hàng theo ID
  getOrderItemById: async (id) => {
    try {
      const res = await axiosInstance.get(`${ORDER_ITEM_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching order item with ID ${id}:`, error);
      return null;
    }
  },

  // Tạo mặt hàng đơn hàng mới
  createOrderItem: async (data) => {
    try {
      const res = await axiosInstance.post(ORDER_ITEM_API, data);
      return res.data;
    } catch (error) {
      console.error("Error creating order item:", error);
      return null;
    }
  },

  // Cập nhật mặt hàng đơn hàng
  updateOrderItem: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${ORDER_ITEM_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`Error updating order item with ID ${id}:`, error);
      return null;
    }
  },

  // Xóa mặt hàng đơn hàng
  deleteOrderItem: async (id) => {
    try {
      const res = await axiosInstance.delete(`${ORDER_ITEM_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting order item with ID ${id}:`, error);
      return null;
    }
  },
};

export default orderItemServices;
