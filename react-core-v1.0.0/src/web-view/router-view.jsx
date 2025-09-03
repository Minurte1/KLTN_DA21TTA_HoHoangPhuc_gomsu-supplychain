import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import Login from "./page/login/login";
import ProductDetails from "./page/product-details";
import ThanhToan from "./page/thanhToan";

import CompaniesPage from "./page/compoanies-page";
import CeramicPage from "./page/ceramic-page";
import ProductAllPage from "./page/product-all";
import CompanyDetails from "./page/companies-details-page";
import SignIn from "./page/test-page";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainPage />,
    },
    {
      path: "/companies",
      element: <CompaniesPage />,
    },
    {
      path: "/companies-details/:ID_COMPANY",
      element: <CompanyDetails />,
    },
    {
      path: "/san-pham",
      element: <ProductAllPage />,
    },
    {
      path: "/van-hoa-nguon-goc",
      element: <CeramicPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/product-details/:serialCode",
      element: <ProductDetails />,
    },
    {
      path: "/thanh-toan",
      element: <ThanhToan />,
    },
    {
      path: "/test",
      element: <SignIn />,
    },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
