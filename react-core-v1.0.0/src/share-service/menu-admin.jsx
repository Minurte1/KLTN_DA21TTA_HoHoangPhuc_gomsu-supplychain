import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessIcon from "@mui/icons-material/Business";

export const adminMenuConfig = [
  {
    label: "Thống kê cơ bản",
    path: "/admin",
    icon: <BarChartIcon />,
  },
  {
    label: "Phân quyền & vai trò",
    path: "/admin/phan-quyen",
    icon: <AdminPanelSettingsIcon />,
  },
  {
    label: "Quản lý công ty",
    icon: <ApartmentIcon />,
    children: [
      {
        label: "Danh sách công ty",
        path: "/admin/cong-ty",
      },
      {
        label: "Loại công ty",
        path: "/admin/loai-cong-ty",
      },
    ],
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
      { label: "Danh sách sản phẩm", path: "/admin/san-pham" },
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
    ],
  },
  {
    label: "Quản lý kho & vật liệu",
    icon: <CategoryIcon />,
    children: [
      { label: "Kho nguyên vật liệu", path: "/admin/kho" },
      { label: "Loại vật liệu", path: "/admin/loai-vat-lieu" },
      { label: "Danh sách vật liệu", path: "/admin/vat-lieu" },
    ],
  },
  {
    label: "Quản lý đơn đặt vật liệu",
    path: "/admin/don-vat-lieu",
    icon: <LocalShippingIcon />,
  },
  {
    label: "Quản lý kế hoạch sản xuất",
    icon: <PrecisionManufacturingIcon />,
    children: [
      { label: "Danh sách kế hoạch", path: "/admin/ke-hoach-san-xuat" },
      { label: "Bước sản xuất", path: "/admin/buoc-san-xuat" },
    ],
  },
  {
    label: "Quản lý chất lượng",
    path: "/admin/kiem-tra-chat-luong",
    icon: <FactCheckIcon />,
  },
  {
    label: "Quản lý thiết bị",
    path: "/admin/thiet-bi",
    icon: <EngineeringIcon />,
  },
  {
    label: "Quản lý nhà cung cấp",
    path: "/admin/nha-cung-cap",
    icon: <LocalShippingIcon />,
  },

  {
    label: "Báo cáo & thống kê",
    path: "/admin/bao-cao",
    icon: <AssessmentIcon />,
  },
];
