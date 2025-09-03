import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "../css-page/registerModal.scss";
import { enqueueSnackbar } from "notistack";
import {
  checkOtpEmail,
  registerUser,
  sendOtpEmail,
} from "../../services/userAccountService";

const RegisterModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: Gửi thông tin đăng ký
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      enqueueSnackbar("Vui lòng nhập đầy đủ thông tin!", {
        variant: "warning",
      });
      return;
    }
    // Mật khẩu tối thiểu 8 ký tự
    if (password.length < 8) {
      enqueueSnackbar("Mật khẩu phải có ít nhất 8 ký tự", {
        variant: "warning",
      });
      return;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Mật khẩu nhập lại không khớp!", { variant: "error" });
      return;
    }

    try {
      await sendOtpEmail(email);
      enqueueSnackbar("Mã OTP đã được gửi tới email của bạn", {
        variant: "success",
      });
      setStep(2); // chuyển qua step OTP
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      enqueueSnackbar("Có lỗi xảy ra khi đăng ký!", { variant: "error" });
    }
  };

  // Step 2: Xác thực OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      enqueueSnackbar("Vui lòng nhập mã OTP!", { variant: "warning" });
      return;
    }

    try {
      const response = await checkOtpEmail(email, otp);
      if (response?.EC === 200) {
        const register = await registerUser(
          fullName,
          email,
          password,
          confirmPassword
        );
        onClose();
        setStep(1); // reset step
      } else {
        enqueueSnackbar(response?.EM, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      enqueueSnackbar("OTP không đúng hoặc đã hết hạn!", { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        className="register-title"
        sx={{ position: "relative", pl: 6 }}
      >
        {step === 2 && (
          <IconButton
            aria-label="back"
            onClick={() => setStep(1)}
            sx={{ position: "absolute", left: 8, top: 8 }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: "14px" }} />
          </IconButton>
        )}
        {step === 1 ? "Tạo tài khoản" : "Xác thực OTP"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="register-close"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {step === 1 ? (
          <>
            <p className="register-subtitle">
              Điền đầy đủ thông tin để đăng ký tài khoản mới.
            </p>
            <div className="register-form">
              <label>Họ và tên*</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label>Email*</label>
              <input
                type="email"
                placeholder="nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="register-hint">
                Email sẽ dùng để đăng nhập và nhận thông báo.
              </small>

              <label>Mật khẩu*</label>
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>Nhập lại mật khẩu*</label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="register-btn" onClick={handleRegister}>
                Đăng ký
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="register-subtitle">
              Vui lòng nhập mã OTP đã được gửi tới email <b>{email}</b>.
            </p>
            <div className="register-form">
              <label>Mã OTP*</label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="register-btn" onClick={handleVerifyOtp}>
                Xác nhận
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
