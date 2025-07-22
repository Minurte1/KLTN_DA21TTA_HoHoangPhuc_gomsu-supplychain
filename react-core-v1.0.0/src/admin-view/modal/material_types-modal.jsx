import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";
import materialTypeServices from "../../services/materialTypeServices";
import companyServices from "../../services/companies-service";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const MaterialTypeFormModal = ({ open, onClose, materialType, onSuccess }) => {
  const [formData, setFormData] = useState({
    NAME_MATERIAL_TYPES: "",
    ID_COMPANY: "", // Thêm ID_COMPANY
  });
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        materialType
          ? {
              NAME_MATERIAL_TYPES: materialType.NAME_MATERIAL_TYPES || "",
              ID_COMPANY: materialType.ID_COMPANY || "",
            }
          : {
              NAME_MATERIAL_TYPES: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || 0,
            }
      );
    }
    fetchCompanies();
  }, [open, materialType]);
  const fetchCompanies = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await companyServices.getCompanies(companyId);

      setCompaniesOptions(data.DT);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Cấu hình các trường input cho DynamicModal
  const fields = [
    {
      key: "NAME_MATERIAL_TYPES",
      label: "Tên loại vật liệu",
      required: true,
      inputType: "text",
    },
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete", // Sử dụng Autocomplete cho trường này
      options: companiesOptions, // Dữ liệu lựa chọn từ API
      optionsLabel: "NAME_COMPANY",
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
        NAME_MATERIAL_TYPES:
          submittedFormData.NAME_MATERIAL_TYPES || formData.NAME_MATERIAL_TYPES,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
      };

      if (materialType) {
        await materialTypeServices.updateMaterialType(
          materialType.ID_MATERIAL_TYPES,
          dataToSubmit
        );
      } else {
        await materialTypeServices.createMaterialType(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving material type:", error);
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
      title={materialType ? "Sửa loại vật liệu" : "Thêm loại vật liệu"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default MaterialTypeFormModal;
