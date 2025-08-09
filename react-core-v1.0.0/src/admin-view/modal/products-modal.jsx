import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import categoryServices from "../../services/categoryServices"; // giả sử service lấy danh mục sản phẩm
import companyServices from "../../services/companies-service";
import productServices from "../../services/productServices"; // service api cho products
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const ProductsFormModal = ({ open, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_CATEGORIES_: "",
    NAME_PRODUCTS: "",
    DESCRIPTION_PRODUCTS: "",
    PRICE_PRODUCTS: "",
    STOCK_PRODUCTS: "",
    IMAGE_URL_PRODUCTS: "",
    ID_COMPANY: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        product
          ? {
              ID_CATEGORIES_: product.ID_CATEGORIES_ || "",
              NAME_PRODUCTS: product.NAME_PRODUCTS || "",
              DESCRIPTION_PRODUCTS: product.DESCRIPTION_PRODUCTS || "",
              PRICE_PRODUCTS: product.PRICE_PRODUCTS || "",
              STOCK_PRODUCTS: product.STOCK_PRODUCTS || "",
              IMAGE_URL_PRODUCTS: product.IMAGE_URL_PRODUCTS || "",
              ID_COMPANY: product.ID_COMPANY || "",
            }
          : {
              ID_CATEGORIES_: "",
              NAME_PRODUCTS: "",
              DESCRIPTION_PRODUCTS: "",
              PRICE_PRODUCTS: "",
              STOCK_PRODUCTS: "",
              IMAGE_URL_PRODUCTS: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
            }
      );
    }

    fetchCategories();
    fetchCompanies();
  }, [open, product]);

  const fetchCategories = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await categoryServices.getCategories(companyId);
      setCategoryOptions(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data.DT);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fields = [
    {
      key: "ID_CATEGORIES_",
      label: "Loại sản phẩm",
      inputType: "autocomplete",
      options: categoryOptions,
      optionsLabel: "NAME_CATEGORIES_", // tùy thuộc tên trường của danh mục
      required: true,
    },
    {
      key: "NAME_PRODUCTS",
      label: "Tên sản phẩm",
      inputType: "text",
      required: true,
    },
    {
      key: "DESCRIPTION_PRODUCTS",
      label: "Mô tả sản phẩm",
      inputType: "text",
    },
    {
      key: "PRICE_PRODUCTS",
      label: "Giá sản phẩm",
      inputType: "number",
      required: true,
    },
    {
      key: "STOCK_PRODUCTS",
      label: "Số lượng tồn kho",
      inputType: "number",
      required: true,
    },
    {
      key: "IMAGE_URL_PRODUCTS",
      label: "URL hình ảnh",
      inputType: "file",
    },
    {
      key: "ID_COMPANY",
      label: "Thuộc công ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: userInfo?.companyInfo?.ID_COMPANY ? true : false,
    },
  ];

  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
    }));
  };

  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        ID_CATEGORIES_:
          submittedFormData.ID_CATEGORIES_ || formData.ID_CATEGORIES_,
        NAME_PRODUCTS:
          submittedFormData.NAME_PRODUCTS || formData.NAME_PRODUCTS,
        DESCRIPTION_PRODUCTS:
          submittedFormData.DESCRIPTION_PRODUCTS ||
          formData.DESCRIPTION_PRODUCTS,
        PRICE_PRODUCTS:
          submittedFormData.PRICE_PRODUCTS || formData.PRICE_PRODUCTS,
        STOCK_PRODUCTS:
          submittedFormData.STOCK_PRODUCTS || formData.STOCK_PRODUCTS,
        IMAGE_URL_PRODUCTS:
          submittedFormData.IMAGE_URL_PRODUCTS || formData.IMAGE_URL_PRODUCTS,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
      };

      if (product) {
        await productServices.updateProduct(product.ID_PRODUCT, dataToSubmit);
      } else {
        await productServices.createProduct(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      throw new Error("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.");
    }
  };

  const customActions = ({ handleSubmit, onClose }) => (
    <>
      <Button onClick={onClose} color="secondary">
        Hủy
      </Button>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Lưu
      </Button>
    </>
  );

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={fields}
      initialData={formData}
      title={product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default ProductsFormModal;
