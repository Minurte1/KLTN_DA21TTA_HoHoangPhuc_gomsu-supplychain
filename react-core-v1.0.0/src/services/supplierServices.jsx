import axiosInstance from "../authentication/axiosInstance";

const SUPPLIER_API = `${process.env.REACT_APP_URL_SERVER}/suppliers`;

const supplierServices = {
  // Lấy danh sách tất cả nhà cung cấp
  getSuppliers: async () => {
    const res = await axiosInstance.get(SUPPLIER_API);
    return res.data;
  },

  // Lấy nhà cung cấp theo ID
  getSupplierById: async (id) => {
    const res = await axiosInstance.get(`${SUPPLIER_API}/${id}`);
    return res.data;
  },

  // Tạo nhà cung cấp mới
  createSupplier: async (data) => {
    const res = await axiosInstance.post(SUPPLIER_API, data);
    return res.data;
  },

  // Cập nhật nhà cung cấp
  updateSupplier: async (id, data) => {
    const res = await axiosInstance.put(`${SUPPLIER_API}/${id}`, data);
    return res.data;
  },

  // Xóa nhà cung cấp
  deleteSupplier: async (id) => {
    const res = await axiosInstance.delete(`${SUPPLIER_API}/${id}`);
    return res.data;
  },
};

export default supplierServices;
