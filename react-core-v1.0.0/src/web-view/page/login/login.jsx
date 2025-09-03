import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import "../../css-page/login.scss";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

// import { login, setUserInfo } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import Footer from "../../../components/footer";
import useAuthInit from "../../../hook/useAuthInit";
import ForgotPasswordModal from "../../modal/ForgotPasswordModal";

const Login = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const initUser = useAuthInit();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isOpenForgetPassword, setIsOpenForgetPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //   setTokenGoogle(tokenResponse.access_token);

      // Lấy thông tin người dùng từ Google API
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        setUser(userInfo.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_URL_SERVER}/login/google`,
            { email: user.email, HO_TEN: user.name }
          );

          if (response.data.EC === 200) {
            localStorage.setItem("THEMES", response.data.DT.userInfo.THEMES);
            Cookies.remove("accessToken");
            const accessToken = response.data.DT.accessToken;
            Cookies.set("accessToken", accessToken, { expires: 7 });
            sessionStorage.setItem("userPicture", user.picture);

            enqueueSnackbar(response.data.EM, { variant: "success" });
            initUser();
            navigate("/");
          } else {
            enqueueSnackbar(response.data.EM, { variant: "info" });
          }
        } catch (error) {
          console.error("Đã xảy ra lỗi:", error);

          enqueueSnackbar(error.response.data.EM, { variant: "info" });
        }
      };

      fetchData();
    }
  }, [user, navigate, dispatch]);

  const handleLogin = async () => {
    try {
      // Kiểm tra email rỗng
      if (!email.trim()) {
        enqueueSnackbar("Vui lòng nhập email", { variant: "warning" });
        return;
      }

      // Regex kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        enqueueSnackbar("Email không hợp lệ", { variant: "warning" });
        return;
      }

      // Kiểm tra mật khẩu rỗng
      if (!password.trim()) {
        enqueueSnackbar("Vui lòng nhập mật khẩu", { variant: "warning" });
        return;
      }

      // Mật khẩu tối thiểu 8 ký tự
      if (password.length < 8) {
        enqueueSnackbar("Mật khẩu phải có ít nhất 8 ký tự", {
          variant: "warning",
        });
        return;
      }

      // Gọi API đăng nhập
      const response = await axios.post(`${api}/login`, { email, password });
      const { EC, DT, EM } = response.data;

      if (EC === 1) {
        Cookies.set("accessToken", DT.accessToken, { expires: 7 });
        initUser();
        navigate("/");
      } else {
        enqueueSnackbar(EM, { variant: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      enqueueSnackbar(
        error?.response?.data?.EM || "Đã xảy ra lỗi, vui lòng thử lại",
        { variant: "error" }
      );
    }
  };

  return (
    <>
      {" "}
      <div className="signin-container">
        <div className="signin-box">
          <h2 className="signin-title">Đăng Nhập</h2>
          <p className="signin-subtitle">
            Nhập email và mật khẩu để đăng nhập!
          </p>

          <button className="signin-google" onClick={() => loginGoogle()}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Đăng nhập với Google
          </button>

          <div className="signin-divider">
            <span>hoặc</span>
          </div>

          {/* Thay form bằng div */}
          <div className="signin-form">
            <label>Email*</label>
            <input
              type="email"
              placeholder="nguyenvana@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Mật khẩu*</label>
            <input
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="signin-options">
              <span
                className="forgot"
                onClick={() => setIsOpenForgetPassword(true)}
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* Gọi handleLogin trực tiếp */}
            <button
              type="button"
              className="signin-btn"
              onClick={() => handleLogin()}
            >
              Đăng Nhập
            </button>
          </div>

          <p className="signin-footer">
            Chưa có tài khoản? <a href="/">Tạo tài khoản</a>
          </p>
        </div>
      </div>
      <ForgotPasswordModal
        open={isOpenForgetPassword}
        onClose={() => setIsOpenForgetPassword(false)}
      />
    </>
  );
};

export default Login;
