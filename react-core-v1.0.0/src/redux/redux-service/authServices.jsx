// src/redux/services/authService.js
import { store } from "../../redux-config/store";
import { login, logout, setUserInfo, setTotalCart } from "../authSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const authService = {
  // Đăng nhập
  login: (accessToken) => {
    const userInfo = jwtDecode(accessToken);
    store.dispatch(login({ accessToken, userInfo }));
  },

  // Đăng xuất
  logout: () => {
    store.dispatch(logout());
  },

  // Cập nhật userInfo
  updateUserInfo: (userInfo) => {
    store.dispatch(setUserInfo(userInfo));
  },

  // Cập nhật tổng tiền giỏ hàng
  updateTotalCart: (total) => {
    store.dispatch(setTotalCart(total));
  },

  // Lấy lại state hiện tại nếu cần dùng ngoài React
  getUserInfo: () => {
    return store.getState().auth?.userInfo;
  },
};

export default authService;
