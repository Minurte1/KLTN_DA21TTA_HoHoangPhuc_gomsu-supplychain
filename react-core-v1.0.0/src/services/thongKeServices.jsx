import axiosInstance from "../authentication/axiosInstance";

const statistic_URL = `${process.env.REACT_APP_URL_SERVER}/thong-ke/companies`;

export const statisticsApi = {
  // Thống kê chung
  getSummary: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(statistic_URL, { params });
      return res.data;
    } catch (error) {
      console.error("Error getSummary:", error);
      return null;
    }
  },

  // Top vật liệu
  getTopMaterials: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/material`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getTopMaterials:", error);
      return null;
    }
  },

  // Doanh thu theo tháng trong năm hiện tại
  getMonthlyRevenue: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/revenue-stats`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getMonthlyRevenue:", error);
      return null;
    }
  },

  // ==============SẢN XUẤT==============================
  // Doanh thu theo nhà sản xuất
  getRevenueByManufacturer: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(
        `${statistic_URL}/revenue-manufacturer`,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error("Error getRevenueByManufacturer:", error);
      return null;
    }
  },

  // Top 10 sản phẩm
  getTopProducts: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/top-products`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getTopProducts:", error);
      return null;
    }
  },

  // Thống kê doanh thu theo ngày, tháng, năm (dành cho sản xuất)
  getRevenueStatsAll: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/revenue-stats-ss`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getRevenueStatsAll:", error);
      return null;
    }
  },

  // Thống kê số lượng sản phẩm theo ngày, tháng, năm
  getProductStatsAll: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/product-stats-ss`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getProductStatsAll:", error);
      return null;
    }
  },

  // ================= VẬN CHUYỂN ======================
  // Doanh thu vận chuyển
  getTransportRevenue: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(
        `${statistic_URL}/transport-revenue`,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error("Error getTransportRevenue:", error);
      return null;
    }
  },

  // Số lần sử dụng dịch vụ vận chuyển
  getTransportUsage: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/transport-usage`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getTransportUsage:", error);
      return null;
    }
  },

  // Doanh thu theo ngày
  getRevenueByDay: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/revenue-by-day`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getRevenueByDay:", error);
      return null;
    }
  },

  // Doanh thu theo tháng
  getRevenueByMonth: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/revenue-by-month`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getRevenueByMonth:", error);
      return null;
    }
  },

  // Doanh thu theo năm
  getRevenueByYear: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(`${statistic_URL}/revenue-by-year`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Error getRevenueByYear:", error);
      return null;
    }
  },

  // Doanh thu vận chuyển tổng hợp
  revenueStatsTransport: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(
        `${statistic_URL}/revenue-stats-transport`,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error("Error revenueStatsTransport:", error);
      return null;
    }
  },

  // Top 5 công ty vận chuyển
  top5CompaniesTransport: async ({ ID_COMPANY } = {}) => {
    try {
      const params = {};
      if (ID_COMPANY) params.companyId = ID_COMPANY;

      const res = await axiosInstance.get(
        `${statistic_URL}/top5-companies-transport`,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error("Error top5CompaniesTransport:", error);
      return null;
    }
  },
};
