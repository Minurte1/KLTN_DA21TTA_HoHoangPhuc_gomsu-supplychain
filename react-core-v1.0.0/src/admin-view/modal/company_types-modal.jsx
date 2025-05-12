import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import companyTypeServices from "../../services/company_types-service";

const CompanyTypeFormModal = ({ open, onClose, companyType, onSuccess }) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    NAME_COMPANY_TYPE: "",
  });

  // Khởi tạo dữ liệu khi mở modal hoặc có dữ liệu truyền vào
  useEffect(() => {
    if (open) {
      setFormData(
        companyType
          ? {
              NAME_COMPANY_TYPE: companyType.NAME_COMPANY_TYPE || "",
            }
          : {
              NAME_COMPANY_TYPE: "",
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
  ];

  // Xử lý thay đổi form
  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      NAME_COMPANY_TYPE:
        updatedFormData.NAME_COMPANY_TYPE !== undefined
          ? updatedFormData.NAME_COMPANY_TYPE
          : prev.NAME_COMPANY_TYPE,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        NAME_COMPANY_TYPE:
          submittedFormData.NAME_COMPANY_TYPE || formData.NAME_COMPANY_TYPE,
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
