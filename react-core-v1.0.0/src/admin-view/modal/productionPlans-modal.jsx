import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import productionPlanServices from "../../services/productionPlanServices";

import productServices from "../../services/productServices";
import companyServices from "../../services/companies-service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getAllUsers } from "../../services/userAccountService";

const ProductionPlansFormModal = ({
  open,
  onClose,
  productionPlan,
  onSuccess,
}) => {
  const { userInfo } = ReduxExportUseAuthState();

  const [formData, setFormData] = useState({
    ID_PRODUCT: "",
    ID_USERS: "",
    PLANNED_START_PRODUCTION_PLANS: "",
    PLANNED_END_PRODUCTION_PLANS: "",
    ACTUAL_START_PRODUCTION_PLANS: "",
    ACTUAL_END_PRODUCTION_PLANS: "",
    STATUS_PRODUCTION_PLANS: "",
    NOTE_PRODUCTION_PLANS: "",
    ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
    NAME_PRODUCTION_PLAN: "",
  });

  // State để chứa dữ liệu options
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const optionStatus = [
    { value: "PLANNED", label: "Đã Lập Kế Hoạch" },
    { value: "IN_PROGRESS", label: "Đang Tiến Hành" },
    { value: "COMPLETED", label: "Đã Hoàn Thành" },
    { value: "CANCELED", label: "Đã Hủy" },
  ];

  // Fetch dữ liệu khi modal mở hoặc userInfo thay đổi
  useEffect(() => {
    if (open && userInfo) {
      fetchProducts();
      fetchUsers();
      fetchCompanies();
    }
  }, [open, userInfo]);

  const fetchProducts = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await productServices.getProducts({ ID_COMPANY: companyId });
      // Giả sử data trả về có cấu trúc { DT: [...] }
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await getAllUsers(companyId);
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompanies(data.DT || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  console.log("product", products);
  useEffect(() => {
    if (open) {
      setFormData(
        productionPlan
          ? {
              ID_PRODUCT: productionPlan.ID_PRODUCT || "",
              ID_USERS: productionPlan.ID_USERS || "",
              PLANNED_START_PRODUCTION_PLANS:
                productionPlan.PLANNED_START_PRODUCTION_PLANS
                  ? productionPlan.PLANNED_START_PRODUCTION_PLANS.split("T")[0]
                  : "",
              PLANNED_END_PRODUCTION_PLANS:
                productionPlan.PLANNED_END_PRODUCTION_PLANS
                  ? productionPlan.PLANNED_END_PRODUCTION_PLANS.split("T")[0]
                  : "",
              ACTUAL_START_PRODUCTION_PLANS:
                productionPlan.ACTUAL_START_PRODUCTION_PLANS
                  ? productionPlan.ACTUAL_START_PRODUCTION_PLANS.split("T")[0]
                  : "",
              ACTUAL_END_PRODUCTION_PLANS:
                productionPlan.ACTUAL_END_PRODUCTION_PLANS
                  ? productionPlan.ACTUAL_END_PRODUCTION_PLANS.split("T")[0]
                  : "",
              STATUS_PRODUCTION_PLANS:
                productionPlan.STATUS_PRODUCTION_PLANS || "",
              NOTE_PRODUCTION_PLANS: productionPlan.NOTE_PRODUCTION_PLANS || "",
              ID_COMPANY:
                productionPlan.ID_COMPANY ||
                userInfo?.companyInfo?.ID_COMPANY ||
                "",
              NAME_PRODUCTION_PLAN: productionPlan.NAME_PRODUCTION_PLAN || "",
            }
          : {
              ID_PRODUCT: "",
              ID_USERS: "",
              PLANNED_START_PRODUCTION_PLANS: "",
              PLANNED_END_PRODUCTION_PLANS: "",
              ACTUAL_START_PRODUCTION_PLANS: "",
              ACTUAL_END_PRODUCTION_PLANS: "",
              STATUS_PRODUCTION_PLANS: "",
              NOTE_PRODUCTION_PLANS: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
              NAME_PRODUCTION_PLAN: "",
            }
      );
    }
  }, [open, productionPlan, userInfo]);
  console.log("user", users);
  // Chỉnh sửa fields cho 3 trường select
  const fields = [
    {
      key: "NAME_PRODUCTION_PLAN",
      label: "Tên Kế Hoạch",
      inputType: "text",
      required: true,
    },
    {
      key: "ID_PRODUCT",
      label: "Sản Phẩm Mong Muốn",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      required: true,
      options: products,
      optionsLabel: "NAME_PRODUCTS",
    },
    {
      key: "ID_USERS",
      label: "Người Thực Hiện",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      required: true,
      options: users,
      optionsLabel: "HO_TEN",
    },
    {
      key: "PLANNED_START_PRODUCTION_PLANS",
      label: "Ngày Bắt Đầu Dự Kiến",
      inputType: "datetime",
      required: true,
    },
    {
      key: "PLANNED_END_PRODUCTION_PLANS",
      label: "Ngày Kết Thúc Dự Kiến",
      inputType: "datetime",
      required: true,
    },
    {
      key: "ACTUAL_START_PRODUCTION_PLANS",
      label: "Ngày Bắt Đầu Thực Tế",
      inputType: "datetime",
    },
    {
      key: "ACTUAL_END_PRODUCTION_PLANS",
      label: "Ngày Kết Thúc Thực Tế",
      inputType: "datetime",
    },
    {
      key: "STATUS_PRODUCTION_PLANS",
      label: "Trạng Thái",
      inputType: "select",
      options: optionStatus,

      required: true,
    },
    { key: "NOTE_PRODUCTION_PLANS", label: "Ghi Chú", inputType: "text" },
    {
      key: "ID_COMPANY",
      label: "Công Ty",
      inputType: "autocomplete",
      disabled: true,
      options: companies,
      optionsLabel: "NAME_COMPANY",
      disabled: userInfo.companyInfo.ID_COMPANY ? true : false,
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
        ...formData,
        ...submittedFormData,
      };

      if (productionPlan) {
        await productionPlanServices.updateProductionPlan(
          productionPlan.ID_PRODUCTION_PLANS,
          dataToSubmit
        );
      } else {
        await productionPlanServices.createProductionPlan(dataToSubmit);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving production plan:", error);
      throw new Error("Có lỗi xảy ra khi lưu kế hoạch sản xuất.");
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
      title={
        productionPlan ? "Sửa Kế Hoạch Sản Xuất" : "Thêm Kế Hoạch Sản Xuất"
      }
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default ProductionPlansFormModal;
