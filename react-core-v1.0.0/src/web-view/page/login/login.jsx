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

const Login = () => {
  const api = process.env.REACT_APP_URL_SERVER;
  const initUser = useAuthInit();

  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");

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
      // Kiểm tra email và mật khẩu
      if (!email || !password) {
        enqueueSnackbar("Email và mật khẩu không được để trống");
        return;
      }

      // Reset thông báo lỗi
      enqueueSnackbar("");

      // Gọi API đăng nhập
      const response = await axios.post(`${api}/login`, { email, password });
      const { EC, DT, EM } = response.data;

      if (EC === 1) {
        // Đăng nhập thành công
        Cookies.set("accessToken", response.data.DT.accessToken, {
          expires: 7,
        });
        initUser();
        // Chuyển hướng sang trang dashboard hoặc trang khác
        navigate("/");
      } else {
        // Hiển thị lỗi từ API
        enqueueSnackbar(EM);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error("Login error:", error);
      enqueueSnackbar(error.response.data.EM, { variant: "info" });
    }
  };
  return (
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập
        </Typography>

        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email người dùng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleLogin()}
            sx={{ mt: 2 }}
          >
            Đăng nhập
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>hoặc</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => loginGoogle()}
        >
          Đăng nhập với Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Chưa có tài khoản?{" "}
          <a href="#" className="register-link">
            Đăng ký
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
