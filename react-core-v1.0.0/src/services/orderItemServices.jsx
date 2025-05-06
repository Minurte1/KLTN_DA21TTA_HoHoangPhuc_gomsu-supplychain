import axiosInstance from "../authentication/axiosInstance";

const ORDER_ITEM_API = `${process.env.REACT_APP_URL_SERVER}/order-items`;

const orderItemServices = {
  // Lấy danh sách tất cả các mặt hàng trong đơn hàng
  getOrderItems: async () => {
    const res = await axiosInstance.get(ORDER_ITEM_API);
    return res.data;
  },

  // Lấy thông tin mặt hàng theo ID
  getOrderItemById: async (id) => {
    const res = await axiosInstance.get(`${ORDER_ITEM_API}/${id}`);
    return res.data;
  },

  // Tạo mặt hàng đơn hàng mới
  createOrderItem: async (data) => {
    const res = await axiosInstance.post(ORDER_ITEM_API, data);
    return res.data;
  },

  // Cập nhật mặt hàng đơn hàng
  updateOrderItem: async (id, data) => {
    const res = await axiosInstance.put(`${ORDER_ITEM_API}/${id}`, data);
    return res.data;
  },

  // Xóa mặt hàng đơn hàng
  deleteOrderItem: async (id) => {
    const res = await axiosInstance.delete(`${ORDER_ITEM_API}/${id}`);
    return res.data;
  },
};

export default orderItemServices;
