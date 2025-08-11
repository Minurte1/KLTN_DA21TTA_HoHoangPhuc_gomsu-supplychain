import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BannerSlider = ({ items = [] }) => {
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
