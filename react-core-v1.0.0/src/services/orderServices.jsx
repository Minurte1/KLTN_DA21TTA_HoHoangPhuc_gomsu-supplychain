import axiosInstance from "../authentication/axiosInstance";

const ORDER_API = `${process.env.REACT_APP_URL_SERVER}/orders`;

const orderServices = {
  // Lấy danh sách tất cả đơn hàng
  getOrders: async () => {
    const res = await axiosInstance.get(ORDER_API);
    return res.data;
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    const res = await axiosInstance.get(`${ORDER_API}/${id}`);
    return res.data;
  },

  // Tạo đơn hàng mới
  createOrder: async (data) => {
    const res = await axiosInstance.post(ORDER_API, data);
    return res.data;
  },

  // Cập nhật đơn hàng
  updateOrder: async (id, data) => {
    const res = await axiosInstance.put(`${ORDER_API}/${id}`, data);
    return res.data;
  },

  // Xóa đơn hàng
  deleteOrder: async (id) => {
    const res = await axiosInstance.delete(`${ORDER_API}/${id}`);
    return res.data;
  },
};

export default orderServices;
