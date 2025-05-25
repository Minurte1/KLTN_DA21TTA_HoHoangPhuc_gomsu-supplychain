import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReduxExportUseAuthState from "../redux/redux-export/useAuthServices";

const getRouterKey = (router) => {
  if (!router) return "";
  const match = router.match(/^\/admin\/([^/]+)/);
  return match?.[1] || router;
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { listPermission } = ReduxExportUseAuthState();

  const [isReady, setIsReady] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  console.log("PrivateRoute");
  useEffect(() => {
    if (!currentPath || !listPermission) return;

    setIsReady(false);
    setIsAllowed(false);

    try {
      // Nếu là SYSTEM thì cho phép tất cả

      const listPermissionProcess = listPermission || [];
      const routerKey = getRouterKey(currentPath).toLowerCase();

      // Chỉ cho phép nếu có quyền "view" trong actions
      const hasPermission = listPermissionProcess.some(
        (perm) =>
          perm.router.toLowerCase() === routerKey &&
          perm.actions.includes("view")
      );

      setIsAllowed(hasPermission);
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
