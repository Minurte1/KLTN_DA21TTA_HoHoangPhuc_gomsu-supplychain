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

  console.table({
    revenueStats,
    topMaterial,
    totalSummary,
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Bảng điều khiển thống kê
          </h1>
          <p className="text-muted-foreground text-lg">
            Theo dõi hiệu suất kinh doanh và phân tích dữ liệu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Công ty
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {totalSummary?.NAME_COMPANY || "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalSummary?.TOTAL_REVENUE?.toLocaleString("vi-VN") || "0"} đ
              </div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Tăng trưởng
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Sản phẩm bán chạy
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {topMaterial.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Loại vật liệu khác nhau
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Dữ liệu doanh thu
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {revenueStats.monthlyRevenue.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tháng có dữ liệu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top selling materials chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">
                Top 5 sản phẩm bán chạy nhất
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Thống kê số lượng bán theo từng loại vật liệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={bestSellersChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Revenue trends chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-card-foreground">
                Xu hướng doanh thu
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Biểu đồ doanh thu theo ngày, tháng và năm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={combinedChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Chi tiết vật liệu bán chạy
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Danh sách đầy đủ các vật liệu và số lượng bán
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topMaterial.slice(0, 9).map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-card-foreground">
                      {material.MATERIAL_NAME}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Số lượng:{" "}
                      {Number.parseInt(
                        material.TOTAL_QUANTITY,
                        10
                      ).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Badge variant={index < 3 ? "default" : "secondary"}>
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMaterialAdmin;
