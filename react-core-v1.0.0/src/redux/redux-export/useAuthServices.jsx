// src/hooks/useAuthState.js
import { useSelector } from "react-redux";

export default function useAuthState() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const totalCart = useSelector((state) => state.auth.totalCart);

  return {
    isAuthenticated,
    accessToken,
    userInfo,
    totalCart,
  };
}
