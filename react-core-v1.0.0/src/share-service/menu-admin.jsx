import {
  BarChart as BarChartIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Apartment as ApartmentIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  Engineering as EngineeringIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Layers as LayersIcon,
  ListAlt as ListAltIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

export const adminMenuConfig = [
  {
    label: "Thống kê tổng quan",
    path: "/admin",
    icon: <BarChartIcon />,
  },
  {
    label: "Quản lý hệ thống",
    icon: <AdminPanelSettingsIcon />,
    children: [
      {
        label: "Phân quyền & Vai trò",
        path: "/admin/role",
      },
      {
        label: "Quản lý người dùng",
        path: "/admin/user",
      },
    ],
  },
  {
    label: "Quản lý công ty",
    icon: <ApartmentIcon />,
    children: [
      {
        label: "Danh sách công ty",
        path: "/admin/company",
      },
      {
        label: "Loại công ty",
        path: "/admin/company_type",
      },
    ],
  },

  // MANUFACTURER
  {
    label: "Sản xuất",
    icon: <PrecisionManufacturingIcon />,
    children: [
      {
        label: "Kế hoạch sản xuất",
        path: "/admin/ke-hoach-san-xuat",
      },
      {
        label: "Bước sản xuất",
        path: "/admin/buoc-san-xuat",
      },
      {
        label: "Vật liệu sản xuất",
        path: "/admin/production_materials",
      },
      {
        label: "Sản phẩm",
        path: "/admin/product",
      },
      {
        label: "Danh mục sản phẩm",
        path: "/admin/category",
      },
      {
        label: "Kho hàng",
        path: "/admin/inventory",
      },
      {
        label: "Đơn đặt vật liệu",
        path: "/admin/material_order",
      },
      {
        label: "Thiết bị",
        path: "/admin/equipment",
      },
      {
        label: "Sản phẩm đã sản xuất",
        path: "/admin/product_instances",
      },
    ],
  },

  // SUPPLIER
  {
    label: "Nhà cung cấp",
    icon: <LayersIcon />,
    children: [
      {
        label: "Danh mục vật liệu",
        path: "/admin/material_type",
      },
      {
        label: "Vật liệu",
        path: "/admin/material",
      },
      {
        label: "Nhà cung cấp",
        path: "/admin/suppliers",
      },
    ],
  },

  // TRANSPORT
  {
    label: "Vận chuyển",
    path: "/admin/transport_orders",
    icon: <LocalShippingIcon />,
  },

  // RETAILER
  {
    label: "Bán lẻ & Đơn hàng",
    icon: <StoreIcon />,
    children: [
      {
        label: "Tất cả đơn hàng",
        path: "/admin/order/tat-ca",
      },
      {
        label: "Kinh doanh vật liệu",
        path: "/admin/material_order_master",
      },
      {
        label: "Đơn hàng Cty CC bán vật liệu đang xử lý",
        path: "/admin/material_order_master_pending",
      },
      {
        label: "Đơn hàng Cty SS mua vật liệu đang xử lý",
        path: "/admin/material_order_master_buy_pending",
      },
      {
        label: "Đơn hàng Cty VC vật liệu đang xử lý",
        path: "/admin/material_order_master_ship_pending",
      },
      {
        label: "Giỏ hàng",
        path: "/admin/cart",
      },
    ],
  },

  {
    label: "Báo cáo & Thống kê",
    path: "/admin/bao-cao",
    icon: <AssessmentIcon />,
  },
];
