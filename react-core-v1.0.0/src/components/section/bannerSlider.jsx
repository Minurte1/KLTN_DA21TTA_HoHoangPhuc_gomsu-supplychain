import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "../../public/images/banner/banner1.jpg";
import banner2 from "../../public/images/banner/banner2.jpg";
import banner3 from "../../public/images/banner/banner3.jpg";

const items = [
  { name: "Banner 1", image: banner1 },
  { name: "Banner 2", image: banner2 },
  { name: "Banner 3", image: banner3 },
];

const BannerSlider = () => {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {items.map((item, index) => (
        <div key={index}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default BannerSlider;
