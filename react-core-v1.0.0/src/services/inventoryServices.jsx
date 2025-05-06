import axiosInstance from "../authentication/axiosInstance";

const INVENTORY_API = `${process.env.REACT_APP_URL_SERVER}/inventory`;

const inventoryServices = {
  // Lấy danh sách tất cả các sản phẩm trong kho
  getInventories: async () => {
    const res = await axiosInstance.get(INVENTORY_API);
    return res.data;
  },

  // Lấy kho theo ID sản phẩm
  getInventoryById: async (id) => {
    const res = await axiosInstance.get(`${INVENTORY_API}/${id}`);
    return res.data;
  },

  // Tạo kho mới (thêm sản phẩm vào kho)
  createInventory: async (data) => {
    const res = await axiosInstance.post(INVENTORY_API, data);
    return res.data;
  },

  // Cập nhật thông tin kho
  updateInventory: async (id, data) => {
    const res = await axiosInstance.put(`${INVENTORY_API}/${id}`, data);
    return res.data;
  },

  // Xóa thông tin kho
  deleteInventory: async (id) => {
    const res = await axiosInstance.delete(`${INVENTORY_API}/${id}`);
    return res.data;
  },
};

export default inventoryServices;
