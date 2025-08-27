import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/dashboardAdmin/DashboardAdmin";
import Role from "./pages/role-page";
import Company from "./pages/companies-page";
import CompanyType from "./pages/company_types-page";
import User from "./pages/users-page";
import Product from "./pages/products-page";
import Category from "./pages/categories-page";
import MaterialType from "./pages/material_types-page";
import Material from "./pages/materials-page";
import Supplier from "./pages/suppliers-page";
import PrivateRoute from "../authentication/privateRoute";
import MaterialOrderMaster from "./pages/material_order_master";
import MaterialOrderMasterPending from "./pages/material-order/order-peding/material_order_master_ctyBuy_peding";
import MaterialOrderAll from "./pages/material-order/material_order_master_all";
import MaterialOrderMaster_SellerPending from "./pages/material-order/order-peding/material_order_master_ctySeller_peding";
import MaterialOrderMaster_BuyPending from "./pages/material-order/order-peding/material_order_master_ctyBuy_peding";
import MaterialOrderMaster_ShipConfirmed from "./pages/material-order/order-confirmed/material_order_master_ctyShip_confirmed";
import MaterialOrderMaster_SellerConfirmed from "./pages/material-order/order-confirmed/material_order_master_ctySeller_confirmed";
import TransportServiceFees from "./pages/transportServiceFees-page";
import Transport_ordersShipDELIVERING from "./pages/material-order/transport_ordersShip/transport_ordersShipDELIVERING";
import Transport_ordersShipDELIVERED from "./pages/material-order/transport_ordersShip/transport_ordersShipDELIVERED";
import Transport_ordersShipSUCCESS from "./pages/material-order/transport_ordersShip/transport_ordersShipSUCCESS";
import Transport_ordersShipFAILED from "./pages/material-order/transport_ordersShip/transport_ordersShipFAILED";
import Transport_ordersBuyDELIVERED from "./pages/material-order/order-success/transport_ordersShipDELIVERED";
import Equipment from "./pages/Equipment";
import ProductionSteps from "./pages/productionStep-page";
import ProductionPlans from "./pages/productionPlans-page";
import ProductInstances from "./pages/product_instances-page";
import Orders from "./pages/orders-page";
import DashboardMaterialAdmin from "./pages/dashboardAdmin/material-dashboadrd";
import DashboardSanXuatAdmin from "./pages/dashboardAdmin/sanXuat-dashboadrd";
import DashboardVanChuyenAdmin from "./pages/dashboardAdmin/vanChuyen-dashboadrd";

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardAdmin />,
    },
    {
      path: "/thong-ke-vat-lieu",
      element: (
        <PrivateRoute>
          <DashboardMaterialAdmin />
        </PrivateRoute>
      ),
    },
    {
      path: "/thong-ke-san-xuat",
      element: (
        <PrivateRoute>
          <DashboardSanXuatAdmin />
        </PrivateRoute>
      ),
    },
    {
      path: "/thong-ke-van-chuyen",
      element: (
        <PrivateRoute>
          <DashboardVanChuyenAdmin />
        </PrivateRoute>
      ),
    },
    {
      path: "/role",
      element: (
        <PrivateRoute>
          <Role />
        </PrivateRoute>
      ),
    },
    {
      path: "/company",
      element: (
        <PrivateRoute>
          <Company />
        </PrivateRoute>
      ),
    },
    {
      path: "/company_type",
      element: (
        <PrivateRoute>
          <CompanyType />
        </PrivateRoute>
      ),
    },
    {
      path: "/user",
      element: (
        <PrivateRoute>
          <User />
        </PrivateRoute>
      ),
    },
    {
      path: "/product",
      element: (
        <PrivateRoute>
          <Product />
        </PrivateRoute>
      ),
    },
    {
      path: "/category",
      element: (
        <PrivateRoute>
          <Category />
        </PrivateRoute>
      ),
    },

    {
      path: "/order/tat-ca",
      element: <MaterialOrderAll />,
    },
    {
      path: "/order_item",
      element: <Orders />,
    },
    // {
    //   path: "/admin/don-hang/dang-xu-ly",
    //   element: <OrderProcessing />,
    // },
    // {
    //   path: "/admin/don-hang/da-huy",
    //   element: <OrderCancelled />,
    // },
    // {
    //   path: "/admin/don-hang/hoan-tat",
    //   element: <OrderCompleted />,
    // },
    // {
    //   path: "/admin/kho",
    //   element: <Warehouse />,
    // },
    {
      path: "/material_type",
      element: <MaterialType />,
    },
    {
      path: "/material",
      element: <Material />,
    },
    {
      path: "/transport_service_fees",
      element: <TransportServiceFees />,
    },
    {
      path: "/material_order_master",
      element: <MaterialOrderMaster />,
    },
    {
      path: "/material_order_master_pending",
      element: <MaterialOrderMaster_SellerPending />,
    },
    {
      path: "/material_order_master_buy_pending",
      element: <MaterialOrderMaster_BuyPending />,
    },
    {
      path: "/material_order_master_ship_confirmed",
      element: <MaterialOrderMaster_ShipConfirmed />,
    },
    {
      path: "/material_order_master_seller_confirmed",
      element: <MaterialOrderMaster_SellerConfirmed />,
    },
    {
      path: "/transport_orders",
      element: <Transport_ordersShipDELIVERING />,
    },
    {
      path: "/transport_orders_delivered",
      element: <Transport_ordersShipDELIVERED />,
    },
    {
      path: "/transport_orders_success",
      element: <Transport_ordersShipSUCCESS />,
    },
    {
      path: "/transport_orders_failed",
      element: <Transport_ordersShipFAILED />,
    },

    // {
    //   path: "/don-vat-lieu",
    //   element: <MaterialOrder />,
    // },
    {
      path: "/production_plans",
      element: <ProductionPlans />,
    },
    {
      path: "/production_steps",
      element: <ProductionSteps />,
    },
    {
      path: "/product_instances",
      element: <ProductInstances />,
    },

    {
      path: "/equipment",
      element: <Equipment />,
    },

    // {
    //   path: "/bao-cao",
    //   element: <ReportAndStats />,
    // },
    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouterAdmin;
