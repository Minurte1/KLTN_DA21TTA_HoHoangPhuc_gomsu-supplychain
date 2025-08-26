// api/statistics.js

import axiosInstance from "../authentication/axiosInstance";

const statistic_URL = `${process.env.REACT_APP_URL_SERVER}/thong-ke/companies`;

export const statisticsApi = {
  // Thống kê chung
  getSummary: async ({ ID_COMPANY } = {}) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(statistic_URL, { params });
    return res.data;
  },

  // Top vật liệu
  getTopMaterials: async ({ ID_COMPANY } = {}) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(`${statistic_URL}/material`, {
      params,
    });
    return res.data;
  },
  // Doanh thu theo tháng trong năm hiện tại
  getMonthlyRevenue: async ({ ID_COMPANY } = {}) => {
    const params = {};
    if (ID_COMPANY) params.ID_COMPANY = ID_COMPANY;

    const res = await axiosInstance.get(`${statistic_URL}/revenue-stats`, {
      params,
    });
    return res.data;
  },
};
