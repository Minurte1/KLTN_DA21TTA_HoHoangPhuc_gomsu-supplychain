// src/hooks/useAuthInit.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { updateUser, setListPermission } from "../redux/authSlice"; // sửa lại path
import { getUserById } from "../services/userAccountService";
import spService from "../share-service/spService";

const useAuthInit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get("accessToken");

      if (!token) {
        console.warn("Không tìm thấy accessToken");
        return;
      }

      try {
        // 1. Decode token để lấy ID_USERS
        const decoded = jwtDecode(token);
        const userId = decoded.ID_USERS;

        // 2. Gọi API để lấy user info mới nhất
        const latestUser = await getUserById(userId);

        if (latestUser && Object.keys(latestUser).length > 0) {
          // 3. Lưu thông tin user vào Redux
          dispatch(updateUser(latestUser));
          console.log("latestUser", latestUser);
          // 4. Lưu LIST_PERMISION nếu có
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
    };

    initializeUser();
  }, [dispatch, navigate]);
};

export default useAuthInit;
