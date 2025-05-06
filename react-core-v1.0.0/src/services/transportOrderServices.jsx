import axiosInstance from "../authentication/axiosInstance";

const TRANSPORT_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/transport_orders`;

const transportOrderServices = {
  // Lấy danh sách tất cả đơn vận chuyển
  getTransportOrders: async () => {
    const res = await axiosInstance.get(TRANSPORT_ORDER_API);
    return res.data;
  },

  // Lấy đơn vận chuyển theo ID
  getTransportOrderById: async (id) => {
    const res = await axiosInstance.get(`${TRANSPORT_ORDER_API}/${id}`);
    return res.data;
  },

  // Tạo đơn vận chuyển mới
  createTransportOrder: async (data) => {
    const res = await axiosInstance.post(TRANSPORT_ORDER_API, data);
    return res.data;
  },

  // Cập nhật đơn vận chuyển
  updateTransportOrder: async (id, data) => {
    const res = await axiosInstance.put(`${TRANSPORT_ORDER_API}/${id}`, data);
    return res.data;
  },

  // Xóa đơn vận chuyển
  deleteTransportOrder: async (id) => {
    const res = await axiosInstance.delete(`${TRANSPORT_ORDER_API}/${id}`);
    return res.data;
  },
};

export default transportOrderServices;
