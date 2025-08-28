import axiosInstance from "../authentication/axiosInstance";

const TRANSPORT_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/transport-orders`;

const transportOrderServices = {
  // Lấy danh sách tất cả đơn vận chuyển
  getTransportOrders: async (STATUS) => {
    try {
      const res = await axiosInstance.get(TRANSPORT_ORDER_API, {
        params: { STATUS },
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn vận chuyển:", error);
      return null;
    }
  },

  // Lấy đơn vận chuyển theo ID
  getTransportOrderById: async (id) => {
    try {
      const res = await axiosInstance.get(`${TRANSPORT_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy đơn vận chuyển theo ID:", error);
      return null;
    }
  },

  // Tạo đơn vận chuyển mới
  createTransportOrder: async (data) => {
    try {
      const res = await axiosInstance.post(TRANSPORT_ORDER_API, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo đơn vận chuyển:", error);
      return { success: false, message: "Không thể tạo đơn vận chuyển" };
    }
  },

  // Cập nhật đơn vận chuyển
  updateTransportOrder: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${TRANSPORT_ORDER_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn vận chuyển:", error);
      return { success: false, message: "Không thể cập nhật đơn vận chuyển" };
    }
  },

  // Xóa đơn vận chuyển
  deleteTransportOrder: async (id) => {
    try {
      const res = await axiosInstance.delete(`${TRANSPORT_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xóa đơn vận chuyển:", error);
      return { success: false, message: "Không thể xóa đơn vận chuyển" };
    }
  },
};

export default transportOrderServices;
