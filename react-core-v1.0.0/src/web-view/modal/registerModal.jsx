import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../css-page/registerModal.scss";

const RegisterModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }
    if (password !== confirmPassword) {
      return alert("Mật khẩu nhập lại không khớp!");
    }
    // TODO: gọi API đăng ký tài khoản
    console.log("Đăng ký:", { fullName, email, password });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="register-title">
        Tạo tài khoản
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="register-close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
