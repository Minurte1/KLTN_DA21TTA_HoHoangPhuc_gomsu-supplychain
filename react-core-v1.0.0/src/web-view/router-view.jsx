import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import Login from "./page/login/login";
import ProductDetails from "./page/product-details";
import ThanhToan from "./page/thanhToan";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainPage />,
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
