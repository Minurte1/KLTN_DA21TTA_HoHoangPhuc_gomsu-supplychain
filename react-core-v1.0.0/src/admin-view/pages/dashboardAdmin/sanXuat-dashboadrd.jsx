"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Badge } from "../../../components/ui/badge";

import { Building2, TrendingUp, Package, DollarSign } from "lucide-react";

import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import { statisticsApi } from "../../../services/thongKeServices";
import { Box } from "@mui/material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const DashboardSanXuatAdmin = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [totalSummary, setTotalSummary] = useState(null);
  const [topMaterial, setTopMaterial] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
    yearlyRevenue: [],
  });
  const [productStats, setProductStats] = useState({
    dailyQuantity: [],
    monthlyQuantity: [],
    yearlyQuantity: [],
  });
  console.table({
    revenueStats,
    topMaterial,
    totalSummary,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = userInfo?.ID_COMPANY;

        const ordersRes = await statisticsApi.getRevenueByManufacturer({
          ID_COMPANY: companyId,
        });
        setTotalSummary(ordersRes[0] || {});

        const topMaterialRes = await statisticsApi.getTopProducts({
          ID_COMPANY: companyId,
        });
        setTopMaterial(topMaterialRes || []);

        const revenueRes = await statisticsApi.getRevenueStatsAll({
          ID_COMPANY: companyId,
        });
        setRevenueStats(
          revenueRes || {
            dailyRevenue: [],
            monthlyRevenue: [],
            yearlyRevenue: [],
          }
        );
        const revenueResProduct = await statisticsApi.getProductStatsAll({
          ID_COMPANY: companyId,
        });
        setProductStats(
          revenueResProduct || {
            dailyQuantity: [],
            monthlyQuantity: [],
            yearlyQuantity: [],
          }
        );
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, [userInfo]);

  const combinedChartData = {
    labels: [
      // dailyRevenue: sắp xếp theo ngày tăng dần
      ...revenueStats.dailyRevenue
        .sort((a, b) => new Date(a.DAY) - new Date(b.DAY))
        .map((item) => new Date(item.DAY).toLocaleDateString("vi-VN")),
      // monthlyRevenue
      ...revenueStats.monthlyRevenue.map(
        (item) => `${item.MONTH}/${item.YEAR}`
      ),
      // yearlyRevenue
      ...revenueStats.yearlyRevenue.map((item) => item.YEAR),
    ],
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueStats.dailyRevenue
          .sort((a, b) => new Date(a.DAY) - new Date(b.DAY))
          .map((item) => item.TOTAL_REVENUE),
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Doanh thu theo tháng",
        data: revenueStats.monthlyRevenue.map((item) => item.TOTAL_REVENUE),
        borderColor: "hsl(var(--chart-2))",
        backgroundColor: "hsla(var(--chart-2), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Doanh thu theo năm",
        data: revenueStats.yearlyRevenue.map((item) => item.TOTAL_REVENUE),
        borderColor: "hsl(var(--chart-3))",
        backgroundColor: "hsla(var(--chart-3), 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Dữ liệu xu hướng sản phẩm
  const combinedQuantityChartData = {
    labels: [
      // dailyQuantity sắp xếp theo ngày tăng dần
      ...productStats.dailyQuantity
        .sort((a, b) => new Date(a.DAY) - new Date(b.DAY))
        .map((item) => new Date(item.DAY).toLocaleDateString("vi-VN")),
      // monthlyQuantity
      ...productStats.monthlyQuantity.map(
        (item) => `${item.MONTH}/${item.YEAR}`
      ),
      // yearlyQuantity
      ...productStats.yearlyQuantity.map((item) => item.YEAR),
    ],
    datasets: [
      {
        label: "Số lượng sản xuất theo ngày",
        data: productStats.dailyQuantity
          .sort((a, b) => new Date(a.DAY) - new Date(b.DAY))
          .map((item) => Number(item.TOTAL_QUANTITY)),
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Số lượng sản xuất theo tháng",
        data: productStats.monthlyQuantity.map((item) =>
          Number(item.TOTAL_QUANTITY)
        ),
        borderColor: "hsl(var(--chart-2))",
        backgroundColor: "hsla(var(--chart-2), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Số lượng sản xuất theo năm",
        data: productStats.yearlyQuantity.map((item) =>
          Number(item.TOTAL_QUANTITY)
        ),
        borderColor: "hsl(var(--chart-3))",
        backgroundColor: "hsla(var(--chart-3), 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "var(--font-sans)",
          },
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      y: {
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
  };

  return (
    <Box sx={{ padding: "40px" }}>
      {" "}
      <div className="min-vh-100 p-4" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="container-xxl">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h2 fw-bold" style={{ color: "#15803d" }}>
              Bảng điều khiển thống kê
            </h1>
            <p className="fs-5" style={{ color: "#374151" }}>
              Theo dõi hiệu suất kinh doanh và phân tích dữ liệu của bạn
            </p>
          </div>

          {/* 4 cards */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                  <h6
                    className="card-title mb-0 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Công ty
                  </h6>
                  <Building2 style={{ color: "#84cc16" }} size={18} />
                </div>
                <div className="card-body">
                  <h4 className="fw-bold" style={{ color: "#374151" }}>
                    {totalSummary?.NAME_COMPANY || "N/A"}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                  <h6
                    className="card-title mb-0 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Tổng doanh thu
                  </h6>
                  <DollarSign style={{ color: "#84cc16" }} size={18} />
                </div>
                <div className="card-body">
                  <h4 className="fw-bold" style={{ color: "#15803d" }}>
                    {totalSummary?.TOTAL_REVENUE?.toLocaleString("vi-VN") ||
                      "0"}{" "}
                    đ
                  </h4>
                  <Badge
                    variant="secondary"
                    className="mt-2 fw-semibold"
                    style={{ backgroundColor: "#84cc16", color: "#374151" }}
                  >
                    <TrendingUp className="me-1" size={12} />
                    Tăng trưởng
                  </Badge>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                  <h6
                    className="card-title mb-0 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Số sản phẩm đã bán được
                  </h6>
                  <Package style={{ color: "#84cc16" }} size={18} />
                </div>
                <div className="card-body">
                  <h4 className="fw-bold" style={{ color: "#374151" }}>
                    {totalSummary?.TOTAL_QUANTITY || "0"}
                  </h4>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Loại vật liệu khác nhau
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                  <h6
                    className="card-title mb-0 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Doanh thu tháng
                  </h6>
                  <TrendingUp style={{ color: "#84cc16" }} size={18} />
                </div>
                <div className="card-body">
                  <h4 className="fw-bold" style={{ color: "#374151" }}>
                    {revenueStats.monthlyRevenue[0]?.TOTAL_REVENUE.toLocaleString()}{" "}
                    VNĐ
                  </h4>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Tháng {revenueStats.monthlyRevenue[0]?.MONTH}/
                    {revenueStats.monthlyRevenue[0]?.YEAR}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0">
                {/* Header */}
                <div className="card-header bg-white border-0">
                  <h5
                    className="card-title mb-1 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Top sản phẩm bán chạy nhất
                  </h5>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Thống kê số lượng bán theo từng loại vật liệu
                  </p>
                </div>

                {/* Body */}
                <div className="card-body">
                  {/* Chart */}
                  {/* <div style={{ height: "300px" }}>
                    <Bar data={topMaterial} options={chartOptions} />
                  </div> */}

                  {/* Table chi tiết */}
                  <div className="mt-3 table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="fw-semibold">#</th>
                          <th className="fw-semibold">Tên sản phẩm</th>
                          <th className="fw-semibold text-end">Số lượng bán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topMaterial.map((item, index) => (
                          <tr key={item.MATERIAL_ID || index}>
                            <td>{index + 1}</td>
                            <td>{item.NAME_PRODUCTS}</td>
                            <td className="text-end">
                              {Number(item.TOTAL_QUANTITY).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0">
                  <h5
                    className="card-title mb-1 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Xu hướng doanh thu
                  </h5>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Biểu đồ doanh thu theo ngày, tháng và năm
                  </p>
                </div>
                <div className="card-body" style={{ height: "320px" }}>
                  <Line data={combinedChartData} options={chartOptions} />
                </div>
              </div>
            </div>{" "}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0">
                  <h5
                    className="card-title mb-1 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Xu hướng sản phẩm sản xuất được
                  </h5>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Biểu đồ sản phẩm sản xuất theo ngày, tháng và năm
                  </p>
                </div>
                <div className="card-body" style={{ height: "320px" }}>
                  <Line
                    data={combinedQuantityChartData}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default DashboardSanXuatAdmin;
