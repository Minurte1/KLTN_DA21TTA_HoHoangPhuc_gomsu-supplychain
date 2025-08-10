import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import productServices from "../../services/productServices";
import productionPlanServices from "../../services/productionPlanServices";
import companyServices from "../../services/companies-service";

import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import productInstancesServices from "../../services/product_instancesServices";

const ProductsInstanceFormModal = ({
  open,
  onClose,
  productInstance,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    UID: "",
    ID_PRODUCT: "",
    SERIAL_CODE: "",
    ID_USERS: "",
    ID_PRODUCTION_PLANS: "",
    STATUS: "IN_STOCK",
    ID_COMPANY: "",
  });

  const [productsOptions, setProductsOptions] = useState([]);
  const [productionPlansOptions, setProductionPlansOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        productInstance
          ? {
              UID: productInstance.UID || "",
              ID_PRODUCT: productInstance.ID_PRODUCT || "",
              SERIAL_CODE: productInstance.SERIAL_CODE || "",
              ID_USERS: productInstance.ID_USERS || "",
              ID_PRODUCTION_PLANS: productInstance.ID_PRODUCTION_PLANS || "",
              STATUS: productInstance.STATUS || "IN_STOCK",
              ID_COMPANY: productInstance.ID_COMPANY || "",
            }
          : {
              UID: "",
              ID_PRODUCT: "",
              SERIAL_CODE: "",
              ID_USERS: "",
              ID_PRODUCTION_PLANS: "",
              STATUS: "IN_STOCK",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
            }
      );
    }

    fetchProducts();
    fetchProductionPlans();
    fetchCompanies();
  }, [open, productInstance]);

  const fetchProducts = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await productServices.getProducts({ ID_COMPANY: companyId });
      setProductsOptions(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductionPlans = async () => {
    try {
      const ID_COMPANY = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await productionPlanServices.getProductionPlans(ID_COMPANY);
      setProductionPlansOptions(data);
    } catch (error) {
      console.error("Error fetching production plans:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data.DT || data); // tùy backend trả về
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const optionStatus = [
    { value: "AVAILABLE", label: "Còn hàng" },
    { value: "OUT_OF_STOCK", label: "Hết hàng" },
    { value: "DISCONTINUED", label: "Ngừng kinh doanh" },
    { value: "SOLD", label: "Đã bán" },
    { value: "RESERVED", label: "Đã đặt trước" },
    { value: "DAMAGED", label: "Bị hư hỏng" },
  ];

  const fields = [
    {
      key: "UID",
      label: "UID (Mã định danh)",
      inputType: "text",
      required: true,
      disabled: !!productInstance, // không sửa UID khi edit
    },
    {
      key: "ID_PRODUCT",
      label: "Sản phẩm",
      inputType: "autocomplete",
      options: productsOptions,
      optionsLabel: "NAME_PRODUCTS", // giả sử tên trường sản phẩm
      required: true,
    },
    {
      key: "SERIAL_CODE",
      label: "Mã Serial",
      inputType: "text",
      required: true,
    },
    {
      key: "ID_USERS",
      label: "Người dùng (ID_USERS)",
      inputType: "text",
      required: true,
    },
    {
      key: "ID_PRODUCTION_PLANS",
      label: "Kế hoạch sản xuất",
      inputType: "autocomplete",
      options: productionPlansOptions,
      optionsLabel: "NAME_PRODUCTION_PLAN", // giả sử tên trường kế hoạch
      required: false,
    },
    {
      key: "ID_COMPANY",
      label: "Công ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: userInfo?.companyInfo?.ID_COMPANY ? true : false,
    },
    {
      key: "STATUS",

      label: "Trạng thái",
      inputType: "select",
      options: optionStatus,

      required: true,
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
        UID: submittedFormData.UID || formData.UID,
        ID_PRODUCT: submittedFormData.ID_PRODUCT || formData.ID_PRODUCT,
        SERIAL_CODE: submittedFormData.SERIAL_CODE || formData.SERIAL_CODE,
        ID_USERS: submittedFormData.ID_USERS || formData.ID_USERS,
        ID_PRODUCTION_PLANS:
          submittedFormData.ID_PRODUCTION_PLANS || formData.ID_PRODUCTION_PLANS,
        STATUS: submittedFormData.STATUS || formData.STATUS,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
      };

      if (productInstance) {
        await productInstancesServices.updateProductInstance(
          productInstance.ID_PRODUCT_INSTANCE,
          dataToSubmit
        );
      } else {
        await productInstancesServices.createProductInstance(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving product instance:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
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
      title={productInstance ? "Sửa bản ghi sản phẩm" : "Thêm bản ghi sản phẩm"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default ProductsInstanceFormModal;
