import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/material-orders-master`;

const materialOrderMasterServices = {
  // Lấy danh sách tất cả các đơn hàng nguyên liệu
  getMaterialOrdersMaster: async (filters = {}) => {
    try {
      const res = await axiosInstance.get(MATERIAL_ORDER_API, {
        params: filters,
      });
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Lấy đơn hàng nguyên liệu theo ID
  getMaterialOrderMasterById: async (id) => {
    try {
      const res = await axiosInstance.get(`${MATERIAL_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng nguyên liệu theo ID:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Lấy đơn hàng theo công ty & nguyên liệu
  getOrdersByCompanyAndMaterial: async (idCompany, idMaterial) => {
    try {
      const res = await axiosInstance.get(
        `${MATERIAL_ORDER_API}/orders/company-material`,
        { params: { idCompany, idMaterial } }
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng theo công ty & nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Lấy đơn hàng từ 1 công ty mua nguyên liệu từ công ty khác
  getOrdersByCompanyAndMaterial_idCompanyBuyer: async (
    idCompany,
    idMaterial
  ) => {
    try {
      const res = await axiosInstance.get(
        `${MATERIAL_ORDER_API}/orders/company-buy-material`,
        { params: { idCompany, idMaterial } }
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng mua nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Tạo đơn hàng nguyên liệu mới
  createMaterialOrderMaster: async (data) => {
    try {
      const res = await axiosInstance.post(MATERIAL_ORDER_API, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Tạo đơn hàng từ 1 công ty mua từ 1 công ty material
  createMaterialOrderMasterFull: async (data) => {
    try {
      const res = await axiosInstance.post(
        `${MATERIAL_ORDER_API}/material-orders/create`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng đầy đủ:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Cập nhật đơn hàng nguyên liệu
  updateMaterialOrderMaster: async (id, data) => {
    try {
      const res = await axiosInstance.put(`${MATERIAL_ORDER_API}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Xác nhận đơn hàng
  confirmOrder: async (data) => {
    try {
      const res = await axiosInstance.post(
        `${MATERIAL_ORDER_API}/confirm-order`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Xóa đơn hàng nguyên liệu
  deleteMaterialOrderMaster: async (id) => {
    try {
      const res = await axiosInstance.delete(`${MATERIAL_ORDER_API}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatusMaterialOrderMaster: async (
    id,
    status,
    data,
    isTransportOrders
  ) => {
    try {
      const res = await axiosInstance.put(
        `${MATERIAL_ORDER_API}/update-status/${id}`,
        { status, data, isTransportOrders }
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng nguyên liệu:", error);
      return { error: error.response?.data || "Lỗi server" };
    }
  },
};

export default materialOrderMasterServices;
