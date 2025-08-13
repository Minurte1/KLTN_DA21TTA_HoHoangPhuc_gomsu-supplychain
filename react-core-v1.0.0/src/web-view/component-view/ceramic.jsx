import React from "react";
import "./scss/ceramic.scss";
import ceramic2 from "../../public/images/ceramic/ceramic2.jpg";

import ceramic3 from "../../public/images/ceramic/ceramic3.jpg";

const CeramicLanding = () => {
  return (
    <div className="ceramic-landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Văn Hóa Gốm Sứ Việt Nam</h1>
          <p>
            Khám phá hành trình hơn nghìn năm của nghệ thuật gốm sứ, từ những
            bàn tay khéo léo đến những tác phẩm tinh xảo.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="history">
        <h2>Nguồn Gốc & Sự Ra Đời</h2>
        <div className="history-content">
          <div className="text">
            <p>
              Gốm sứ là kết quả của sự kết hợp giữa đất, nước và lửa, hình thành
              từ những làng nghề truyền thống. Nghệ thuật gốm sứ không chỉ phục
              vụ nhu cầu sử dụng mà còn là biểu tượng văn hóa, lưu giữ giá trị
              lịch sử và tinh thần sáng tạo của con người.
            </p>
          </div>
          <div className="images">
            <img src={ceramic3} alt="Gốm sứ cổ" />
            <img src={ceramic2} alt="Nghệ nhân làm gốm" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CeramicLanding;
