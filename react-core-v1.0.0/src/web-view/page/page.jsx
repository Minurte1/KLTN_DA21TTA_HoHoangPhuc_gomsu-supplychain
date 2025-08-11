import React from "react";
import BannerSlider from "../../components/section/bannerSlider";
import banner1 from "../../public/images/banner/banner1.jpg";
import banner2 from "../../public/images/banner/banner2.jpg";
import banner3 from "../../public/images/banner/banner3.jpg";

const MainPage = () => {
  const items = [
    { name: "Banner 1", image: banner1 },
    { name: "Banner 2", image: banner2 },
    { name: "Banner 3", image: banner3 },
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
