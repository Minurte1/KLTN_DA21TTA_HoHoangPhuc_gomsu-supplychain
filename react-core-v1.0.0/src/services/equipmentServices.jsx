import axiosInstance from "../authentication/axiosInstance";

const EQUIPMENT_API = `${process.env.REACT_APP_URL_SERVER}/equipment`;

const equipmentServices = {
  // Lấy danh sách tất cả thiết bị, có thể lọc theo STATUS hoặc TYPE_EQUIPMENT
  getEquipments: async ({ ID_COMPANY, STATUS, TYPE_EQUIPMENT } = {}) => {
    const params = {};
    if (STATUS) params.STATUS = STATUS;
    if (TYPE_EQUIPMENT) params.TYPE_EQUIPMENT = TYPE_EQUIPMENT;
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(EQUIPMENT_API, { params });
    return res.data;
  },

  // Lấy thiết bị theo ID
  getEquipmentById: async (id) => {
    const res = await axiosInstance.get(`${EQUIPMENT_API}/${id}`);
    return res.data;
  },

  // Tạo thiết bị mới
  createEquipment: async (data) => {
    const res = await axiosInstance.post(EQUIPMENT_API, data);
    return res.data;
  },

  // Cập nhật thiết bị
  updateEquipment: async (id, data) => {
    const res = await axiosInstance.put(`${EQUIPMENT_API}/${id}`, data);
    return res.data;
  },

  // Xóa thiết bị
  deleteEquipment: async (id) => {
    const res = await axiosInstance.delete(`${EQUIPMENT_API}/${id}`);
    return res.data;
  },
};

export default equipmentServices;
