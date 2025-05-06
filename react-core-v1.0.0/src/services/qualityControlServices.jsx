import axiosInstance from "../authentication/axiosInstance";

const QUALITY_CONTROL_API = `${process.env.REACT_APP_URL_SERVER}/quality_control`;

const qualityControlServices = {
  // Lấy danh sách tất cả kiểm định chất lượng
  getQualityControls: async () => {
    const res = await axiosInstance.get(QUALITY_CONTROL_API);
    return res.data;
  },

  // Lấy kiểm định chất lượng theo ID
  getQualityControlById: async (id) => {
    const res = await axiosInstance.get(`${QUALITY_CONTROL_API}/${id}`);
    return res.data;
  },

  // Tạo kiểm định chất lượng mới
  createQualityControl: async (data) => {
    const res = await axiosInstance.post(QUALITY_CONTROL_API, data);
    return res.data;
  },

  // Cập nhật kiểm định chất lượng
  updateQualityControl: async (id, data) => {
    const res = await axiosInstance.put(`${QUALITY_CONTROL_API}/${id}`, data);
    return res.data;
  },

  // Xóa kiểm định chất lượng
  deleteQualityControl: async (id) => {
    const res = await axiosInstance.delete(`${QUALITY_CONTROL_API}/${id}`);
    return res.data;
  },
};

export default qualityControlServices;
