import React from "react";
import styles from "./scss/footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.support}>
        <h4>Hỗ trợ khách hàng</h4>
        <p>
          Hotline: <strong>1900-6035</strong>
        </p>
        <p>(1000 đ/phút, 8-21h kể cả T7, CN)</p>
        <ul>
          <li>Các câu hỏi thường gặp</li>
          <li>Gửi yêu cầu hỗ trợ</li>
          <li>Hướng dẫn đặt hàng</li>
          <li>Phương thức vận chuyển</li>
          <li>Chính sách kiểm hàng</li>
          <li>Chính sách đổi trả</li>
          <li>Hướng dẫn trả góp</li>
          <li>Chính sách hàng nhập khẩu</li>
        </ul>
        <p>
          Hỗ trợ khách hàng: <a href="mailto:hotro@tiki.vn">hotro@tiki.vn</a>
        </p>
        <p>
          Báo lỗi bảo mật:{" "}
          <a href="mailto:security@tiki.vn">security@tiki.vn</a>
        </p>
      </div>

      <div className={styles.about}>
        <h4>Về Tiki</h4>
        <ul>
          <li>Giới thiệu Tiki</li>
          <li>Tiki Blog</li>
          <li>Tuyển dụng</li>
          <li>Chính sách bảo mật thanh toán</li>
          <li>Chính sách bảo mật thông tin cá nhân</li>
          <li>Chính sách giải quyết khiếu nại</li>
          <li>Điều khoản sử dụng</li>
          <li>Giới thiệu Tiki Xu</li>
          <li>Tiếp thị liên kết cùng Tiki</li>
          <li>Bán hàng doanh nghiệp</li>
          <li>Điều kiện vận chuyển</li>
          <li>Hợp tác và liên kết</li>
          <li>Quy chế hoạt động Sàn GDTMĐT</li>
          <li>Bán hàng cùng Tiki</li>
        </ul>
      </div>

      <div className={styles.certify}>
        <h4>Chứng nhận bởi</h4>
        <ul>
          <li>bo-cong-thuong-2</li>
          <li>bo-cong-thuong</li>
          <li>DMCA.com Protection Status</li>
        </ul>
        <h4>Phương thức thanh toán</h4>
        <h4>Dịch vụ giao hàng</h4>
        <h4>Kết nối với chúng tôi</h4>
        <h4>Tải ứng dụng trên điện thoại</h4>
        <p>Công ty TNHH TI KI</p>
        <address>
          Tòa nhà số 52 đường Út Tịch, Phường 4, Quận Tân Bình, Thành phố Hồ Chí
          Minh
        </address>
        <p>
          Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và
          Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.
        </p>
        <p>Hotline: 1900 6035</p>
      </div>
    </footer>
  );
};

export default Footer;
