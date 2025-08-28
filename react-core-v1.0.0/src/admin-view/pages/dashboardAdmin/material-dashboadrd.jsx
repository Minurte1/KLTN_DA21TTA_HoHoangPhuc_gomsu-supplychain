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

const DashboardMaterialAdmin = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [totalSummary, setTotalSummary] = useState(null);
  const [topMaterial, setTopMaterial] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
    yearlyRevenue: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = userInfo?.ID_COMPANY;

        const ordersRes = await statisticsApi.getSummary({
          ID_COMPANY: companyId,
        });
        setTotalSummary(ordersRes[0] || {});

        const topMaterialRes = await statisticsApi.getTopMaterials({
          ID_COMPANY: companyId,
        });
        setTopMaterial(topMaterialRes || []);

        const revenueRes = await statisticsApi.getMonthlyRevenue({
          ID_COMPANY: companyId,
        });
        setRevenueStats(
          revenueRes || {
            dailyRevenue: [],
            monthlyRevenue: [],
            yearlyRevenue: [],
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
      ...revenueStats.dailyRevenue.map((item) =>
        new Date(item.DATE).toLocaleDateString("vi-VN")
      ),
      ...revenueStats.monthlyRevenue.map(
        (item) => `${item.MONTH}/${item.YEAR}`
      ),
      ...revenueStats.yearlyRevenue.map((item) => item.YEAR),
    ],
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueStats.dailyRevenue.map((item) => item.TOTAL_REVENUE),
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

  const topFiveBestSellers = topMaterial.slice(0, 5);

  const bestSellersChartData = {
    labels: topFiveBestSellers.map((item) => item.MATERIAL_NAME),
    datasets: [
      {
        label: "Số lượng bán",
        data: topFiveBestSellers.map((item) =>
          Number.parseInt(item.TOTAL_QUANTITY, 10)
        ),
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ],
        borderRadius: 8,
        borderSkipped: false,
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
                    Sản phẩm bán chạy
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
                <div className="card-header bg-white border-0">
                  <h5
                    className="card-title mb-1 fw-semibold"
                    style={{ color: "#15803d" }}
                  >
                    Top 5 sản phẩm bán chạy nhất
                  </h5>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Thống kê số lượng bán theo từng loại vật liệu
                  </p>
                </div>
                <div className="card-body" style={{ height: "320px" }}>
                  <Bar data={bestSellersChartData} options={chartOptions} />
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
            </div>
          </div>

          {/* Top Materials */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5
                className="card-title mb-1 fw-semibold"
                style={{ color: "#15803d" }}
              >
                Chi tiết vật liệu bán chạy
              </h5>
              <p className="small mb-0" style={{ color: "#374151" }}>
                Danh sách đầy đủ các vật liệu và số lượng bán
              </p>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {topMaterial.slice(0, 9).map((material, index) => (
                  <div className="col-12 col-md-6 col-lg-4" key={index}>
                    <div
                      className="d-flex justify-content-between align-items-center p-3 border rounded"
                      style={{ backgroundColor: "#f0fdf4" }}
                    >
                      <div>
                        <p
                          className="fw-semibold mb-1"
                          style={{ color: "#374151" }}
                        >
                          {material.MATERIAL_NAME}
                        </p>
                        <p className="small mb-0" style={{ color: "#374151" }}>
                          Số lượng:{" "}
                          <span
                            style={{
                              backgroundColor: "#e5f5eb", // nền nhạt hơn text
                              color: "#374151", // chữ đậm
                              padding: "2px 6px",
                              borderRadius: "6px",
                              fontWeight: "600",
                            }}
                          >
                            {Number.parseInt(
                              material.TOTAL_QUANTITY,
                              10
                            ).toLocaleString("vi-VN")}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant={index < 3 ? "primary" : "secondary"}
                        className="fw-semibold"
                        style={{
                          backgroundColor: index < 3 ? "#84cc16" : "#15803d",
                          color: "#ffffff",
                        }}
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default DashboardMaterialAdmin;
