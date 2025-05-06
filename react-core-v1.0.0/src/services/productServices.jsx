import axiosInstance from "../authentication/axiosInstance";

const PRODUCT_API = `${process.env.REACT_APP_URL_SERVER}/products`;

const productServices = {
  // Lấy danh sách tất cả sản phẩm
  getProducts: async () => {
    const res = await axiosInstance.get(PRODUCT_API);
    return res.data;
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    const res = await axiosInstance.get(`${PRODUCT_API}/${id}`);
    return res.data;
  },

  // Tạo sản phẩm mới
  createProduct: async (data) => {
    const res = await axiosInstance.post(PRODUCT_API, data);
    return res.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, data) => {
    const res = await axiosInstance.put(`${PRODUCT_API}/${id}`, data);
    return res.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(`${PRODUCT_API}/${id}`);
    return res.data;
  },
};

export default productServices;
