import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DynamicModal from "../../share-view/dynamic/modal/modal";

import companyServices from "../../services/companies-service";
import equipmentServices from "../../services/equipmentServices";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const EquipmentFormModal = ({ open, onClose, equipment, onSuccess }) => {
  const [formData, setFormData] = useState({
    NAME_EQUIPMENT: "",
    TYPE_EQUIPMENT: "",
    STATUS: "",
    LAST_MAINTENANCE: "",
    ID_COMPANY: "",
  });

  const [companiesOptions, setCompaniesOptions] = useState([]);
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    if (open) {
      setFormData(
        equipment
          ? {
              NAME_EQUIPMENT: equipment.NAME_EQUIPMENT || "",
              TYPE_EQUIPMENT: equipment.TYPE_EQUIPMENT || "",
              STATUS: equipment.STATUS || "",
              LAST_MAINTENANCE: equipment.LAST_MAINTENANCE
                ? equipment.LAST_MAINTENANCE.split("T")[0]
                : "",
              ID_COMPANY: equipment.ID_COMPANY || "",
            }
          : {
              NAME_EQUIPMENT: "",
              TYPE_EQUIPMENT: "",
              STATUS: "",
              LAST_MAINTENANCE: "",
              ID_COMPANY: userInfo?.companyInfo?.ID_COMPANY || "",
            }
      );
    }

    fetchCompanies();
  }, [open, equipment]);

  const fetchCompanies = async () => {
    try {
      const data = await companyServices.getCompanies();
      setCompaniesOptions(data.DT);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const optionStatus = [
    { value: "ACTIVE", label: "Hoạt động", STATUS: "ACTIVE" },
    { value: "INACTIVE", label: "Không hoạt động", STATUS: "INACTIVE" },
    { value: "MAINTENANCE", label: "Đang bảo trì", STATUS: "MAINTENANCE" },
    { value: "RETIRED", label: "Đã ngưng sử dụng", STATUS: "RETIRED" },
  ];

  const fields = [
    {
      key: "NAME_EQUIPMENT",
      label: "Tên thiết bị",
      inputType: "text",
      required: true,
    },
    {
      key: "TYPE_EQUIPMENT",
      label: "Loại thiết bị",
      inputType: "text",
      required: true,
    },
    {
      key: "STATUS",
      label: "Trạng thái",
      inputType: "autocomplete",
      options: optionStatus,
      optionsLabel: "label",
      required: true,
    },
    {
      key: "LAST_MAINTENANCE",
      label: "Ngày bảo trì gần nhất",
      inputType: "date",
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
        NAME_EQUIPMENT:
          submittedFormData.NAME_EQUIPMENT || formData.NAME_EQUIPMENT,
        TYPE_EQUIPMENT:
          submittedFormData.TYPE_EQUIPMENT || formData.TYPE_EQUIPMENT,
        STATUS: submittedFormData.STATUS || formData.STATUS,
        LAST_MAINTENANCE:
          submittedFormData.LAST_MAINTENANCE || formData.LAST_MAINTENANCE,
        ID_COMPANY: submittedFormData.ID_COMPANY || formData.ID_COMPANY,
      };

      if (equipment) {
        await equipmentServices.updateEquipment(
          equipment.ID_EQUIPMENT,
          dataToSubmit
        );
      } else {
        await equipmentServices.createEquipment(dataToSubmit);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving equipment:", error);
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
      title={equipment ? "Sửa thiết bị" : "Thêm thiết bị"}
      renderActions={customActions}
      onChange={handleFormChange}
    />
  );
};

export default EquipmentFormModal;
