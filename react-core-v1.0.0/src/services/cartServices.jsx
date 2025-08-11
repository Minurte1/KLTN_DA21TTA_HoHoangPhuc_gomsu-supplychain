import axiosInstance from "../authentication/axiosInstance";

const CART_API = `${process.env.REACT_APP_URL_SERVER}/cart`;

const cartServices = {
  getCartsByUser: async (ID_USERS) => {
    if (!ID_USERS) return;
    const res = await axiosInstance.get(`${CART_API}/${ID_USERS}`);
    return res.data; // mảng giỏ hàng
  },
  // Lấy giỏ hàng theo ID người dùng và ID sản phẩm
  getCartById: async (userId, productId) => {
    const res = await axiosInstance.get(`${CART_API}/${userId}/${productId}`);
    return res.data;
  },

  // Tạo giỏ hàng mới (thêm sản phẩm vào giỏ hàng)
  createCart: async (data) => {
    const res = await axiosInstance.post(CART_API, data);
    return res.data;
  },

  // Cập nhật giỏ hàng (có thể thay đổi số lượng sản phẩm hoặc trạng thái)
  updateCart: async (id, data) => {
    const res = await axiosInstance.put(`${CART_API}/${id}`, data);
    return res.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  deleteCart: async (id) => {
    const res = await axiosInstance.delete(`${CART_API}/${id}`);
    return res.data;
  },
};

export default cartServices;
