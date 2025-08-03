import { useRoutes, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/DashboardAdmin";
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

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardAdmin />,
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
    // {
    //   path: "/admin/don-vat-lieu",
    //   element: <MaterialOrder />,
    // },
    // {
    //   path: "/admin/ke-hoach-san-xuat",
    //   element: <ProductionPlanList />,
    // },
    // {
    //   path: "/admin/buoc-san-xuat",
    //   element: <ProductionStep />,
    // },
    // {
    //   path: "/admin/kiem-tra-chat-luong",
    //   element: <QualityControl />,
    // },
    // {
    //   path: "/admin/thiet-bi",
    //   element: <Equipment />,
    // },

    // {
    //   path: "/admin/bao-cao",
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
