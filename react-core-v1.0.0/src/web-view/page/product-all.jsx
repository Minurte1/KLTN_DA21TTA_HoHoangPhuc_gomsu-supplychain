import React, { useEffect, useState } from "react";
import BannerSlider from "../../components/section/bannerSlider";
import banner1 from "../../public/images/banner/banner1.jpg";
import banner2 from "../../public/images/banner/banner2.jpg";
import banner3 from "../../public/images/banner/banner3.jpg";
import productInstancesServices from "../../services/product_instancesServices";
import ProductList from "../../components/productList";
import Footer from "../../components/footer";
import Home from "../component-view/homePage";
import {
  styleBackground,
  styleHeading,
  stylePadding,
} from "../../share-service/spStyle";
import "../css-page/product-all.scss";
import companyServices from "../../services/companies-service";
import categoryServices from "../../services/categoryServices";
const ProductAllPage = () => {
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

  const [productInstances, setProductInstances] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectCompanies, setSelectCompanies] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    fetchProductInstances();
    fetchCompanies();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (selectCompanies) {
      fetchCategories(selectCompanies);
    }
  }, [selectCompanies]);

  // Hàm lấy danh sách product instances theo company
  const fetchProductInstances = async () => {
    const data = await productInstancesServices.getProductInstancesPublic({
      LIMIT: 1000000000,
      STATUS: "AVAILABLE",
    });

    setProductInstances(data);
  };
  const fetchCompanies = async () => {
    const data = await companyServices.getCompanies(null, "ACTIVE", 3);
    setCompanies(data.DT || []);
  };

  const fetchCategories = async (company) => {
    try {
      if (!company) return;
      const companyId = company.ID_COMPANY || null;
      const data = await categoryServices.getCategories({
        ID_COMPANY: companyId,
      });
      setCategoryOptions(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const [openCompanyId, setOpenCompanyId] = useState(null);
  const handleToggleCompany = (companyId) => {
    setOpenCompanyId((prev) => (prev === companyId ? null : companyId));
  };

  return (
    <>
      <div className="page-container">
        <div className="sidebar">
          <ul>
            <h5>Danh mục công ty</h5>
            {companies.map((company) => (
              <li key={company.ID_COMPANY}>
                <div
                  onClick={() => {
                    setSelectCompanies(company);
                    handleToggleCompany(company?.ID_COMPANY);
                  }}
                  style={{ fontWeight: "bold" }}
                >
                  {company?.NAME_COMPANY}
                </div>

                {/* Nếu công ty này đang mở thì show danh mục con */}
                {openCompanyId === company.ID_COMPANY && (
                  <ul className="sub-menu">
                    {categoryOptions?.map((cat) => (
                      <li key={cat.ID_CATEGORIES_}>{cat.NAME_CATEGORIES_}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Nội dung sản phẩm */}
        <div className="content">
          <div style={styleBackground}>
            <ProductList products={productInstances} rows={20} />
          </div>
          <BannerSlider items={items} />
          <div style={stylePadding}>
            {" "}
            <Footer />
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default ProductAllPage;
