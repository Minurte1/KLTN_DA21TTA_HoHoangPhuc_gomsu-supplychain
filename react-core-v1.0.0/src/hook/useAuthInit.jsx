// src/hooks/useAuthInit.js
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { updateUser, setListPermission } from "../redux/authSlice";
import { getUserById } from "../services/userAccountService";
import spService from "../share-service/spService";

const useAuthInit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializeUser = useCallback(async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      console.warn("Không tìm thấy accessToken");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.ID_USERS;

      const latestUser = await getUserById(userId);

      if (latestUser && Object.keys(latestUser).length > 0) {
        dispatch(updateUser(latestUser));

        if (latestUser.LIST_PERMISION) {
          const listPermionssion = spService.parsePermissionList(
            latestUser.LIST_PERMISION
          );
          dispatch(setListPermission(listPermionssion));
        }
      } else {
        console.error("Không tìm thấy thông tin người dùng");
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo thông tin người dùng:", error);
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // ✅ vẫn chạy tự động khi component mount
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // ✅ return ra để có thể gọi lại khi cần (sau login)
  return initializeUser;
};

export default useAuthInit;
