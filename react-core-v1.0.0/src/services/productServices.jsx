import axiosInstance from "../authentication/axiosInstance";

const PRODUCT_API = `${process.env.REACT_APP_URL_SERVER}/products`;

const productServices = {
  // Lấy danh sách tất cả sản phẩm
  getProducts: async ({ ID_COMPANY }) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(PRODUCT_API, { params });
    return res.data;
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCT_API}/${id}`);
    return res.data;
  },

  // Tạo sản phẩm mới
  createProduct: async (data) => {
    // Nếu data có file (ví dụ IMAGE_URL_PRODUCTS là File), tạo FormData
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    const res = await axiosInstance.post(PRODUCT_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateProduct: async (id, data) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    const res = await axiosInstance.put(`${PRODUCT_API}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCT_API}/${id}`);
    return res.data;
  },
};

export default productServices;
