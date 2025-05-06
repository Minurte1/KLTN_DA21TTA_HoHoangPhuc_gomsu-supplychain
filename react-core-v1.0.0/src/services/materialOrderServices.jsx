import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/material-orders`;

const materialOrderServices = {
  // Lấy danh sách tất cả các đơn hàng nguyên liệu
  getMaterialOrders: async () => {
    const res = await axiosInstance.get(MATERIAL_ORDER_API);
    return res.data;
  },

  // Lấy đơn hàng nguyên liệu theo ID
  getMaterialOrderById: async (id) => {
    const res = await axiosInstance.get(`${MATERIAL_ORDER_API}/${id}`);
    return res.data;
  },

  // Tạo đơn hàng nguyên liệu mới
  createMaterialOrder: async (data) => {
    const res = await axiosInstance.post(MATERIAL_ORDER_API, data);
    return res.data;
  },

  // Cập nhật đơn hàng nguyên liệu
  updateMaterialOrder: async (id, data) => {
    const res = await axiosInstance.put(`${MATERIAL_ORDER_API}/${id}`, data);
    return res.data;
  },

  // Xóa đơn hàng nguyên liệu
  deleteMaterialOrder: async (id) => {
    const res = await axiosInstance.delete(`${MATERIAL_ORDER_API}/${id}`);
    return res.data;
  },
};

export default materialOrderServices;
