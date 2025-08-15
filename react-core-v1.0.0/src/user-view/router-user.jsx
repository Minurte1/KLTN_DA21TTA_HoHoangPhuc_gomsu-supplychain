import { useRoutes, Navigate } from "react-router-dom";

import ProfileUsers from "./pages/page";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <ProfileUsers />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
