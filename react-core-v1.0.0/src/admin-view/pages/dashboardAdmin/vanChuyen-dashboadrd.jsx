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
import { CheckCircle } from "@mui/icons-material";

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

const DashboardVanChuyenAdmin = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [totalSummary, setTotalSummary] = useState(null);
  const [topMaterial, setTopMaterial] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    byDay: [],
    byMonth: [],
    byYear: [],
  });
  const [totalTranPortUsage, setTotalTranPortUsage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = userInfo?.ID_COMPANY;

        const ordersRes = await statisticsApi.getTransportRevenue({
          ID_COMPANY: companyId,
        });
        setTotalSummary(ordersRes || {});

        const topMaterialRes = await statisticsApi.getTransportUsage({
          ID_COMPANY: companyId,
        });
        setTotalTranPortUsage(topMaterialRes || []);

        const revenueRes = await statisticsApi.revenueStatsTransport({
          ID_COMPANY: companyId,
        });
        setRevenueStats(
          revenueRes || {
            byDay: [],
            byMonth: [],
            byYear: [],
          }
        );

        const responseTop5Companies =
          await statisticsApi.top5CompaniesTransport({ ID_COMPANY: companyId });
        setTopMaterial(responseTop5Companies || []);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, [userInfo]);

  const combinedChartData = {
    labels: [
      // dailyRevenue: sắp xếp theo ngày tăng dần
      ...revenueStats?.byDay
        .sort((a, b) => new Date(a.TIME_UNIT) - new Date(b.TIME_UNIT))
        .map((item) => new Date(item.TIME_UNIT).toLocaleDateString("vi-VN")),
      // monthlyRevenue
      ...revenueStats?.byMonth.map((item) => `${item.MONTH}/${item.YEAR}`),
      // yearlyRevenue
      ...revenueStats?.byYear.map((item) => item.YEAR),
    ],
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: revenueStats?.byDay
          .sort((a, b) => new Date(a.TIME_UNIT) - new Date(b.TIME_UNIT))
          .map((item) => item.TOTAL_REVENUE),
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Doanh thu theo tháng",
        data: revenueStats?.byMonth.map((item) => item.TOTAL_REVENUE),
        borderColor: "hsl(var(--chart-2))",
        backgroundColor: "hsla(var(--chart-2), 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Doanh thu theo năm",
        data: revenueStats?.byYear.map((item) => item?.TOTAL_REVENUE),
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

          {Array.isArray(totalSummary) && totalSummary.length === 1 ? (
            // ----- Render 4 cards -----
            <div className="row g-4 mb-4">
              {/* Tên công ty */}
              <div className="col-12 col-md-6 col-lg-4">
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
                      {totalSummary[0]?.NAME_COMPANY || "N/A"}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Tổng số đơn hàng vận chuyển */}
              <div className="col-12 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm border-0"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                    <h6
                      className="card-title mb-0 fw-semibold"
                      style={{ color: "#15803d" }}
                    >
                      Tổng số tiền
                    </h6>
                    <Package style={{ color: "#84cc16" }} size={18} />
                  </div>
                  <div className="card-body">
                    <h4 className="fw-bold" style={{ color: "#15803d" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(totalSummary[0]?.TOTAL_REVENUE || 0))}
                    </h4>

                    <p className="small mb-0" style={{ color: "#374151" }}>
                      Đơn vận chuyển
                    </p>
                  </div>
                </div>
              </div>

              {/* Đơn hàng thành công */}
              <div className="col-12 col-md-6 col-lg-4">
                <div
                  className="card shadow-sm border-0"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                    <h6
                      className="card-title mb-0 fw-semibold"
                      style={{ color: "#15803d" }}
                    >
                      Số đơn hàng thành công
                    </h6>
                    <CheckCircle style={{ color: "#84cc16" }} size={18} />
                  </div>
                  <div className="card-body">
                    <h4 className="fw-bold" style={{ color: "#374151" }}>
                      {totalSummary[0]?.TOTAL_SUCCESS_ORDERS || "0"}
                    </h4>
                    <p className="small mb-0" style={{ color: "#374151" }}>
                      Hoàn tất vận chuyển
                    </p>
                  </div>
                </div>
              </div>

              {/* Doanh thu tháng */}
              {/* <div className="col-12 col-md-6 col-lg-3">
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
                      {revenueStats?.byMonth?.[0]?.TOTAL_REVENUE?.toLocaleString(
                        "vi-VN"
                      ) || 0}{" "}
                      VNĐ
                    </h4>
                    <p className="small mb-0" style={{ color: "#374151" }}>
                      Tháng {revenueStats?.byMonth?.[0]?.MONTH}/
                      {revenueStats?.byMonth?.[0]?.YEAR}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          ) : (
            // ----- Render Table -----
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header bg-white border-0">
                <h5
                  className="card-title mb-1 fw-semibold"
                  style={{ color: "#15803d" }}
                >
                  Danh sách công ty
                </h5>
                <p className="small mb-0" style={{ color: "#374151" }}>
                  Thống kê theo từng công ty
                </p>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Công ty</th>
                        <th className="text-end">Tổng số tiền dịch vụ</th>
                        <th className="text-end">Đơn hàng thành công</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(totalSummary) &&
                        totalSummary.map((item, index) => (
                          <tr key={item.ID_COMPANY}>
                            <td>{index + 1}</td>
                            <td>{item.NAME_COMPANY}</td>
                            <td className="text-end">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(Number(item?.TOTAL_REVENUE || 0))}
                            </td>

                            <td className="text-end">
                              {item.TOTAL_SUCCESS_ORDERS || 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

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
                    Top công ty tin tưởng sử dụng dịch vụ nhiều nhất
                  </h5>
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    Thống kê top công ty
                  </p>
                </div>
                {/* Body */}{" "}
                <div className="card-body">
                  {/* Table chi tiết */}
                  <div className="mt-3 table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="fw-semibold">#</th>
                          <th className="fw-semibold">Tên công ty</th>
                          <th className="fw-semibold text-end">
                            Số lượng sử dụng dịch vụ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topMaterial.map((item, index) => (
                          <tr key={item.MATERIAL_ID || index}>
                            <td>{index + 1}</td>
                            <td>{item.NAME_COMPANY}</td>
                            <td className="text-end">
                              {Number(item.TOTAL_ORDERS).toLocaleString()}
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
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default DashboardVanChuyenAdmin;
