import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import Login from "./page/login/login";
import ProductDetails from "./page/product-details";
import ThanhToan from "./page/thanhToan";

import CompaniesPage from "./page/compoanies-page";
import CeramicPage from "./page/ceramic-page";
import ProductAllPage from "./page/product-all";

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
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
