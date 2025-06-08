import axiosInstance from "../authentication/axiosInstance";

const MATERIAL_ORDER_API = `${process.env.REACT_APP_URL_SERVER}/material-orders-master`;

const materialOrderMasterServices = {
  // Lấy danh sách tất cả các đơn hàng nguyên liệu
  getMaterialOrdersMaster: async () => {
    const res = await axiosInstance.get(MATERIAL_ORDER_API);
    return res.data;
  },

  // Lấy đơn hàng nguyên liệu theo ID
  getMaterialOrderMasterById: async (id) => {
    const res = await axiosInstance.get(`${MATERIAL_ORDER_API}/${id}`);
    return res.data;
  },
  getOrdersByCompanyAndMaterial: async (idCompany, idMaterial) => {
    const res = await axiosInstance.get(
      `${MATERIAL_ORDER_API}/orders/company-material`,
      { params: { idCompany, idMaterial } }
    );
    return res.data;
  },

  getOrdersByCompanyAndMaterial_idCompanyBuyer: async (
    idCompany,
    idMaterial
  ) => {
    const res = await axiosInstance.get(
      `${MATERIAL_ORDER_API}/orders/company-buy-material`,
      { params: { idCompany, idMaterial } }
    );
    return res.data;
  },
  // Tạo đơn hàng nguyên liệu mới
  createMaterialOrderMaster: async (data) => {
    const res = await axiosInstance.post(MATERIAL_ORDER_API, data);
    return res.data;
  },
  // Tạo đơn hàng từ 1 công ty để mua từ 1 công ty material
  createMaterialOrderMasterFull: async (data) => {
    const res = await axiosInstance.post(
      `${MATERIAL_ORDER_API}/material-orders/create`,
      data
    );
    return res.data;
  },

  // Cập nhật đơn hàng nguyên liệu
  updateMaterialOrderMaster: async (id, data) => {
    const res = await axiosInstance.put(`${MATERIAL_ORDER_API}/${id}`, data);
    return res.data;
  },
  // Cập nhật đơn hàng nguyên liệu
  confirmOrder: async (data) => {
    const res = await axiosInstance.post(
      `${MATERIAL_ORDER_API}/confirm-order`,
      data
    );
    return res.data;
  },

  // Xóa đơn hàng nguyên liệu
  deleteMaterialOrderMaster: async (id) => {
    const res = await axiosInstance.delete(`${MATERIAL_ORDER_API}/${id}`);
    return res.data;
  },
};

export default materialOrderMasterServices;
