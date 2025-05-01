// src/services/serviceRoutes.js
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People"; // ví dụ icon khác

export const adminRoutes = [
  {
    label: "Thống kê cơ bản",
    path: "/admin",
    icon: <BarChartIcon sx={{ color: "#1f1f1f" }} />,
  },
  {
    label: "Quản lý người dùng",
    path: "/admin/users",
    icon: <PeopleIcon sx={{ color: "#1f1f1f" }} />,
  },
  // Thêm bao nhiêu route tùy ý
];
