import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import companyTypeServices from "../../services/company_types-service";

const CompanyTypeFormModal = ({ open, onClose, companyType, onSuccess }) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    NAME_COMPANY_TYPE: "",
    ROUTER_COMPANY: "",
  });

  // Khởi tạo dữ liệu khi mở modal hoặc có dữ liệu truyền vào
  useEffect(() => {
    if (open) {
      setFormData(
        companyType
          ? {
              NAME_COMPANY_TYPE: companyType.NAME_COMPANY_TYPE || "",
              ROUTER_COMPANY: companyType.ROUTER_COMPANY || "",
            }
          : {
              NAME_COMPANY_TYPE: "",
              ROUTER_COMPANY: "",
            }
      );
    }
  }, [open, companyType]);

  // Cấu hình các trường input cho DynamicModal
  const fields = [
    {
      key: "NAME_COMPANY_TYPE",
      label: "Tên loại công ty",
      required: true,
      inputType: "text",
    },
    {
      key: "ROUTER_COMPANY",
      label: "Phân loại quyền hạn",
      required: true,
      inputType: "text",
    },
  ];

  // Xử lý thay đổi form
  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      NAME_COMPANY_TYPE:
        updatedFormData.NAME_COMPANY_TYPE !== undefined
          ? updatedFormData.NAME_COMPANY_TYPE
          : prev.NAME_COMPANY_TYPE,
      ROUTER_COMPANY:
        updatedFormData.ROUTER_COMPANY !== undefined
          ? updatedFormData.ROUTER_COMPANY
          : prev.ROUTER_COMPANY,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        NAME_COMPANY_TYPE:
          submittedFormData.NAME_COMPANY_TYPE || formData.NAME_COMPANY_TYPE,
        ROUTER_COMPANY:
          submittedFormData.ROUTER_COMPANY || formData.ROUTER_COMPANY,
      };

      if (companyType) {
        await companyTypeServices.updateCompanyType(
          companyType.ID_COMPANY_TYPE,
          dataToSubmit
        );
      } else {
        await companyTypeServices.createCompanyType(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving company type:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    }
  };

  // Nút custom trong modal
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
      title={companyType ? "Sửa loại công ty" : "Thêm loại công ty"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default CompanyTypeFormModal;
