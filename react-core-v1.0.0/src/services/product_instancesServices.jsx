import axiosInstance from "../authentication/axiosInstance";

const PRODUCT_INSTANCES_API = `${process.env.REACT_APP_URL_SERVER}/product_instances`;

const productInstancesServices = {
  // Lấy danh sách tất cả product_instances theo ID_COMPANY và STATUS
  getProductInstances: async ({ ID_COMPANY, STATUS }) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
    if (STATUS) params.STATUS = STATUS;

    const res = await axiosInstance.get(PRODUCT_INSTANCES_API, { params });
    return res.data;
  },
  getProductInstancesPublic: async ({ ID_COMPANY = null, STATUS = null }) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;
    if (STATUS) params.STATUS = STATUS;

    const res = await axiosInstance.get(`${PRODUCT_INSTANCES_API}/public`, {
      params,
    });
    return res.data;
  },

  // Lấy product_instance theo ID
  getProductInstanceById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCT_INSTANCES_API}/${id}`);
    return res.data;
  },

  // Tạo mới product_instance
  createProductInstance: async (data) => {
    const res = await axiosInstance.post(PRODUCT_INSTANCES_API, data);
    return res.data;
  },

  // Cập nhật product_instance theo ID
  updateProductInstance: async (id, data) => {
    const res = await axiosInstance.put(`${PRODUCT_INSTANCES_API}/${id}`, data);
    return res.data;
  },

  // Xóa product_instance theo ID
  deleteProductInstance: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCT_INSTANCES_API}/${id}`);
    return res.data;
  },
};

export default productInstancesServices;
