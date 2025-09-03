import React from "react";
import "../css-page/test-page.scss";

const SignIn = () => {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Đăng Nhập</h2>
        <p className="signin-subtitle">Nhập email và mật khẩu để đăng nhập!</p>

        <button className="signin-google">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Đăng nhập với Google
        </button>

        <div className="signin-divider">
          <span>hoặc</span>
        </div>

        <form className="signin-form">
          <label>Email*</label>
          <input type="email" placeholder="mail@simmmpel.com" />

          <label>Mật khẩu*</label>
          <input type="password" placeholder="Tối thiểu 8 ký tự" />

          <div className="signin-options">
            <label>
              <input type="checkbox" /> Giữ tôi luôn đăng nhập
            </label>
            <a href="/" className="forgot">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="signin-btn">
            Đăng Nhập
          </button>
        </form>

        <p className="signin-footer">
          Chưa có tài khoản? <a href="/">Tạo tài khoản</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
