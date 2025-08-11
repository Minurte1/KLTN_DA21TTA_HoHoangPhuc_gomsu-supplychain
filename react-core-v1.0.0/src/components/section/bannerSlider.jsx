import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BannerSlider = ({ items = [] }) => {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {items.map((item, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
          {/* Nếu có title hoặc description mới hiển thị phần overlay */}
          {(item.title || item.description) && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                background:
                  "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
                color: "white",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              {item.title && (
                <h3 style={{ margin: "0 0 8px 0" }}>{item.title}</h3>
              )}
              {item.description && (
                <p style={{ margin: 0 }}>{item.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </Carousel>
  );
};

export default BannerSlider;
