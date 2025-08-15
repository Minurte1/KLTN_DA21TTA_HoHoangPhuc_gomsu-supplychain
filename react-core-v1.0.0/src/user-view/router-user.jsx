import { useRoutes, Navigate } from "react-router-dom";
import ProfileUsers from "./pages/profile-page";
import OrdersUsers from "./pages/orders-page";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <ProfileUsers />,
    },
    {
      path: "/orders",
      element: <OrdersUsers />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
