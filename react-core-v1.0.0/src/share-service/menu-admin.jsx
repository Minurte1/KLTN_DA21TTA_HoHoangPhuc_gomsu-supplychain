// src/configs/adminMenuConfig.js
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const adminMenuConfig = [
  {
    label: "Thống kê cơ bản",
    path: "/admin",
    icon: <BarChartIcon />,
  },
  {
    label: "Quản lý người dùng",
    path: "/admin/nguoi-dung",
    icon: <PersonIcon />,
  },
  {
    label: "Quản lý sản phẩm",
    icon: <InventoryIcon />,
    children: [
      { label: "Thêm sản phẩm", path: "/admin/san-pham" },
      { label: "Danh mục sản phẩm", path: "/admin/san-pham/danh-muc" },
    ],
  },
  {
    label: "Quản lý đơn hàng",
    icon: <ShoppingCartIcon />,
    children: [
      { label: "Tất cả đơn hàng", path: "/admin/don-hang/tat-ca" },
      { label: "Đơn hàng đang xử lý", path: "/admin/don-hang/dang-xu-ly" },
      { label: "Đơn hàng đã hủy", path: "/admin/don-hang/da-huy" },
      { label: "Đơn hàng đã thanh toán", path: "/admin/don-hang/hoan-tat" },
      { label: "Quản lý khuyến mãi", path: "/admin/khuyen-mai" },
    ],
  },
];
