// src/components/BannerSlider.jsx
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const items = [
  {
    name: "Banner 1",
    image: "/assets/banners/banner1.jpg",
  },
  {
    name: "Banner 2",
    image: "/assets/banners/banner2.jpg",
  },
];

const BannerSlider = () => {
  return (
    <Carousel indicators={true}>
      {items.map((item, index) => (
        <Paper key={index}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </Paper>
      ))}
    </Carousel>
  );
};

export default BannerSlider;
