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
        path: "/admin/production_plans",
      },
      {
        label: "Bước sản xuất",
        path: "/admin/production_steps",
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
      // {
      //   label: "Đơn đặt vật liệu",
      //   path: "/admin/material_order",
      // },
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
    label: "Vật liệu",
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
    icon: <LocalShippingIcon />,
    children: [
      {
        label: "Dịch vụ vận chuyển",
        path: "/admin/transport_service_fees",
      },
      {
        label: "Đơn hàng vận chuyển",
        path: "/admin/transport_orders",
      },
      {
        label: "Đơn hàng vận chuyển đã giao",
        path: "/admin/transport_orders_delivered",
      },
      {
        label: "Đơn hàng vận chuyển giao thành công",
        path: "/admin/transport_orders_success",
      },
      {
        label: "Đơn hàng vận chuyển giao thất bại",
        path: "/admin/transport_orders_failed",
      },
    ],
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
      // ============================Pending==========================
      {
        label: "Đơn hàng Cty CC bán vật liệu đang xử lý",
        path: "/admin/material_order_master_pending",
      },
      {
        label: "Đơn hàng Cty SS mua vật liệu",
        path: "/admin/material_order_master_buy_pending",
      },

      // ============================Confirmed==========================
      {
        label: "Đơn hàng Cty VC vật liệu đang xử lý",
        path: "/admin/material_order_master_ship_confirmed",
      },
      {
        label: "Đơn hàng Cty CC bán vật liệu đã xác nhận",
        path: "/admin/material_order_master_seller_confirmed",
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
