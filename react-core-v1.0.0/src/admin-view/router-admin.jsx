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

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <DashboardAdmin />,
    },
    {
      path: "/phan-quyen",
      element: <Role />,
    },
    {
      path: "/admin/cong-ty",
      element: <Company />,
    },
    {
      path: "/admin/loai-cong-ty",
      element: <CompanyType />,
    },
    {
      path: "/admin/nguoi-dung",
      element: <User />,
    },
    {
      path: "/admin/san-pham",
      element: <Product />,
    },
    {
      path: "/admin/san-pham/danh-muc",
      element: <Category />,
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
      path: "/admin/loai-vat-lieu",
      element: <MaterialType />,
    },
    {
      path: "/admin/vat-lieu",
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
    {
      path: "/admin/nha-cung-cap",
      element: <Supplier />,
    },
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
