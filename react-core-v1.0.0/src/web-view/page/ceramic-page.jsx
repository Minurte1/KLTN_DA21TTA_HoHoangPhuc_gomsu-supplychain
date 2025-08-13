import React, { useEffect, useState } from "react";

import Footer from "../../components/footer";

import CeramicLanding from "../component-view/ceramic";

const CeramicPage = () => {
  const stylePadding = {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "8px",
    padding: "16px 0px",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Căn giữa theo chiều ngang
          width: "100%", // Đảm bảo full rộng
        }}
      >
        {" "}
        <CeramicLanding />{" "}
        <div style={stylePadding}>
          {" "}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CeramicPage;
