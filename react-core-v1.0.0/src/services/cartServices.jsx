import axiosInstance from "../authentication/axiosInstance";

const CART_API = `${process.env.REACT_APP_URL_SERVER}/cart`;

const cartServices = {
  getCartsByUser: async (ID_USERS) => {
    if (!ID_USERS) return null;
    try {
      const res = await axiosInstance.get(`${CART_API}/${ID_USERS}`);
      return res.data; // mảng giỏ hàng
    } catch (error) {
      console.error("Lỗi getCartsByUser:", error);
      return { error: error.response?.data?.message || "Lỗi khi lấy giỏ hàng" };
    }
  },

  getCartById: async (userId, productId) => {
    try {
      const res = await axiosInstance.get(`${CART_API}/${userId}/${productId}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi getCartById:", error);
      return { error: error.response?.data?.message || "Lỗi khi lấy sản phẩm" };
    }
  },

  createCart: async (data) => {
    try {
      const res = await axiosInstance.post(CART_API, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi createCart:", error);
      return {
        error: error.response?.data?.message || "Lỗi khi thêm sản phẩm",
      };
    }
  },

  updateCart: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${CART_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi updateCart:", error);
      return {
        error: error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng",
      };
    }
  },

  deleteCart: async (id) => {
    try {
      const res = await axiosInstance.delete(`${CART_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi deleteCart:", error);
      return { error: error.response?.data?.message || "Lỗi khi xóa sản phẩm" };
    }
  },
};

export default cartServices;
