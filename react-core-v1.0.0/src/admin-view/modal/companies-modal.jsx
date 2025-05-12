import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import companyServices from "../../services/companies-service";
import companyTypeServices from "../../services/company_types-service";

const CompanyFormModal = ({ open, onClose, company, onSuccess }) => {
  const [formData, setFormData] = useState({
    NAME_COMPANY: "",
    TYPE_COMPANY: "",
    ADDRESS: "",
    DIA_CHI_Provinces: "",
    DIA_CHI_Districts: "",
    DIA_CHI_Wards: "",
    DIA_CHI_STREETNAME: "",
    PHONE: "",
    EMAIL: "",
    AVATAR: "",
    SLUG: "",
    STATUS: "ACTIVE",
    ID_COMPANY_TYPE: 0,
  });

  const [companyTypes, setCompanyTypes] = useState([]);

  // Gọi API để lấy dữ liệu loại công ty
  const fetchCompanyTypes = async () => {
    try {
      const data = await companyTypeServices.getCompanyTypes();
      setCompanyTypes(data);
    } catch (error) {
      console.error("Error fetching company types:", error);
    }
  };

  // Khởi tạo dữ liệu khi mở modal hoặc có dữ liệu truyền vào
  useEffect(() => {
    if (open) {
      fetchCompanyTypes(); // Gọi API khi modal mở
      if (company) {
        setFormData({
          NAME_COMPANY: company.NAME_COMPANY || "",
          TYPE_COMPANY: company.TYPE_COMPANY || "",
          ADDRESS: company.ADDRESS || "",
          DIA_CHI_Provinces: company.DIA_CHI_Provinces || "",
          DIA_CHI_Districts: company.DIA_CHI_Districts || "",
          DIA_CHI_Wards: company.DIA_CHI_Wards || "",
          DIA_CHI_STREETNAME: company.DIA_CHI_STREETNAME || "",
          PHONE: company.PHONE || "",
          EMAIL: company.EMAIL || "",
          AVATAR: company.AVATAR || "",
          SLUG: company.SLUG || "",
          STATUS: company.STATUS || "ACTIVE",
          ID_COMPANY_TYPE: company.ID_COMPANY_TYPE || "",
        });
      }
    }
  }, [open, company]);

  // Xử lý thay đổi form
  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (submittedFormData) => {
    try {
      const dataToSubmit = {
        NAME_COMPANY: submittedFormData.NAME_COMPANY || formData.NAME_COMPANY,
        TYPE_COMPANY: submittedFormData.TYPE_COMPANY || formData.TYPE_COMPANY,
        ADDRESS: submittedFormData.ADDRESS || formData.ADDRESS,
        DIA_CHI_Provinces:
          submittedFormData.DIA_CHI_Provinces || formData.DIA_CHI_Provinces,
        DIA_CHI_Districts:
          submittedFormData.DIA_CHI_Districts || formData.DIA_CHI_Districts,
        DIA_CHI_Wards:
          submittedFormData.DIA_CHI_Wards || formData.DIA_CHI_Wards,
        DIA_CHI_STREETNAME:
          submittedFormData.DIA_CHI_STREETNAME || formData.DIA_CHI_STREETNAME,
        PHONE: submittedFormData.PHONE || formData.PHONE,
        EMAIL: submittedFormData.EMAIL || formData.EMAIL,
        AVATAR: submittedFormData.AVATAR || formData.AVATAR,
        SLUG: submittedFormData.SLUG || formData.SLUG,
        STATUS: submittedFormData.STATUS || formData.STATUS,
        ID_COMPANY_TYPE:
          submittedFormData.ID_COMPANY_TYPE || formData.ID_COMPANY_TYPE,
      };

      if (company) {
        // Cập nhật thông tin công ty
        await companyServices.updateCompany(company.ID_COMPANY, dataToSubmit);
      } else {
        // Thêm công ty mới
        await companyServices.createCompany(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving company:", error);
      throw new Error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    }
  };

  // Cấu hình các trường input cho DynamicModal
  const fields = [
    {
      key: "NAME_COMPANY",
      label: "Tên công ty",
      required: true,
      inputType: "text",
    },
    {
      key: "TYPE_COMPANY",
      label: "Loại công ty",
      required: true,
      inputType: "text",
    },
    { key: "ADDRESS", label: "Địa chỉ", inputType: "text" },
    { key: "DIA_CHI_Provinces", label: "Tỉnh/Thành phố", inputType: "text" },
    { key: "DIA_CHI_Districts", label: "Quận/Huyện", inputType: "text" },
    { key: "DIA_CHI_Wards", label: "Phường/Xã", inputType: "text" },
    { key: "DIA_CHI_STREETNAME", label: "Tên đường", inputType: "text" },
    { key: "PHONE", label: "Số điện thoại", inputType: "text" },
    { key: "EMAIL", label: "Email", inputType: "email" },
    { key: "AVATAR", label: "Ảnh đại diện", inputType: "text" },
    { key: "SLUG", label: "Định danh URL", inputType: "text" },
    {
      key: "STATUS",
      label: "Trạng thái",
      inputType: "text",
      options: ["ACTIVE", "INACTIVE"],
    },
    {
      key: "ID_COMPANY_TYPE",
      label: "ID Loại công ty",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      options: companyTypes, // Dữ liệu lựa chọn từ API
      optionsLabel: "NAME_COMPANY_TYPE",
    },
  ];

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
      title={company ? "Sửa công ty" : "Thêm công ty"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default CompanyFormModal;
