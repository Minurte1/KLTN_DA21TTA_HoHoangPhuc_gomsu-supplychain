"use client";

import Footer from "../../components/footer";
import companyServices from "../../services/companies-service";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Grid,
  Typography,
  Box,
  Badge,
  Container,
} from "@mui/material";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  CheckCircle,
  Edit,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CompanyDetails() {
  const { ID_COMPANY } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const id = ID_COMPANY;
    if (!id) return;
    const response = await companyServices.getCompanyById(id);

    setCompany(response[0]);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "INACTIVE":
        return "Ngừng hoạt động";
      default:
        return status;
    }
  };
  const stylePadding = {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "8px",
    padding: "16px 0px",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Căn giữa theo chiều ngang
        width: "100%", // Đảm bảo full rộng
      }}
    >
      {" "}
      <div style={stylePadding}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          {/* Background Cover */}
          <Box position="relative" mb={8}>
            <Box
              sx={{
                height: 250,
                width: "100%",
                borderRadius: 2,
                backgroundImage: company?.BACKGROUND
                  ? `url(${company?.BACKGROUND})`
                  : "linear-gradient(to right, #3b82f6, #9333ea)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.3)",
                  borderRadius: 2,
                }}
              />
            </Box>

            {/* Company Avatar + Info */}
            <Box
              display="flex"
              alignItems="flex-end"
              gap={3}
              position="absolute"
              bottom={-64}
              left={32}
            >
              <Avatar
                src={company?.AVATAR || "/placeholder.svg"}
                alt={company?.NAME_COMPANY}
                sx={{
                  width: 128,
                  height: 128,
                  border: "4px solid white",
                  boxShadow: 3,
                }}
              >
                {/* {company?.NAME_COMPANY.charAt(0)} */}
              </Avatar>
              <Box pb={2}>
                <Box
                  sx={{
                    display: "inline-block",
                    bgcolor: "rgba(0,0,0,0.5)", // nền tối trong suốt
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h4" color="white" gutterBottom>
                    {company?.NAME_COMPANY}
                  </Typography>
                </Box>
              </Box>{" "}
            </Box>

            {/* Action Buttons */}
            {/* <Box position="absolute" top={16} right={16} display="flex" gap={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Share2 size={18} />}
          >
            Chia sẻ
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Edit size={18} />}
          >
            Chỉnh sửa
          </Button>
        </Box> */}
          </Box>

          {/* Main Content */}
          <Grid container spacing={3} mt={8}>
            {/* Left Column */}
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Thông tin liên hệ" />
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <MapPin size={20} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Địa chỉ
                      </Typography>
                      <Typography variant="body2">
                        {company?.DIA_CHI_STREETNAME}, {company?.DIA_CHI_Wards},{" "}
                        {company?.DIA_CHI_Districts},{" "}
                        {company?.DIA_CHI_Provinces}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Phone size={20} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Số điện thoại
                      </Typography>
                      <a
                        href={`tel:${company?.PHONE}`}
                        className="text-primary"
                      >
                        {company?.PHONE}
                      </a>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Mail size={20} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <a
                        href={`mailto:${company?.EMAIL}`}
                        className="text-primary"
                      >
                        {company?.EMAIL}
                      </a>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card className="mt-3">
                <CardHeader title="Thông tin thời gian" />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Ngày tạo
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(company?.CREATED_AT)}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    Cập nhật lần cuối
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(company?.UPDATED_AT)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardHeader title="Thông tin công ty" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        ID Công ty
                      </Typography>
                      <Typography variant="body2">
                        {company?.ID_COMPANY}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Loại công ty
                      </Typography>
                      <Typography variant="body2">
                        {company?.TYPE_COMPANY || "Chưa xác định"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Slug
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "grey.100",
                          px: 1,
                          borderRadius: 1,
                        }}
                      >
                        {company?.SLUG}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        ID Loại công ty
                      </Typography>
                      <Typography variant="body2">
                        {company?.ID_COMPANY_TYPE}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card className="mt-3">
                <CardHeader title="Mô tả công ty" />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {company?.NAME_COMPANY} là một công ty chuyên về vận chuyển
                    và logistics, cam kết mang đến dịch vụ chất lượng cao cho
                    khách hàng...
                  </Typography>
                </CardContent>
              </Card>

              <Card className="mt-3">
                <CardHeader title="Dịch vụ" />
                <CardContent>
                  <Grid container spacing={2}>
                    {[
                      "Vận chuyển nội địa",
                      "Vận chuyển quốc tế",
                      "Logistics",
                      "Kho bãi",
                    ].map((service, idx) => (
                      <Grid item xs={6} key={idx}>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          p={1}
                          sx={{ bgcolor: "primary.light", borderRadius: 1 }}
                        >
                          <CheckCircle size={20} color="blue" />
                          <Typography variant="body2">{service}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>{" "}
      </div>{" "}
      <div style={stylePadding}>
        {" "}
        <Footer />
      </div>
    </div>
  );
}
