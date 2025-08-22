import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import materialTypeServices from "../../services/materialTypeServices";
import companyServices from "../../services/companies-service";
import materialServices from "../../services/materialServices";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const MaterialsFormModal = ({ open, onClose, material, onSuccess }) => {
  const [formData, setFormData] = useState({
    ID_MATERIAL_TYPES: "",
    NAME_MATERIALS: "",
    UNIT_MATERIALS: "",
    QUANTITY_ORDER_ITEMS: "",
    COST_PER_UNIT_: "",
    ORIGIN: "",
    EXPIRY_DATE: "",
    ID_COMPANY: "",
    STATUS: "",
  });

  const [materialTypesOptions, setMaterialTypesOptions] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        material
          ? {
              ID_MATERIAL_TYPES: material.ID_MATERIAL_TYPES || "",
              NAME_MATERIALS: material.NAME_ || "",
              UNIT_MATERIALS: material.UNIT_ || "",
              QUANTITY_ORDER_ITEMS: material.QUANTITY || "",
              COST_PER_UNIT_: material.COST_PER_UNIT_ || "",
              ORIGIN: material.ORIGIN || "",
              EXPIRY_DATE: material.EXPIRY_DATE
                ? material.EXPIRY_DATE.split("T")[0]
                : "",
              ID_COMPANY: material.ID_COMPANY || "",
              STATUS: material.STATUS || "",
            }
          : {
              ID_MATERIAL_TYPES: "",
              NAME_MATERIALS: "",
              UNIT_MATERIALS: "",
              QUANTITY_ORDER_ITEMS: "",
              COST_PER_UNIT_: "",
              ORIGIN: "",
              EXPIRY_DATE: "",
              STATUS: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || 0,
            }
      );
    }

    fetchMaterialTypes();
    fetchCompanies();
  }, [open, material]);

  const fetchMaterialTypes = async () => {
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data = await materialTypeServices.getMaterialTypes(companyId);
      setMaterialTypesOptions(data);
    } catch (error) {
      console.error("Error fetching material types:", error);
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

  const optionStatus = [
    { value: "ACTIVE", label: "Đang bán, còn hàng", STATUS: "ACTIVE" },
    {
      value: "HIDDEN",
      label: "Không hiển thị để bán nhưng vẫn còn kho",
      STATUS: "HIDDEN",
    },
    { value: "OUT", label: "Hết hàng, không đặt mua được", STATUS: "OUT" },
    { value: "STOP", label: "Ngừng kinh doanh vĩnh viễn", STATUS: "STOP" },
    { value: "PENDING", label: "Đang chờ duyệt từ admin", STATUS: "PENDING" },
  ];

  const fields = [
    {
      key: "ID_MATERIAL_TYPES",
      label: "Loại vật liệu",
      inputType: "autocomplete",
      options: materialTypesOptions,
      optionsLabel: "NAME_MATERIAL_TYPES",
      required: true,
    },
    {
      key: "NAME_MATERIALS",
      label: "Tên vật liệu",
      inputType: "text",
      required: true,
    },
    {
      key: "UNIT_MATERIALS",
      label: "Đơn vị tính",
      inputType: "text",
      required: true,
    },
    {
      key: "QUANTITY_ORDER_ITEMS",
      label: "Số lượng",
      inputType: "number",
      required: true,
    },
    {
      key: "COST_PER_UNIT_",
      label: "Giá mỗi đơn vị",
      inputType: "number",
      required: true,
    },
    {
      key: "ORIGIN",
      label: "Xuất xứ",
      inputType: "text",
    },
    {
      key: "EXPIRY_DATE",
      label: "Hạn sử dụng",
      inputType: "datetime",
    },
    {
      key: "ID_COMPANY",
      label: "Thuộc Công Ty",
      inputType: "autocomplete",
      options: companiesOptions,
      optionsLabel: "NAME_COMPANY",
      required: true,
      disabled: userInfo?.companyInfo?.ID_COMPANY ? true : false,
    },
    {
      key: "STATUS",
      label: "Trạng thái",
      inputType: "autocomplete",
      options: optionStatus,
      optionsLabel: "label",
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
        ID_MATERIAL_TYPES:
          submittedFormData.ID_MATERIAL_TYPES || formData.ID_MATERIAL_TYPES,
        NAME_MATERIALS:
          submittedFormData.NAME_MATERIALS || formData.NAME_MATERIALS,
        UNIT_MATERIALS:
          submittedFormData.UNIT_MATERIALS || formData.UNIT_MATERIALS,
        QUANTITY_ORDER_ITEMS:
          submittedFormData.QUANTITY_ORDER_ITEMS ||
          formData.QUANTITY_ORDER_ITEMS,
        COST_PER_UNIT_:
          submittedFormData.COST_PER_UNIT_ || formData.COST_PER_UNIT_,
        ORIGIN: submittedFormData.ORIGIN || formData.ORIGIN,
        EXPIRY_DATE: submittedFormData.EXPIRY_DATE || formData.EXPIRY_DATE,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
        STATUS: submittedFormData.STATUS || formData.STATUS,
      };

      if (material) {
        await materialServices.updateMaterial(
          material.ID_MATERIALS_,
          dataToSubmit
        );
      } else {
        await materialServices.createMaterial(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving material:", error);
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
      title={material ? "Sửa vật liệu" : "Thêm vật liệu"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default MaterialsFormModal;
