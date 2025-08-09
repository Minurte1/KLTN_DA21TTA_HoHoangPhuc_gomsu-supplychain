import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import companyServices from "../../../services/companies-service";
import categoryServices from "../../../services/categoryServices";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import DynamicModal from "../../../share-view/dynamic/modal/modal";

const CategoriesFormModal = ({ open, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_CATEGORIES_: "",
    NAME_CATEGORIES_: "",
    ID_COMPANY: "",
  });

  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        category
          ? {
              ID_CATEGORIES_: category.ID_CATEGORIES_ || "",
              NAME_CATEGORIES_: category.NAME_CATEGORIES_ || "",
              ID_COMPANY: category.ID_COMPANY || "",
            }
          : {
              ID_CATEGORIES_: "",
              NAME_CATEGORIES_: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
            }
      );
    }

    fetchCompanies();
  }, [open, category, userInfo]);

  const fetchCompanies = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await companyServices.getCompanies(companyId);
      setCompaniesOptions(data.DT);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fields = [
    {
      key: "NAME_CATEGORIES_",
      label: "Tên danh mục",
      inputType: "text",
      required: true,
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
    const dataToSubmit = {
      NAME_CATEGORIES_:
        submittedFormData.NAME_CATEGORIES_ || formData.NAME_CATEGORIES_,
      ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
    };

    try {
      if (category) {
        // update category
        await categoryServices.updateCategory(
          category.ID_CATEGORIES_,
          dataToSubmit
        );
      } else {
        // create new category
        await categoryServices.createCategory(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving category:", error);
      throw new Error("Có lỗi xảy ra khi lưu danh mục. Vui lòng thử lại.");
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
      title={category ? "Sửa danh mục" : "Thêm danh mục"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default CategoriesFormModal;
