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
  const [selectCategory, setSelectCategory] = useState(null);

  useEffect(() => {
    fetchProductInstances();
    fetchCompanies();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (selectCategory) {
      fetchProductInstances(selectCategory);
    }
  }, [selectCategory]);

  // Hàm lấy danh sách product instances theo company
  const fetchProductInstances = async (category) => {
    const data = await productInstancesServices.getProductInstancesPublic({
      LIMIT: 1000000000,
      STATUS: "AVAILABLE",
      ID_CATEGORIES_: category ? category?.ID_CATEGORIES_ : null,
    });

    setProductInstances(data);
  };
  const fetchCompanies = async () => {
    const data = await companyServices.getCompanies(null, "ACTIVE", 3, [
      "categories",
    ]);
    setCompanies(data.DT || []);
  };

  return (
    <>
      <div className="page-container">
        <div className="sidebar">
          <h5>Danh mục công ty</h5>
          <ul>
            {companies.map((company) => (
              <>
                {company.categories.length > 0 && (
                  <li key={company.ID_COMPANY}>
                    <div style={{ fontWeight: "bold", cursor: "pointer" }}>
                      {company?.NAME_COMPANY}
                    </div>

                    {/* Chỉ render categories khi có dữ liệu và đang mở */}

                    <ul className="sub-menu">
                      {company.categories.map((cat) => (
                        <li
                          key={cat.ID_CATEGORIES_}
                          onClick={() => setSelectCategory(cat)}
                        >
                          {cat.NAME_CATEGORIES_}
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>

        {/* Nội dung sản phẩm */}
        <div className="content">
          <div style={styleBackground} className="list-product">
            <span style={styleHeading}>{selectCategory?.NAME_CATEGORIES_}</span>
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
