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

    // {
    //   path: "/admin/don-hang/tat-ca",
    //   element: <OrderList />,
    // },
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
