import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import reduxStateExport from "../core/redux/redux-share/state-export/redux-state";

// const getRouterKey = (routerPath) => {
//   if (!routerPath) return "";
//   const match = routerPath.match(/^\/?admin\/(.+)/);
//   return match?.[1] || routerPath.replace(/^\/+/, "");
// };

const getRouterKey = (router) => {
  if (!router) return "";
  const match = router.match(/^\/admin\/([^/]+)/);
  return match?.[1] || router;
};
const PrivateRoute = ({ path, children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { listPermission } = reduxStateExport();

  const [isReady, setIsReady] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  // console.log("listPermission", listPermission);
  useEffect(() => {
    if (!currentPath || !listPermission?.status) return;

    // Reset mỗi lần currentPath đổi
    setIsReady(false);
    setIsAllowed(false);

    try {
      const role = listPermission?.value?.role;

      if (listPermission?.value === "SYSTEM") {
        // Cho qua tất cả nếu là SYSTEM
        setIsAllowed(true);
        setIsReady(true);
        return;
      }

      let listPermissionProcess = listPermission?.value?.listPermistions;

      const allowRouters = listPermissionProcess.flatMap((item) => {
        if (item.router === "blog") {
          return ["blog", "blog-approve"];
        }
        return [item.router];
      });
      const routerKey = getRouterKey(currentPath);

      const allowed = allowRouters
        .map((r) => r.toLowerCase())
        .includes(routerKey.toLowerCase());

      setIsAllowed(allowed);
    } catch (e) {
      console.error("Không thể parse listPermission", e);
      setIsAllowed(false);
    } finally {
      setIsReady(true);
    }
  }, [currentPath, listPermission]);

  if (!isReady) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Đang tải quyền truy cập...
      </div>
    );
  }

  return isAllowed ? children : <Navigate to="/admin/users" replace />;
};

export default PrivateRoute;
