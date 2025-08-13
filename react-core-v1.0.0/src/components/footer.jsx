import React from "react";
import styles from "./scss/footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Hỗ trợ khách hàng */}
      <div className={styles.section}>
        <h4 className={styles.title}>Hỗ trợ khách hàng</h4>
        <p className={styles.text}>
          Hotline: <strong>1900-6035</strong>
        </p>
        <p className={styles.text}>(1000 đ/phút, 8-21h kể cả T7, CN)</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Các câu hỏi thường gặp</li>
          <li className={styles.listItem}>Gửi yêu cầu hỗ trợ</li>
          <li className={styles.listItem}>Hướng dẫn đặt hàng</li>
          <li className={styles.listItem}>Phương thức vận chuyển</li>
          <li className={styles.listItem}>Chính sách kiểm hàng</li>
          <li className={styles.listItem}>Chính sách đổi trả</li>
          <li className={styles.listItem}>Hướng dẫn trả góp</li>
          <li className={styles.listItem}>Chính sách hàng nhập khẩu</li>
        </ul>
        <p className={styles.text}>
          Hỗ trợ khách hàng:{" "}
          <a href="mailto:hotro@gomsu.vn" className={styles.link}>
            hotro@gomsu.vn
          </a>
        </p>
        <p className={styles.text}>
          Báo lỗi bảo mật:{" "}
          <a href="mailto:security@gomsu.vn" className={styles.link}>
            security@gomsu.vn
          </a>
        </p>
      </div>

      {/* Về Gốm Sứ */}
      <div className={styles.section}>
        <h4 className={styles.title}>Về Gốm Sứ</h4>
        <ul className={styles.list}>
          <li className={styles.listItem}>Giới thiệu Gốm Sứ</li>
          <li className={styles.listItem}>Blog Gốm Sứ</li>
          <li className={styles.listItem}>Tuyển dụng</li>
          <li className={styles.listItem}>Chính sách bảo mật thanh toán</li>
          <li className={styles.listItem}>
            Chính sách bảo mật thông tin cá nhân
          </li>
          <li className={styles.listItem}>Chính sách giải quyết khiếu nại</li>
          <li className={styles.listItem}>Điều khoản sử dụng</li>
          <li className={styles.listItem}>Giới thiệu Gốm Sứ Xu</li>
          <li className={styles.listItem}>Tiếp thị liên kết cùng Gốm Sứ</li>
          <li className={styles.listItem}>Bán hàng doanh nghiệp</li>
          <li className={styles.listItem}>Điều kiện vận chuyển</li>
          <li className={styles.listItem}>Hợp tác và liên kết</li>
          <li className={styles.listItem}>Quy chế hoạt động Sàn GDTMĐT</li>
          <li className={styles.listItem}>Bán hàng cùng Gốm Sứ</li>
        </ul>
      </div>

      {/* Chứng nhận */}
      <div className={styles.section}>
        <h4 className={styles.title}>Chứng nhận bởi</h4>
        <ul className={styles.list}>
          <li className={styles.listItem}>Bộ Công Thương</li>
          <li className={styles.listItem}>DMCA.com Protection Status</li>
        </ul>
        <h4 className={styles.title}>Phương thức thanh toán</h4>
        <h4 className={styles.title}>Dịch vụ giao hàng</h4>
        <h4 className={styles.title}>Kết nối với chúng tôi</h4>
        <h4 className={styles.title}>Tải ứng dụng trên điện thoại</h4>
        <p className={styles.text}>Công ty TNHH Gốm Sứ Truyền Thống</p>
        <address className={styles.address}>
          Tòa nhà số 52 đường Gốm Sứ, Phường 4, Quận Tân Bình, Thành phố Hồ Chí
          Minh
        </address>
        <p className={styles.text}>
          Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và
          Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.
        </p>
        <p className={styles.text}>Hotline: 1900 6035</p>
      </div>
    </footer>
  );
};

export default Footer;
