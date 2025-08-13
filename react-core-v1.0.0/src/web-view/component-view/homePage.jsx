import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../component-view/scss/home.scss";

// Import hình ảnh
import chuNhat1 from "../../public/images/home/chu-nhat-1.jpg";
import chuNhat2 from "../../public/images/home/chu-nhat-2.jpg";
import ngang1 from "../../public/images/home/ngang-1.jpeg";
import ngang2 from "../../public/images/home/ngang-2.png";
import vuong1 from "../../public/images/home/vuong-1.png";
import vuong2 from "../../public/images/home/vuong-2.png";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, // thời gian animation
      once: true, // chỉ chạy 1 lần khi cuộn
      offset: 100, // khoảng cách trigger
    });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" data-aos="fade-up">
        <div className="hero-content">
          <h1 data-aos="fade-up" data-aos-delay="200">
            Gốm Sứ Truyền Thống Việt Nam
          </h1>
          <p data-aos="fade-up" data-aos-delay="400">
            Lưu giữ tinh hoa – Kết nối văn hóa
          </p>
          <a
            href="/san-pham"
            className="btn-primary"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Khám phá ngay
          </a>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="about">
        <div className="about-text" data-aos="fade-right" data-aos-delay="200">
          <h2>Về Chúng Tôi</h2>
          <p>
            Gốm sứ Việt Nam mang trong mình vẻ đẹp tinh tế, được tạo nên từ bàn
            tay khéo léo của nghệ nhân. Mỗi sản phẩm là một câu chuyện, một phần
            di sản văn hóa truyền thống.
          </p>
        </div>
        <div className="about-image" data-aos="fade-left" data-aos-delay="400">
          <img src={chuNhat2} alt="Giới thiệu Gốm Sứ" />
        </div>
      </section>

      {/* Bộ sưu tập */}
      <section className="collection">
        <h2 data-aos="fade-up">Bộ Sưu Tập Nổi Bật</h2>
        <div className="gallery">
          {[vuong1, vuong2, chuNhat1].map((img, i) => (
            <div
              key={i}
              className="gallery-item"
              data-aos="zoom-in"
              data-aos-delay={200 * (i + 1)}
            >
              <img src={img} alt={`Sản phẩm ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Văn hóa */}
      <section className="culture">
        <div
          className="culture-image"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <img src={ngang1} alt="Văn hóa gốm sứ" />
        </div>
        <div className="culture-text" data-aos="fade-left" data-aos-delay="400">
          <h2>Văn Hóa & Nguồn Gốc</h2>
          <p>
            Nghề gốm đã có từ hàng ngàn năm trước, là biểu tượng của sự sáng tạo
            và bền bỉ. Gốm sứ không chỉ là vật dụng mà còn là tác phẩm nghệ
            thuật chứa đựng tâm hồn Việt.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" data-aos="fade-up" data-aos-delay="200">
        <h2>Khám phá ngay bộ sưu tập mới nhất</h2>
        <a
          href="/san-pham"
          className="btn-primary"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Mua ngay
        </a>
      </section>
    </div>
  );
};

export default Home;
