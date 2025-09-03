import React from "react";
import { Grid, Typography, Card, CardContent, Button } from "@mui/material";
import {
  Language,
  Business,
  LocalShipping,
  AutoAwesome,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import "../scss/welcomeAdmin.scss";

const WelcomeAdmin = () => {
  const features = [
    {
      icon: <Business fontSize="large" color="primary" />,
      title: "Kết Nối Doanh Nghiệp",
      desc: "Tạo ra hệ sinh thái chung cho các công ty cung cấp vật liệu, sản xuất và vận chuyển gốm sứ.",
    },
    {
      icon: <LocalShipping fontSize="large" color="success" />,
      title: "Chuỗi Cung Ứng Đồng Bộ",
      desc: "Đồng bộ dữ liệu và luồng thông tin xuyên suốt, từ nguyên liệu đầu vào đến khi sản phẩm đến tay khách hàng.",
    },
    {
      icon: <Language fontSize="large" color="secondary" />,
      title: "Môi Trường Toàn Diện",
      desc: "Một nền tảng mở, nơi tất cả bên liên quan có thể giao tiếp, quản lý và phát triển cùng nhau.",
    },
    {
      icon: <AutoAwesome fontSize="large" color="warning" />,
      title: "Đổi Mới & Phát Triển",
      desc: "Tận dụng công nghệ để thúc đẩy ngành gốm sứ truyền thống tiến xa hơn, hiện đại hóa và bền vững.",
    },
  ];

  return (
    <div className="welcome-admin">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="welcome-header"
      >
        <Typography variant="h4" align="center" gutterBottom>
          🏺 Chào mừng trở lại!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          <strong>Nền Tảng Quản lý Chuỗi Cung Ứng Gốm Sứ</strong> – không chỉ là
          công cụ quản lý, mà còn là môi trường kết nối giữa{" "}
          <em>công ty cung cấp vật liệu gốm sứ</em>,
          <em>công ty sản xuất gốm sứ</em> và
          <em>công ty vận chuyển gốm sứ</em>. Một không gian số hóa nơi mọi hoạt
          động trở nên minh bạch, hiệu quả và bền vững.
        </Typography>
      </motion.div>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        className="welcome-features"
      >
        {features.map((f, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="welcome-card">
                <CardContent className="welcome-card-content">
                  {f.icon}
                  <Typography variant="h6" className="mt-2">
                    {f.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mt-1"
                  >
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <div className="welcome-footer">
        <button className="custom-outline-btn-cancel">Khám Phá Ngay</button>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
