import {
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
} from "@mui/icons-material";

export const userMenuConfig = [
  {
    label: "Thông tin người dùng",
    path: "/profile",
    icon: <BarChartIcon />,
  },

  {
    label: "Đơn hàng của tôi",
    icon: <ShoppingCartIcon />,
    path: "/profile/orders",
  },
];
