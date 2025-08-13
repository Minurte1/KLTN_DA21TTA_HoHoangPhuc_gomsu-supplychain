import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import "./scss/companies.scss";
import companyServices from "../../services/companies-service";

export default function CompaniesLandingPage() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const data = await companyServices.getCompanies(null, "ACTIVE");
    setCompanies(data.DT || []);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const ceramicCompanies = companies.filter((c) => c.ID_COMPANY_TYPE === 3);
  const otherCompanies = companies.filter((c) => c.ID_COMPANY_TYPE !== 3);

  const getLogo = (avatar) => {
    if (!avatar || avatar.toLowerCase().includes("không")) {
      return "https://via.placeholder.com/150x150?text=Logo";
    }
    return avatar;
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Banner */}
      <div className="banner">
        <Typography variant="h3">CÁC CÔNG TY SẢN XUẤT GỐM SỨ</Typography>
      </div>

      {/* Công ty sản xuất gốm sứ */}
      <Container className="section">
        <Typography variant="h4" className="section-title">
          Doanh nghiệp nổi bật
        </Typography>
        <Grid container spacing={3}>
          {ceramicCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.ID_COMPANY}>
              <Card className="company-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={getLogo(company.AVATAR)}
                  alt={company.NAME_COMPANY}
                />
                <CardContent className="card-content">
                  <Typography variant="h6" className="company-name">
                    {company.NAME_COMPANY}
                  </Typography>
                  <Typography variant="body2" className="company-address">
                    {company.ADDRESS}
                  </Typography>
                  <Typography variant="body2" className="company-phone">
                    📞 {company.PHONE}
                  </Typography>
                  <Typography variant="body2" className="company-email">
                    ✉ {company.EMAIL}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Các công ty vận chuyển và cung cấp */}
      <Container className="section">
        <Typography variant="h5" className="section-title">
          Đối tác hợp tác
        </Typography>
        <Grid container spacing={3}>
          {otherCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.ID_COMPANY}>
              <Card className="company-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={getLogo(company.AVATAR)}
                  alt={company.NAME_COMPANY}
                />
                <CardContent className="card-content">
                  <Typography variant="h6" className="company-name">
                    {company.NAME_COMPANY}
                  </Typography>
                  <Typography variant="body2" className="company-address">
                    {company.ADDRESS}
                  </Typography>
                  <Typography variant="body2" className="company-phone">
                    📞 {company.PHONE}
                  </Typography>
                  <Typography variant="body2" className="company-email">
                    ✉ {company.EMAIL}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
