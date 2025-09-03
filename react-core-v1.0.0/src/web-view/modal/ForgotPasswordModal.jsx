import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../css-page/forgotPasswordModal.scss";
import {
  resetPasswordWithOtpEmail,
  sendOtpEmail,
} from "../../services/userAccountService";
import { enqueueSnackbar } from "notistack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1 = nhập email, 2 = nhập OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = async () => {
    if (!email)
      return enqueueSnackbar("Vui lòng nhập email!", { variant: "info" });
    const response = await sendOtpEmail(email);
    if (response.EC === 200) {
      setStep(2);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      return enqueueSnackbar("Vui lòng nhập đầy đủ OTP và mật khẩu mới!", {
        variant: "info",
      });
    } // Mật khẩu tối thiểu 8 ký tự
    if (newPassword.length < 8) {
      enqueueSnackbar("Mật khẩu phải có ít nhất 8 ký tự", {
        variant: "warning",
      });
      return;
    }
    const response = await resetPasswordWithOtpEmail(email, otp, newPassword);
    if (response.EC === 200) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 5, // chừa khoảng cho nút đóng
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {step === 2 && (
            <IconButton
              aria-label="back"
              onClick={() => setStep(1)}
              size="small"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <span>Quên mật khẩu</span>
        </Box>

        {/* <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton> */}
      </DialogTitle>

      <DialogContent>
        {step === 1 && (
          <>
            <p className="forgot-subtitle">
              Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
            </p>
            <div className="forgot-form">
              <label>Email*</label>
              <input
                type="email"
                placeholder="nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="forgot-hint">
                Mã OTP sẽ được tự động gửi vào Gmail của bạn.
              </small>
              <button className="forgot-btn" onClick={handleSendOtp}>
                Gửi OTP
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="forgot-subtitle">
              Nhập mã OTP đã gửi đến <b>{email}</b> và mật khẩu mới.
            </p>
            <div className="forgot-form">
              <label>Mã OTP*</label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <small className="forgot-hint">
                Vui lòng kiểm tra cả hộp thư rác (Spam/Junk).
              </small>

              <label>Mật khẩu mới*</label>
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <small className="forgot-hint">
                Mật khẩu phải có ít nhất 8 ký tự, nên bao gồm chữ hoa, chữ
                thường và số.
              </small>

              <button className="forgot-btn" onClick={handleResetPassword}>
                Đặt lại mật khẩu
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
