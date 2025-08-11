import React from "react";
import BannerSlider from "../../components/section/bannerSlider";
import banner1 from "../../public/images/banner/banner1.jpg";
import banner2 from "../../public/images/banner/banner2.jpg";
import banner3 from "../../public/images/banner/banner3.jpg";

const MainPage = () => {
  const items = [
    {
      name: "Banner 1",
      image: banner1,
      title: "Nghệ Thuật Gốm Sứ Truyền Thống",
      description:
        "Khám phá vẻ đẹp tinh tế và giá trị văn hóa của gốm sứ Việt Nam qua từng đường nét thủ công.",
    },
    {
      name: "Banner 2",
      image: banner2,
      title: "Gốm Sứ Đương Đại",
      description:
        "Sự kết hợp hài hòa giữa truyền thống và hiện đại tạo nên những tác phẩm gốm sứ độc đáo và sáng tạo.",
    },
    {
      name: "Banner 3",
      image: banner3,
      // Không có title và description ở đây ví dụ
    },
  ];

  return (
    <>
      <h1>
        <BannerSlider items={items} />
      </h1>
    </>
  );
};

export default MainPage;
