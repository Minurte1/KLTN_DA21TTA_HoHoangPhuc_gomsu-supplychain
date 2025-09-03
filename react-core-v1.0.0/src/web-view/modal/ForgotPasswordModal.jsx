import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../css-page/forgotPasswordModal.scss";
import { sendOtpEmail } from "../../services/userAccountService";
import { enqueueSnackbar } from "notistack";

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

  const handleResetPassword = () => {
    if (!otp || !newPassword) {
      return enqueueSnackbar("Vui lòng nhập đầy đủ OTP và mật khẩu mới!", {
        variant: "info",
      });
    }
    // TODO: gọi API xác thực OTP và đổi mật khẩu
    console.log("Xác thực OTP:", otp, "Đổi mật khẩu:", newPassword);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="forgot-title">
        Quên mật khẩu
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="forgot-close"
        >
          <CloseIcon />
        </IconButton>
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
