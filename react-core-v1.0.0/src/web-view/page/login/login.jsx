import React, { useState } from "react";
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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      alert("Đăng nhập thành công!");
    } else {
      setError("Tên người dùng hoặc mật khẩu không đúng.");
    }
  };

  const handleGoogleLogin = () => {
    alert("Đăng nhập bằng Google (demo)");
  };

  return (
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" align="center" gutterBottom>
          Đăng nhập
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleGoogleLogin}
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
}

export default Login;
